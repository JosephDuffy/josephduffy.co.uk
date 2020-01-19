import matter from 'gray-matter'
import glob from 'glob'
import path from 'path'
import fs from 'fs'
import { Entry } from './EntriesLoader'
import https from 'https'
import { ReactNode } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import TagsList from '../../components/TagsList'
import zlib from 'zlib'
import { AllHtmlEntities } from 'html-entities'

interface StackOverflowAPIPost {
  creation_date: number
  post_type: "answer" | "question"
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

export type StackOverflowPostType = "answer" | "question"

export interface StackOverflowEntry extends Entry {
  postType: StackOverflowPostType
  postId: number
}

export class StackOverflowQuestion implements StackOverflowEntry {
  title: string
  date: Date
  url: string
  tags: string[]
  postType: StackOverflowPostType
  postId: number

  constructor(title: string, date: Date, url: string, tags: string[], postType: StackOverflowPostType, postId: number) {
    this.title = title
    this.date = date
    this.url = url
    this.tags = tags
    this.postType = postType
    this.postId = postId
  }

  preview(): ReactNode {
    // Without `new Date` is will sometimes crash 🤷‍♂️
    const formattedDate = format(new Date(this.date), 'do MMMM, y')

    return (
      <article key={this.postId}>
        <header>
          <Link href={this.url}>
            <a>
              <h1>{this.title}</h1>
            </a>
          </Link>
          Posted { formattedDate }
          {this.tags.length > 0 &&
            <TagsList tags={this.tags}/>
          }
        </header>
      </article>
    )
  }
}

export class StackOverflowLoader {

  private cachedEntries?: StackOverflowEntry[]

  async getEntries(forceRefresh: boolean = false): Promise<StackOverflowEntry[]> {
    if (!forceRefresh && this.cachedEntries) {
      return this.cachedEntries
    }

    console.debug("Loading StackOverflow posts")

    const posts = await this.loadPosts()
    const questionPosts = posts.filter(post => post.post_type === "question")
    const answerPosts = posts.filter(post => post.post_type === "answer")
    const answerIds = answerPosts.map(answer => answer.post_id)

    const apiAnswers = await this.loadAnswers(answerIds)

    const questionIds = questionPosts.map(question => question.post_id).concat(apiAnswers.map(answer => answer.question_id))

    const apiQuestions = await this.loadQuestions(questionIds)

    let entries: StackOverflowEntry[] = []

    const entities = new AllHtmlEntities();

    const questions = questionPosts.map(questionPost => {
      const apiQuestion = apiQuestions.find(question => question.question_id === questionPost.post_id)!
      const unescapedTitle = entities.decode(apiQuestion.title)
      return new StackOverflowQuestion(
        `Posted question to StackOverflow: ${unescapedTitle}`,
        new Date(apiQuestion.creation_date * 1000),
        apiQuestion.link,
        apiQuestion.tags,
        "question",
        apiQuestion.question_id,
      )
    })
    const answers = answerPosts.map(answerPost => {
      const apiAnswer = apiAnswers.find(answer => answer.answer_id === answerPost.post_id)!
      const apiQuestion = apiQuestions.find(question => question.question_id === apiAnswer.question_id)!
      const unescapedTitle = entities.decode(apiQuestion.title)
      return new StackOverflowQuestion(
        `Provided answer on StackOverflow to the question ${unescapedTitle}`,
        new Date(apiAnswer.creation_date * 1000),
        `${apiQuestion.link}/${apiAnswer.answer_id}#${apiAnswer.answer_id}`,
        apiQuestion.tags,
        "answer",
        apiAnswer.answer_id,
      )
    })

    entries = entries.concat(questions).concat(answers)

    this.cachedEntries = entries

    console.debug("Loaded StackOverflow entries")

    return entries
  }

  private async loadPosts(): Promise<StackOverflowAPIPost[]> {
    return this.loadAPI(`/users/657676/posts?order=desc&sort=creation&site=stackoverflow`)
  }

  private async loadQuestions(ids: number[]): Promise<StackOverflowAPIQuestion[]> {
    const idsParameter = ids.join(';')
    return this.loadAPI(`/questions/${idsParameter}?order=desc&sort=creation&site=stackoverflow`)
  }

  private async loadAnswers(ids: number[]): Promise<StackOverflowAPIAnswer[]> {
    const idsParameter = ids.join(';')
    return this.loadAPI(`/answers/${idsParameter}?order=desc&sort=creation&site=stackoverflow`)
  }

  private async loadAPI<Response>(path: string): Promise<Response> {
    const url = `https://api.stackexchange.com/2.2${path}`
    console.debug(`Performing API request to StackExchange API with url: ${url}`)
    return new Promise<Response>((resolve, reject) => {
      https.get(url, (response) => {
        const gunzip = zlib.createGunzip()
        let buffer: string[] = []

        gunzip.on('data', data => {
          buffer.push(data.toString())
        }).on("end", () => {
          const json = buffer.join('')
          const jsonObject = JSON.parse(json)
          resolve(jsonObject.items)
        }).on("error", err => {
          reject(err)
        })

        response.pipe(gunzip)
      }).on("error", (err) => {
        reject(err)
      })
    })
  }

}

const loader = new StackOverflowLoader()

export default loader
