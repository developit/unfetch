import fetch, { response } from '../src/index.mjs';
import fetchDist from '..';

describe('unfetch', () => {
	it('should be a function', () => {
		expect(fetch).toEqual(expect.any(Function));
	});

	it('should be compiled correctly', () => {
		expect(fetchDist).toEqual(expect.any(Function));
		expect(fetchDist).toHaveLength(2);
	});

	describe('fetch()', () => {
		let xhr;

		beforeEach(() => {
			xhr = {
				setRequestHeader: jest.fn(),
				getAllResponseHeaders: jest.fn().mockReturnValue('X-Foo: bar\nX-Foo:baz'),
				open: jest.fn(),
				send: jest.fn(),
				status: 200,
				statusText: 'OK',
				responseText: '{"a":"b"}',
				responseURL: '/foo?redirect'
			};

			global.XMLHttpRequest = jest.fn(() => xhr);
		});

		afterEach(() => {
			delete global.XMLHttpRequest;
		});

		it('sanity test', () => {
			let p = fetch('/foo', { headers: { a: 'b' } })
				.then( r => {
					expect(r).toMatchObject({
						text: expect.any(Function),
						json: expect.any(Function),
						blob: expect.any(Function),
						clone: expect.any(Function),
						headers: expect.any(Object)
					});
					expect(r.clone()).not.toBe(r);
					expect(r.clone().url).toEqual('/foo?redirect');
					expect(r.headers.get).toEqual(expect.any(Function));
					expect(r.headers.get('x-foo')).toEqual('bar,baz');
					return r.json();
				})
				.then( data => {
					expect(data).toEqual({ a: 'b' });

					expect(xhr.setRequestHeader).toHaveBeenCalledTimes(1);
					expect(xhr.setRequestHeader).toHaveBeenCalledWith('a', 'b');
					expect(xhr.open).toHaveBeenCalledTimes(1);
					expect(xhr.open).toHaveBeenCalledWith('get', '/foo', true);
					expect(xhr.send).toHaveBeenCalledTimes(1);
					expect(xhr.send).toHaveBeenCalledWith(null);
				});

			expect(xhr.onload).toEqual(expect.any(Function));
			expect(xhr.onerror).toEqual(expect.any(Function));

			xhr.onload();

			return p;
		});

		it('handles empty header values', () => {
			xhr.getAllResponseHeaders = jest.fn().mockReturnValue('Server: \nX-Foo:baz');
			let p = fetch('/foo')
				.then(r => {
					expect(r.headers.get('server')).toEqual('');
					expect(r.headers.get('X-foo')).toEqual('baz');
				});

			xhr.onload();

			return p;
		});
	});

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
});
