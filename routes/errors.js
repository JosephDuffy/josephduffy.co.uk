'use strict';

module.exports = function(app) {
	app.use(function(req, res, next) {
		// Nothing else has handled this; page does not exists
		res.status(404);
		res.render('errors/404');
	});
};