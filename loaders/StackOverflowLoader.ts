import { EntryType } from "../models/Entry"
import fetch from "node-fetch"
import { decode as decodeHTMLEntities } from "html-entities"
import { LoaderEntriesCache } from "./LoaderEntriesCache"
import {
  StackOverflowEntry,
  StackOverflowPostType,
} from "../models/StackOverflowEntry"

interface StackOverflowAPIPost {
  creation_date: number
  post_type: StackOverflowPostType
  post_id: number
  link: string
}

interface StackOverflowAPIQuestion {
  title: string
  tags: string[]
  creation_date: number
  link: string
  question_id: number
}

interface StackOverflowAPIAnswer {
  title: string
  creation_date: number
  answer_id: number
  question_id: number
}

interface StackOverflowAPIResponse<Item> {
  items: Item[]
}

interface StackOverflowAPIErrorResponse {
  error_id: number
  error_message: string
}

export class StackOverflowLoader {
  private cache: LoaderEntriesCache<StackOverflowEntry>

  constructor() {
    if (process.env["STACK_OVERFLOW_CACHE_TIMEOUT"] !== undefined) {
      this.cache = new LoaderEntriesCache(
        this.loadEntries.bind(this),
        parseInt(process.env["STACK_OVERFLOW_CACHE_TIMEOUT"]),
      )
    } else if (process.env["CACHE_TIMEOUT"] !== undefined) {
      this.cache = new LoaderEntriesCache(
        this.loadEntries.bind(this),
        parseInt(process.env["CACHE_TIMEOUT"]),
      )
    } else {
      this.cache = new LoaderEntriesCache(this.loadEntries.bind(this))
    }
  }

  getEntries(): Promise<StackOverflowEntry[]> {
    return this.cache.entries
  }

  private async loadEntries(): Promise<StackOverflowEntry[]> {
    console.debug("Loading StackOverflow posts")

    try {
      const posts = await this.loadPosts()
      const questionPosts = posts.filter(
        (post) => post.post_type === "question",
      )
      const answerPosts = posts.filter((post) => post.post_type === "answer")
      const answerIds = answerPosts.map((answer) => answer.post_id)

      const apiAnswers = await this.loadAnswers(answerIds)

      const questionIds = questionPosts
        .map((question) => question.post_id)
        .concat(apiAnswers.map((answer) => answer.question_id))

      const apiQuestions = await this.loadQuestions(questionIds)

      let entries: StackOverflowEntry[] = []

      const questions: StackOverflowEntry[] = questionPosts.reduce(
        (questions: StackOverflowEntry[], questionPost) => {
          const apiQuestion = apiQuestions.find(
            (question) => question.question_id === questionPost.post_id,
          )

          if (!apiQuestion) {
            return questions
          }

          const unescapedTitle = decodeHTMLEntities(apiQuestion.title)
          questions.push({
            title: `Posted question to StackOverflow: ${unescapedTitle}`,
            date: new Date(apiQuestion.creation_date * 1000).toISOString(),
            url: apiQuestion.link,
            tags: apiQuestion.tags,
            postType: "question",
            postId: apiQuestion.question_id,
            slug: `question-${apiQuestion.question_id}`,
            type: EntryType.StackOverflowEntry,
          })

          return questions
        },
        [],
      )

      const answers: StackOverflowEntry[] = answerPosts.reduce(
        (answers: StackOverflowEntry[], answerPost) => {
          const apiAnswer = apiAnswers.find(
            (answer) => answer.answer_id === answerPost.post_id,
          )

          if (!apiAnswer) {
            return answers
          }

          const apiQuestion = apiQuestions.find(
            (question) => question.question_id === apiAnswer.question_id,
          )

          if (!apiQuestion) {
            return answers
          }

          const unescapedTitle = decodeHTMLEntities(apiQuestion.title)
          answers.push({
            title: `Provided answer on StackOverflow to the question ${unescapedTitle}`,
            date: new Date(apiAnswer.creation_date * 1000).toISOString(),
            url: `${apiQuestion.link}/${apiAnswer.answer_id}#${apiAnswer.answer_id}`,
            tags: apiQuestion.tags,
            postType: "answer",
            postId: apiAnswer.answer_id,
            slug: `answer-${apiAnswer.answer_id}`,
            type: EntryType.StackOverflowEntry,
          })

          return answers
        },
        [],
      )

      entries = entries.concat(questions).concat(answers)

      console.debug("Loaded StackOverflow entries")

      return entries
    } catch (error) {
      if (objectIsErrorResponse(error)) {
        console.warn("StackOverflow API is throttling:", error.error_message)
        return []
      } else {
        console.log("Error calling StackOverflow API", error)
        if (process.env.NODE_ENV === "production") {
          return []
        } else {
          throw error
        }
      }
    }
  }

  private async loadPosts(): Promise<StackOverflowAPIPost[]> {
    return this.loadAPI(
      `/users/657676/posts?order=desc&sort=creation&site=stackoverflow`,
    )
  }

  private async loadQuestions(
    ids: number[],
  ): Promise<StackOverflowAPIQuestion[]> {
    const idsParameter = ids.join(";")
    return this.loadAPI(
      `/questions/${idsParameter}?order=desc&sort=creation&site=stackoverflow`,
    )
  }

  private async loadAnswers(ids: number[]): Promise<StackOverflowAPIAnswer[]> {
    const idsParameter = ids.join(";")
    return this.loadAPI(
      `/answers/${idsParameter}?order=desc&sort=creation&site=stackoverflow`,
    )
  }

  private async loadAPI<Item>(path: string): Promise<Item[]> {
    const url = `https://api.stackexchange.com/2.2${path}`
    console.debug(
      `Performing API request to StackExchange API with url: ${url}`,
    )
    const response = await fetch(url, {
      headers: {
        "Accept-Encoding": "GZIP",
      },
    })
    const jsonObject = await response.json()

    if (typeof jsonObject !== "object") {
      throw "Response was not an object"
    }

    if (jsonObject === null) {
      throw "No response"
    }

    if (objectIsErrorResponse(jsonObject)) {
      throw jsonObject
    } else if (objectIsResponse<Item>(jsonObject)) {
      return jsonObject.items
    } else {
      throw "Unknown response type"
    }
  }
}

function objectIsResponse<Items>(
  object: unknown,
): object is StackOverflowAPIResponse<Items> {
  return Object.prototype.hasOwnProperty.call(object, "items")
}

function objectIsErrorResponse(
  object: unknown,
): object is StackOverflowAPIErrorResponse {
  return (
    Object.prototype.hasOwnProperty.call(object, "error_id") &&
    Object.prototype.hasOwnProperty.call(object, "error_message")
  )
}

const loader = new StackOverflowLoader()

export default loader
