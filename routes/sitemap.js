'use strict';

class SitemapEntry {
	constructor(url, changeFrequency, app) {
		this.url = `${app.locals.siteURL}${url}`;
		this.changeFrequency = changeFrequency;
	}
}

module.exports = function(app) {
	function getSitemap() {
		var entries = [];
		entries.push(new SitemapEntry("/", "weekly", app));
		entries.push(new SitemapEntry("/about", "monthly", app));
		entries.push(new SitemapEntry("/projects", "monthly", app));

		let poet = app.locals.poet;

		poet.helpers.getPosts().forEach(function(post) {
			entries.push(new SitemapEntry(post.url, "monthly", app));
		});

		poet.helpers.getTags().forEach(function(tag) {
			entries.push(new SitemapEntry(`/tags/${tag}`, "monthly", app));
		});

		return entries;
	};

	app.get('/sitemap.xml', function(req, res) {
		res.setHeader('Content-Type', 'text/xml');

		let entries = getSitemap();

		res.render('sitemap-xml', {
			'entries': entries
		});
	});
};