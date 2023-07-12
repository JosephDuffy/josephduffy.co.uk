import * as y from "yup"

export const BlogPostFrontmatterSchema = y.object({
  title: y.string().required(),
  date: y.date().required(),
  updateDate: y.date(),
  draft: y.boolean().default(true),
  tags: y.array().of(y.string()).default([]),
  imageURL: y.string(),
  series: y.string(),
})

/**
 * The metadata provided with a blog post, stored at the top of a markdown file.
 */
export type BlogPostFrontmatter = y.InferType<typeof BlogPostFrontmatterSchema>

export default BlogPostFrontmatter
