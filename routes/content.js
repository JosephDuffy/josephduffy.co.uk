'use strict';

module.exports = function(app) {
	app.get('/about', function (req, res) {
		res.render('about', {
			meta_title: "About Joseph Duffy"
		});
	});

	app.get('/projects', function (req, res) {
		res.render('projects', {
			meta_title: "Projects by Joseph Duffy"
		});
	});
};