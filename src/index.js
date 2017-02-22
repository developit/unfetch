const response = (xhr) => {
	const text = xhr.getAllResponseHeaders(),
		keys = [],
		all = [],
		headers = {},
		reg = /^\s*(.*?)\s*\:\s*([\s\S]*?)\s*$/gm;

	let res;
	while ((res = reg.exec(text))) {
		const k = res[1].toLowerCase(), h = headers[k], v = res[2];
		keys.push(k);
		all.push([k, v]);
		headers[k] = (h ? `${h},` : '') + v;
	}

	return {
		type: 'cors',
		ok: xhr.status / 200 | 0 == 1, // 200-399
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
};

export default function fetch(url, options) {
	options = options || {};
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open(options.method || 'get', url);

		for (let i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.onload = () => {
			resolve(response(request));
		}
		request.onerror = () => {
			reject(Error('Network Error'));
		}

		request.send(options.body || null);
	});
}
