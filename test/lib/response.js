import response from '../../src/lib/response.mjs';

describe('response()', () => {
	it('returns text()', () => response({ responseText: 'A passing test.' })
		.text()
		.then((text) => expect(text).toBe('A passing test.'))
	);

	it('returns blob()', () => response({ response: 'A passing test.' })
		.blob()
		.then((text) => expect(text.toString()).toBe(new Blob(['A passing test.']).toString()))
	);

	it('returns headers', () => {
		const all = [['x-foo', 'bar'], ['x-baz', 'boo']];
		const result = response({}, { all }).headers.entries();
		expect(result).toEqual(all);
	});

	it('returns header keys', () => {
		const result = response({}, { keys: ['x-foo'] }).headers.keys();
		expect(result).toEqual(['x-foo']);
	});

	it('returns headers has', () => {
		const raw = { 'x-foo': 'bar', 'x-baz': 'boo' };
		const test = response({}, { raw }).headers;
		expect(test.has('x-foo')).toBe(true);
	});
});
