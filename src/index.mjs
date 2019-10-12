export default function (url, options) {
	options = options || {};
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		const keys = [];
		const all = [];
		const headers = {};

		const response = () => ({
			ok: (request.status / 100 | 0) == 2,		// 200-299
			statusText: request.statusText,
			status: request.status,
			url: request.responseURL,
			text: () => Promise.resolve(request.responseText),
			json: () => Promise.resolve(JSON.parse(request.responseText)),
			blob: () => Promise.resolve(new Blob([request.response])),
			clone: response,
			headers: {
				keys: () => keys,
				entries: () => all,
				get: n => headers[n.toLowerCase()],
				has: n => n.toLowerCase() in headers
			}
		});

		request.open(options.method || 'get', url, true);

		request.onload = () => {
			request.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, (m, key, value) => {
				keys.push(key = key.toLowerCase());
				all.push([key, value]);
				headers[key] = headers[key] ? `${headers[key]},${value}` : value;
			});
			resolve(response());
		};

		request.onerror = reject;

		request.withCredentials = options.credentials == 'include';

		if (options.headers && typeof options.headers.entries === 'function') {
			// Iterate through options.headers as a Headers instance
			for (const pair of options.headers.entries()) {
				request.setRequestHeader(pair[0], pair[1]);
			}
		}
		else {
			// Iterate through options.headers as a POJO
			for (const i in options.headers) {
				request.setRequestHeader(i, options.headers[i]);
			}
		}

		request.send(options.body || null);
	});
}
