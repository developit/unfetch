export default typeof fetch=='function' ? fetch : function(url, options) {
	options = options || {};
	return new Promise((resolve, reject) => {
		const response = () => {
			const keys = [], all = [], headers = {};
			let header;

			request.getAllResponseHeaders().replace(/^(.+):\s*(.+)$/gm, (m, key, value) => {
				keys.push(key = key.toLowerCase());
				all.push([key, value]);
				headers[key] = (header = headers[key]) ? `${header},${value}` : value;
			});

			return {
				ok: (request.status/200 | 0) == 1, // 200-399
				status: request.status,
				statusText: request.statusText,
				url: request.responseURL,
				clone: response,
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
		};

		const request = new XMLHttpRequest();
		request.open(options.method || 'get', url);

		for (let i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.withCredentials = options.credentials == 'include';

		request.onload = () => { resolve(response()); };
		request.onerror = reject;

		request.send(options.body);
	});
}
