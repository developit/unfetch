import response from '../../src/lib/response.mjs';

describe('response()', () => {
	const raw = { 'x-foo': 'foo', 'x-bar': 'bar' };
	const keys = Object.keys(raw);
	const all = Object.entries(raw);
	const resp = response({}, all, keys, raw);

	it('returns text()', () => response({ responseText: 'A passing test.' }, [], [], {})
		.text()
		.then((text) => expect(text).toBe('A passing test.'))
	);

	it('returns blob()', () => response({ response: 'A passing test.' })
		.blob()
		.then((text) => expect(text.toString()).toBe(new Blob(['A passing test.']).toString()))
	);

	it('returns headers', () => {
		expect(resp.headers.entries()).toEqual(all);
	});

	it('returns header keys', () => {
		expect(resp.headers.keys()).toEqual(['x-foo', 'x-bar']);
	});

	it('returns headers has', () => {
		expect(resp.headers.has('x-foo')).toBe(true);
		expect(resp.headers.has('x-bar')).toBe(true);
		expect(resp.headers.has('x-baz')).toBe(false);
	});
});
