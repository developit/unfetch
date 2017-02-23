export default typeof fetch=='function' ? fetch : function(url, options) {
	options = options || {};
	return new Promise( (resolve, reject) => {
		let request = new XMLHttpRequest();

		request.open(options.method || 'get', url);

		for (let i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.onload = () => {
			resolve(response());
		};

		request.onerror = reject;

		request.send(options.body);

		function response() {
			let headerText = request.getAllResponseHeaders(),
				keys = [],
				all = [],
				headers = {},
				reg = /^(.*?):\s*([\s\S]*)$/gm,
				match, header, key;

			while ((match=reg.exec(headerText))) {
				keys.push(key = match[1].toLowerCase());
				all.push([key, match[2]]);
				header = headers[key];
				headers[key] = header ? `${header},${match[2]}` : match[2];
			}

			return {
				ok: (request.status/200|0) == 1,		// 200-399
				status: request.status,
				statusText: request.statusText,
				url: request.responseURL,
				clone: () => response(request),
				text: () => Promise.resolve(request.responseText),
				json: () => Promise.resolve(request.responseText).then(JSON.parse),
				xml: () => Promise.resolve(request.responseXML),
				blob: () => Promise.resolve(new Blob([request.response])),
				headers: {
					keys: () => keys,
					entries: () => all,
					get: n => headers[n.toLowerCase()],
					has: n => n.toLowerCase() in headers
				}
			};
		}
	});
}
