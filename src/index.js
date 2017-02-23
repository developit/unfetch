export default function fetch(url, options) {
	options = options || {};
	return new Promise( (resolve, reject) => {
		let request = new XMLHttpRequest();

		request.open(options.method || 'get', url);

		for (let i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.onload = () => {
			resolve(response(request));
		};

		request.onerror = () => {
			reject(Error('Network Error'));
		};

		request.ontimeout = () => {
			request.abort();
			reject(Error('Timed out'));
		};

		request.timeout = options.timeout || 30000;  // set default 30sec timeout to requests

		request.send(options.body || null);

		function response(xhr) {
			let headerText = xhr.getAllResponseHeaders(),
				keys = [],
				all = [],
				headers = {},
				reg = /^\s*(.*?)\s*\:\s*([\s\S]*?)\s*$/gm,
				match, header, key;
			while ((match=reg.exec(headerText))) {
				keys.push(key = match[1].toLowerCase());
				all.push([key, match[2]]);
				header = headers[key];
				headers[key] = header ? `${header},${match[2]}` : match[2];
			}

			return {
				type: 'cors',
				ok: xhr.status/200|0 == 1,		// 200-399
				status: xhr.status,
				statusText: xhr.statusText,
				url: xhr.responseURL,
				clone: () => response(xhr),
				text: () => Promise.resolve(xhr.responseText),
				json: () => Promise.resolve(xhr.responseText).then(JSON.parse),
				xml: () => Promise.resolve(xhr.responseXML),
				blob: () => Promise.resolve(xhr.response),
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
