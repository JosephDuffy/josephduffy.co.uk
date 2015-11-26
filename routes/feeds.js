'use strict';
var _ = require('lodash');

module.exports = function(app) {

	function getPosts(poet) {
		var posts = poet.helpers.getPosts();

		// Make any URLs (mainly the read more URLs) absolute rather than relative
		poet.helpers.getPosts().forEach(function(post) {
			post.preview = post.preview.replace('href="/', 'href="https://josephduffy.co.uk/');
		});

		return posts;
	}

	app.get(['/rss', '/feed', '/feeds'], function(req, res) {
		res.redirect('/rss.xml');
	});

	app.get('/rss.xml', function(req, res) {
		res.setHeader('Content-Type', 'text/xml');

		var posts = getPosts(app.locals.poet);

		var lastUpdatedPost = _.sortBy(posts, function(post) {
			return post.date;
		}).reverse()[0];

		res.render('rss', {
			posts: posts,
			lastUpdated: lastUpdatedPost.date
		});
	});

	app.get('/atom', function(req, res) {
		res.redirect('/atom.xml');
	});

	app.get('/atom.xml', function(req, res) {
		res.setHeader('Content-Type', 'text/xml');

		var posts = getPosts(app.locals.poet);

		var lastUpdatedPost = _.sortBy(posts, function(post) {
			return post.date;
		}).reverse()[0];

		res.render('atom', {
			posts: posts,
			lastUpdated: lastUpdatedPost.date
		});
	});
};