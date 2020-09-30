export default function response (request, all, keys, raw) {
	return {
		ok: (request.status/100|0) == 2,		// 200-299
		statusText: request.statusText,
		status: request.status,
		url: request.responseURL,
		text: () => Promise.resolve(request.responseText),
		json: () => Promise.resolve(request.responseText).then(JSON.parse),
		blob: () => Promise.resolve(new Blob([request.response])),
		clone: () => response(request, all, keys, raw),
		headers: {
			keys: () => keys,
			entries: () => all,
			get: n => raw[n.toLowerCase()],
			has: n => n.toLowerCase() in raw
		}
	};
}
