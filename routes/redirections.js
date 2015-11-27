'use strict';

var slash = require('express-slash');

module.exports = function(app) {
	app.get('/passbook', function(req, res) {
		res.redirect('/josephduffybusiness.pkpass');
	});

	app.get('/twitter', function(req, res) {
		res.redirect('https://www.twitter.com/Joe_Duffy');
	});

	app.get('/github', function(req, res) {
		res.redirect('https://github.com/JosephDuffy');
	});
	
	app.use(slash());

	app.get('/tag', function(req, res) {
		res.redirect('/tags/');
	});

	app.get('/tag/:tag', function(req, res) {
		res.redirect(`/tags/${req.params.tag}`);
	});

	// Old URLs from previous website
	app.get('/about-me', function(req, res) {
		res.redirect('/about');
	});

	app.get('/author/joseph/', function(req, res) {
		res.redirect('/');
	});
};