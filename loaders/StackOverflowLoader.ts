import { EntryType } from "../models/Entry"
import https from "https"
import zlib from "zlib"
import { AllHtmlEntities } from "html-entities"
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
      const questionPosts = posts.filter(post => post.post_type === "question")
      const answerPosts = posts.filter(post => post.post_type === "answer")
      const answerIds = answerPosts.map(answer => answer.post_id)

      const apiAnswers = await this.loadAnswers(answerIds)

      const questionIds = questionPosts
        .map(question => question.post_id)
        .concat(apiAnswers.map(answer => answer.question_id))

      const apiQuestions = await this.loadQuestions(questionIds)

      let entries: StackOverflowEntry[] = []

      const entities = new AllHtmlEntities()

      const questions: StackOverflowEntry[] = questionPosts.reduce(
        (questions: StackOverflowEntry[], questionPost) => {
          const apiQuestion = apiQuestions.find(
            question => question.question_id === questionPost.post_id,
          )

          if (!apiQuestion) {
            return questions
          }

          const unescapedTitle = entities.decode(apiQuestion.title)
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
            answer => answer.answer_id === answerPost.post_id,
          )

          if (!apiAnswer) {
            return answers
          }

          const apiQuestion = apiQuestions.find(
            question => question.question_id === apiAnswer.question_id,
          )

          if (!apiQuestion) {
            return answers
          }

          const unescapedTitle = entities.decode(apiQuestion.title)
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
      if (error["error_id"] === 502) {
        console.warn("StackOverflow API is throttling:", error["error_message"])
        return []
      } else {
        throw error
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

  private async loadAPI<Response>(path: string): Promise<Response> {
    const url = `https://api.stackexchange.com/2.2${path}`
    console.debug(
      `Performing API request to StackExchange API with url: ${url}`,
    )
    return new Promise<Response>((resolve, reject) => {
      https
        .get(url, response => {
          const gunzip = zlib.createGunzip()
          const buffer: string[] = []

          gunzip
            .on("data", data => {
              buffer.push(data.toString())
            })
            .on("end", () => {
              const json = buffer.join("")
              const jsonObject = JSON.parse(json)
              if ("error_id" in jsonObject) {
                reject(jsonObject)
              } else if ("items" in jsonObject) {
                resolve(jsonObject.items)
              } else {
                reject("Unknown response type")
              }
            })
            .on("error", err => {
              console.error("Error with StackExchange API response", err)
              reject(err)
            })

          response.pipe(gunzip)
        })
        .on("error", err => {
          console.error("Network error with StackExchange API", err)
          reject(err)
        })
    })
  }
}

const loader = new StackOverflowLoader()

export default loader
