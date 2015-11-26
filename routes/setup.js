'use strict';
var hbs = require('express-hbs');
var path = require('path');

module.exports = function(app) {
	// Setup some basic options
	// Disable /foo and /foo/ being treated the same
	app.enable('strict routing');
	app.locals.siteURL = 'https://josephduffy.co.uk';

	require('../hbsHelpers')(hbs);

	let viewsDirectory = path.resolve(`${__dirname}/../views`);

	app.engine('hbs', hbs.express4({
		partialsDir: `${viewsDirectory}/partials`
	}));
	app.set('view engine', 'hbs');
	app.set('views', viewsDirectory);
};