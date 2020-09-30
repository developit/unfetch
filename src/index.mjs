import response from './lib/response';

const regex = /^(.*?):[^\S\n]*([\s\S]*?)$/gm;

export default function(url, options) {
	options = options || {};
	return new Promise( (resolve, reject) => {
		const request = new XMLHttpRequest();

		request.open(options.method || 'get', url, true);

		request.onload = () => {
			const all = [], keys = [], raw = {};
			request.getAllResponseHeaders().replace(regex, (m, key, value) => {
				all.push([key, value]);
				keys.push(key = key.toLowerCase());
				raw[key] = raw[key] ? `${raw[key]},${value}` : value;
			});
			resolve(response(request, all, keys, raw));
		};

		request.onerror = reject;

		request.withCredentials = options.credentials=='include';

		for (const i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.send(options.body || null);
	});
}
