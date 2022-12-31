export default global.fetch =
	global.fetch ||
	(typeof process == "undefined"
		? function (url, opts) {
			return import('unfetch').then(m => (m.default || m)(url, opts));
		}
		: function (url, opts) {
				if (typeof url === "string" || url instanceof URL) {
					url = String(url).replace(/^\/\//g, "https://");
				}
				return import("node-fetch").then((m) => (m.default || m)(url, opts));
		  });
