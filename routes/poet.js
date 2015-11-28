'use strict';
var Poet = require('poet');
var _ = require('lodash');

module.exports = function(app) {
	var poet = Poet(app, {
		posts: './posts/',
		routes: {
			'/:post': 'post',
			'/?page=:page': 'page',
			'/tags/:tag': 'tag',
			'/categories/:category': 'category'
		},
		readMoreLink: function(post) {
			return `<a href="${post.url}" class="read-more-link" itemprop="url">Continue reading ${post.title}</a>`;
		}
	});

	app.locals.poet = poet;

	if (app.locals.isProduction) {
		// Initiate the poet watcher (to reload when changes are made to blog posts)
		// and then init poet itself
		poet.watch();
	}

	// Override some of the default blog URLs

	app.get('/', function (req, res) {
		res.render('index', {
			meta_title: "It's a Duffy Thing - Blog Posts by Joseph Duffy",
			meta_description: "Blog posts by Joseph Duffy covering everything tech",
			posts: poet.helpers.getPosts(0, 5)
		});
	});

	poet.addRoute('/:post', function (req, res, next) {
		var post = poet.helpers.getPost(req.params.post);

		if (post) {
			res.render('post', {
				post: post,
				meta_title: `${post.title} - It's a Duffy Thing`
			});
		} else {
			next();
		}
	});

	poet.addRoute('/tags/:tag', function (req, res, next) {
		var tag = req.params.tag;
		var posts = poet.helpers.postsWithTag(tag);

		if (posts.length) {
			res.render('tag', {
				posts: posts,
				tag: tag,
				meta_title: `All Blog Posts With The ${tag} Tag - It's a Duffy Thing`
			});
		} else {
			res.status(404);
			res.render('errors/404',
				{
					message: `No posts with the ${tag} tag were found. <a href="/tags/">View the full list of tags</a>.`
				}
			)
		}
	});

	// Disable categories
	poet.addRoute('/categories/:category', function (req, res, next) {
		next();
	});

	// Extra blog pages

	app.get('/tags/', function (req, res) {
		var orderedTags = _.sortBy(poet.helpers.getTags(), function(tag) {
			return poet.helpers.postsWithTag(tag).length;
		}).reverse();

		var tags = [];

		_.forEach(orderedTags, function(tag) {
			tags.push({
				name: tag,
				postsCount: poet.helpers.postsWithTag(tag).length
			});
		});

		res.render('tags', {
			meta_title: "All Blog Post Tags",
			tags: tags
		});
	});

	poet.init();
};