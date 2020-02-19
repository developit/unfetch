export default function response (request, headers) {
	return {
		ok: (request.status/100|0) == 2,		// 200-299
		statusText: request.statusText,
		status: request.status,
		url: request.responseURL,
		text: () => Promise.resolve(request.responseText),
		json: () => Promise.resolve(request.responseText).then(JSON.parse),
		blob: () => Promise.resolve(new Blob([request.response])),
		clone: () => response(request, headers),
		headers: {
			keys: () => headers.keys,
			entries: () => headers.all,
			get: n => headers.raw[n.toLowerCase()],
			has: n => n.toLowerCase() in headers.raw
		}
	};
}
