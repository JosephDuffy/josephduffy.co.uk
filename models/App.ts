import Changelog from './Changelog'

export default interface App {
  name: string
  description: string
  logoURL: string
  url: string
  tags: string[]
  changelogs: Changelog[]
}
