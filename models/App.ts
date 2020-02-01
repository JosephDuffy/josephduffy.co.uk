import Changelog from "./Changelog"

export default interface App {
  name: string
  shortDescription: string
  fullDescription: string
  logoURL: string | React.FunctionComponent<React.SVGAttributes<SVGElement>>
  url: string
  tags: string[]
  changelogs: Changelog[]
}
