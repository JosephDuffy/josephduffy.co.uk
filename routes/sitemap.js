'use strict';

class SitemapEntry {
	constructor(url, changeFrequency) {
		this.url = url;
		this.changeFrequency = changeFrequency;
	}
}

module.exports = function(app) {
	function getSitemap() {
		var entries = [];
		entries.push(new SitemapEntry("/", "weekly"));
		entries.push(new SitemapEntry("/about", "monthly"));
		entries.push(new SitemapEntry("/projects", "monthly"));

		let poet = app.locals.poet;

		poet.helpers.getPosts().forEach(function(post) {
			entries.push(new SitemapEntry(post.url, "monthly"));
		});

		poet.helpers.getTags().forEach(function(tag) {
			entries.push(new SitemapEntry(`/tags/${tag}`, "monthly"));
		});

		return entries;
	};

	app.get('/sitemap.xml', function(req, res) {
		res.setHeader('Content-Type', 'text/xml');

		let entries = getSitemap();

		console.log(entries);

		res.render('sitemap-xml', {
			'entries': entries
		});
	});
};