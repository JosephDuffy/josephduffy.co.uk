'use strict';
var compression = require('compression');
var express = require('express');
var path = require('path');

module.exports = function(app) {
	app.get("/*.pkpass", function(req, res, next) {
		res.header("Content-Type", "application/vnd.apple.pkpass");
		next();
	});

	app.use(compression());
	let maxAge = 60*60*24*30 * 1000 // 30 days caching (the value is being divided by 1000?)
	app.use(express.static(path.resolve('public'), {
		maxAge: maxAge
	}));

	// Map the favicon directory to the root of the website
	// TODO: Redirect/404 requests to /favicon/[file]
	app.use(express.static(path.resolve('public/favicon'), {
		maxAge: maxAge
	}));
};