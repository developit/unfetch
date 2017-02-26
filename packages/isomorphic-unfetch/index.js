module.exports = global.fetch = typeof process=='undefined' ? require('unfetch') : (function(url, opts) {
	return require('node-fetch')(url.replace(/^\/\//g,'https://'), opts);
});
