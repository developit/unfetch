export default function(url, options) {
	options = options || {};
	return new Promise( (resolve, reject) => {
		let request = new XMLHttpRequest();

		request.open(options.method || 'get', url, true);

		for (let i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.withCredentials = options.credentials=='include';

		request.onload = () => {
			resolve(response());
		};

		request.onerror = reject;

		request.send(options.body || null);

		function response() {
			let temp = {}, keys = [];
			request.getAllResponseHeaders().toLowerCase().replace(/^(.+?):/gm, (m, key) => {
				!temp[key] && keys.push(temp[key] = key);
			});

			return {
				ok: request.status/100|0 == 2,		// 200-299
				status: request.status,
				statusText: request.statusText,
				url: request.responseURL,
				clone: response,
				text: () => Promise.resolve(request.responseText),
				json: () => Promise.resolve(request.responseText).then(JSON.parse),
				blob: () => Promise.resolve(new Blob([request.response])),
				headers: {
					keys: () => keys,
					entries: () => keys.map(n => [n, request.getResponseHeader(n)]),
					get: n => request.getResponseHeader(n),
					has: n => request.getResponseHeader(n) != null
				}
			};
		}
	});
}
