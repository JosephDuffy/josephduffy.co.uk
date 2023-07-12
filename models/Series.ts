import * as y from "yup"

export const SeriesSchema = y.object({
  id: y.string().required(),
  title: y.string().required(),
  description: y.string().required(),
})

/**
 * A series of blog posts, enabling linking between each of them and generating a page with links to all posts in the series.
 */
export type Series = y.InferType<typeof SeriesSchema>

export default Series
