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
				getAllResponseHeaders: jest.fn().mockReturnValue('X-Foo: bar\nX-Foo:baz'),
				open: jest.fn(),
				send: jest.fn(),
				readyState: 4,
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

			expect(xhr.onreadystatechange).toEqual(expect.any(Function));
			expect(xhr.onerror).toEqual(expect.any(Function));

			xhr.onreadystatechange();

			return p;
		});

		it('handles empty header values', () => {
			xhr.getAllResponseHeaders = jest.fn().mockReturnValue('Server: \nX-Foo:baz');
			let p = fetch('/foo')
				.then(r => {
					expect(r.headers.get('server')).toEqual('');
					expect(r.headers.get('X-foo')).toEqual('baz');
				});

			xhr.onreadystatechange();

			return p;
		});
	});
});
