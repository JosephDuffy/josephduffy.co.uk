'use strict';
var hbs = require('express-hbs');
var path = require('path');

module.exports = function(app) {
	// Setup some basic options
	// Disable /foo and /foo/ being treated the same
	app.enable('strict routing');
	app.locals.isProduction = process.env.NODE_ENV === 'production';
	app.locals.siteURL = app.locals.isProduction ? 'https://josephduffy.co.uk' : 'http://localhost:' + app.locals.port;

	require('../hbsHelpers')(hbs);

	let viewsDirectory = path.resolve(`${__dirname}/../views`);

	app.engine('hbs', hbs.express4({
		partialsDir: `${viewsDirectory}/partials`
	}));
	app.set('view engine', 'hbs');
	app.set('views', viewsDirectory);
};