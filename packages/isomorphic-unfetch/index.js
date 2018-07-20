module.exports = global.fetch = global.fetch || (
	typeof process=='undefined' ? (require('unfetch').default || require('unfetch')) : (function(url, opts) {
		return require('node-fetch')(url.replace(/^\/\//g,'https://'), opts);
	})
);
