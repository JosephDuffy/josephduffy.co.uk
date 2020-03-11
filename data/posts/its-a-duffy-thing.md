---
title: It's a Duffy Thing
tags: ["web", "meta", "node", "workflow"]
date: 2015-12-03
---

I recently released a major overhaul for this website. The old website used an old version Node.js and used Ghost to power the blog. I didn't find it very easy to maintain and wanted more flexibility. While the new website may not have the best design, I'm a lot happier with it overall. Along with the rewrite of the website itself, I also gave it a new name: It's a Duffy Thing. This was inspired by a [shirt](/images/its-a-duffy-thing-shirt-full.jpg "High resolution photo of the shirt") that [my Dad](https://twitter.com/mark_duffy1) bought me.

<!-- more -->

In this blog post I want to go over a few of the technologies used to power the website. Partially so it's all together and in one place, but also as a kind of "behind the curtain" look at the website. If you want to dive in even further, take a look at the [source code on GitHub](https://github.com/JosephDuffy/josephduffy.co.uk "GitHub repository for josephduffy.co.uk").

The new version of the website is built using Node.js, SASS, and Handlebars. There's no front-end JavaScript on the website other than a couple of little external scripts (such as Google Analytics), so there's nothing to discuss when it comes to front-end JavaScript.

## Node.js

I've liked the idea of Node.js for a while. For simple websites (such as this) that receive little traffic (such as this) and can be used to experiment with new technologies (such as this) I think it's great. My previous projects have used io.js, which was [recently merged in to Node.js](https://nodejs.org/en/blog/release/v4.0.0/), but this project uses the latest stable version of Node at the time, version 4.2.2.

### Gulp

Using Node has a few other advantages. Ones of those is being able to use [gulp](http://gulpjs.com/). There a lot of workflow automators out there now, and which is "best" seems to change fairly rapidly. I'm happy with my workflow using gulp so that's what I stick to. I use gulp to automate all of the following tasks:

- Compile my SASS files, including Bootstrap
- Automatically add browser vender prefixes to support the latest 2 versions of major browsers
- Removed any CSS rules that aren't used anywhere on the website
- Minify the output CSS
- Generate sourcemaps for development

This is all done in a single [gulp file](http://gulpjs.com/). I've also added a `watch` task so that changes made to SASS file automatically trigger a recompile. I'll likely extend this to the views directory, too, so that any CSS rules added or removed from the HTML will be add or removed from the compiled CSS.

### Poet

When looking for a blogging engine I was torn between one which provided a lot of management and functionally out of the box (such as Ghost), or one which offered more of a basic set of scaffolding to work from. After trying Ghost for a while I opted for the simpler approach, which led me to [Poet](https://github.com/jsantell/poet). Poet takes in a directory containing markdown files and converts them to HTML, pulling out some extra meta data from a JSON structure at the top of the file such as the URL slug, publish date, and tags.

I've really loved working with Poet. It doesn't get in the way and me choose how things should be. I actually override most of the routes and mainly use it as a markdown to HTML converter, but it works great for me.

### SASS

I've used SASS on an off for a while but I really wanted to dive in a bit further this time. The design and layout for this website is fairly simplistic so I can get away with using Bootstrap and just adding a few additional styles. SASS is perfect for this, and as described in the gulp section, it ends up being really nice workflow which produces a fairly small file.

### Handlebars

Along with SASS, Handlebars is probably my favourite things that changed about my workflow when working with the web in recent years. I still find it hard to not put logic in to the Handlebar files (thanks, PHP), but I'm loving partials and inheritance. Magical!

### Helmet

[Helmet](https://github.com/helmetjs/helmet) is a great piece of middleware for Express which helps improve the security of a website. There's always more that can be done, but it's been very easy to add things like the [Content Security Policy](http://www.w3.org/TR/CSP/) and setting the `X-XSS-Protection` header.

## Open Source

I decided to open source the website for a couple of reasons:

- It makes deployment via PM2 or just the command line a little easier
- It makes a good portfolio piece
- It forces me to write slightly better code since people might look at it

I'm happy with my decision to open source the website. I can already see that I'm writing better commit messages and separating my commits up further.

## Future Posts

I've got a few other post ideas (some of which are already 90% written), so there's going to be more activity on here soon. You can [subscribe to the RSS feed](/rss), [follow me on Twitter](https://twitter.com/Joe_Duffy), or simply check the website soon to see new posts.
