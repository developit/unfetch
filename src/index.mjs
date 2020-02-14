const regex = /^(.*?):[^\S\n]*([\s\S]*?)$/gm;
const response = (request, headers) => ({
	ok: (request.status/100|0) == 2,		// 200-299
	statusText: request.statusText,
	status: request.status,
	url: request.responseURL,
	text: () => Promise.resolve(request.responseText),
	json: () => Promise.resolve(JSON.parse(request.responseText)),
	blob: () => Promise.resolve(new Blob([request.response])),
	clone: () => response(request, headers),
	headers: {
		keys: () => headers.keys,
		entries: () => headers.all,
		get: n => headers.raw[n.toLowerCase()],
		has: n => n.toLowerCase() in headers.raw
	}
});

export default function(url, options) {
	options = options || {};
	return new Promise( (resolve, reject) => {
		const request = new XMLHttpRequest();

		request.open(options.method || 'get', url, true);

		request.onload = () => {
			const head = { all: [], keys: [], raw: {} };
			request.getAllResponseHeaders().replace(regex, (m, key, value) => {
				head.all.push([key, value]);
				head.keys.push(key = key.toLowerCase());
				head.raw[key] = head.raw[key] ? `${head.raw[key]},${value}` : value;
			});
			resolve(response(request, head));
		};

		request.onerror = reject;

		request.withCredentials = options.credentials=='include';

		for (const i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.send(options.body || null);
	});
}

export { response };
