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
	app.use(express.static(path.resolve(`${__dirname}/../public`), {
		maxAge: 60*60*24*30 * 1000 // 30 days caching (the value is being divided by 1000?)
	}));
};