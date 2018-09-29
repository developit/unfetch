import fetch from '../src/index.mjs';
import AbortController from '../src/AbortController.mjs';

describe('AbortController', () => {
	it('should be a function', () => {
		expect(AbortController).toEqual(expect.any(Function));
	});

	describe('AbortController()', () => {
		let xhr;

		beforeEach(() => {
			xhr = {
				setRequestHeader: jest.fn(),
				getAllResponseHeaders: jest.fn().mockReturnValue('X-Foo: bar\nX-Foo:baz'),
				open: jest.fn(),
				send: jest.fn(),
				abort: jest.fn(() => xhr.onabort({ type: 'abort' })) ,
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

		it('handles abort', () => {
			let controller = new AbortController();
			let signal = controller.signal;
			let p = fetch('/foo', { signal })
				.then(() => {})
				.catch((e) => {
					expect(e.message).toEqual('The user aborted a request.');
				});

			controller.abort();

			return p;
		});
	});
});
