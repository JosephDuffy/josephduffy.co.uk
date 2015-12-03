'use strict';
var Poet = require('poet');
var _ = require('lodash');

module.exports = function(app) {
	let postsPerPage = 3;

	var poet = Poet(app, {
		posts: './posts/',
		routes: {
			'/:post': 'post',
			'/?page=:page': 'page',
			'/tags/:tag': 'tag',
			'/categories/:category': 'category'
		},
		postsPerPage: postsPerPage,
		readMoreLink: function(post) {
			return `<a href="${post.url}" class="read-more-link" itemprop="url">Continue reading ${post.title}</a>`;
		}
	});

	app.locals.poet = poet;

	if (!app.locals.isProduction) {
		// Initiate the poet watcher (to reload when changes are made to blog posts)
		// and then init poet itself
		poet.watch();
	}

	// Override some of the default blog URLs

	function renderPage(res, currentPageIndex) {
		var totalPages = poet.helpers.getPageCount();
		var currentPage = currentPageIndex + 1;
		var startingPostIndex = currentPageIndex * postsPerPage;
		var endingPostIndex = startingPostIndex + postsPerPage;
		var nextPage;
		var previousPage;

		if (currentPage > totalPages) {
			return res.redirect('/');
		}

		if (totalPages > currentPage) {
			nextPage = currentPage + 1;
		}
		if (currentPage > 1) {
			previousPage = currentPage - 1;
		}

		res.render('index', {
			meta_title: "It's a Duffy Thing - Blog Posts by Joseph Duffy",
			meta_description: "Blog posts by Joseph Duffy covering everything tech",
			posts: poet.helpers.getPosts(startingPostIndex, endingPostIndex),
			totalPages: poet.helpers.getPageCount(),
			currentPage: currentPage,
			nextPage: nextPage,
			previousPage: previousPage
		});
	}

	app.get('/', function (req, res) {
		var pageIndex = 0;
		if (typeof req.query.page !== 'undefined') {
			var page = parseInt(req.query.page);
			if (isNaN(page) || page == 1) {
				return res.redirect('/');
			}
			// Page should be an index
			pageIndex = page - 1;
		}

		return renderPage(res, pageIndex);
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