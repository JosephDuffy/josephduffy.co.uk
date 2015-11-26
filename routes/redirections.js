'use strict';

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
};