import fetch from '../src/index.mjs';
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
				getAllResponseHeaders: jest.fn().mockReturnValue('X-Foo: bar\r\nX-Foo: baz\r\nX-Bar: bar, baz\r\nx-test: \r\nX-Baz: bar, baz\r\ndate: 18:23:22'),
				getResponseHeader: jest.fn().mockReturnValue('bar, baz'),
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
					expect(r.headers.get('x-foo')).toEqual('bar, baz');
					expect(r.headers.keys()).toEqual(['x-foo', 'x-bar', 'x-test', 'x-baz', 'date']);
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
			// If we're using getResponseHeader directly this test might be pointless
			xhr.getResponseHeader = jest.fn().mockReturnValue('');
			let p = fetch('/foo')
				.then(r => {
					expect(r.headers.get('server')).toEqual('');
				});

			xhr.onload();

			return p;
		});
	});
});
