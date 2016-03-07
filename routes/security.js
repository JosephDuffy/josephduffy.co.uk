'use strict';
var helmet = require('helmet');
var csp = require('helmet-csp');

module.exports = function(app) {
	app.set('x-powered-by', false);

	var securedURLs = /^\/(?!rss|css|fonts|images|js)/;

	app.use(securedURLs, helmet());
	app.use(securedURLs, csp({
		// Specify directives as normal
		defaultSrc: ["'self'"],
		imgSrc: ["'self'", "https://www.google-analytics.com"],
		scriptSrc: ["'self'", 'https://www.google-analytics.com', 'https://cdnjs.cloudflare.com'],
		styleSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
		fontSrc: ["'self'", "data:"],
		// reportUri: '/report-violation',

		// Set to an empty array to allow nothing through
		objectSrc: [],

		// Set to true if you only want browsers to report errors, not block them
		reportOnly: false,

		// Set to true if you want to blindly set all headers: Content-Security-Policy,
		// X-WebKit-CSP, and X-Content-Security-Policy.
		setAllHeaders: false
	}));

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
		next();
	});
};