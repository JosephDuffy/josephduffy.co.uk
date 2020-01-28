import { Entry } from "./Entry"
export function isEntry(object: any): object is Entry {
  return typeof object.date === "string" && Array.isArray(object.tags)
}
