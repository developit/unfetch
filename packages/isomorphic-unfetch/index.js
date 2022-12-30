function r(m){return m && m.default || m;}
module.exports = global.fetch = global.fetch || (
	typeof process=='undefined' ? r(require('unfetch')) : (function(url, opts) {
		const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
		return r(fetch)(String(url).replace(/^\/\//g,'https://'), opts);
	})
);
