import fetch from '../src';
import chai, { expect } from 'chai';
import { spy, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { transformFileSync } from 'babel-core';
import vm from 'vm';

chai.use(sinonChai);

describe('unfetch', () => {
	it('should be a function', () => {
		expect(fetch).to.be.a('function');
	});

	// Prevents illegal invocation errors
	// See https://github.com/developit/unfetch/issues/46
	it('should bind the native fetch on window', () => {
		const filename = require.resolve('../src');
		const sandbox = {
			fetch() { return this },
			exports: {}
		};

		vm.runInNewContext(transformFileSync(filename).code, sandbox, filename);

		expect(sandbox.exports.default()).to.equal(undefined);
	});

	describe('fetch()', () => {
		let xhr;

		beforeEach(() => {
			xhr = {
				setRequestHeader: spy(),
				getAllResponseHeaders: stub().returns('X-Foo: bar\nX-Foo:baz'),
				open: spy(),
				send: spy(),
				status: 200,
				statusText: 'OK',
				responseText: '{"a":"b"}',
				responseURL: '/foo?redirect'
			};

			global.XMLHttpRequest = stub().returns(xhr);
		});

		afterEach(() => {
			delete global.XMLHttpRequest;
		});

		it('sanity test', () => {
			let p = fetch('/foo', { headers: { a: 'b' } })
				.then( r => {
					expect(r).to.have.property('text').that.is.a('function');
					expect(r).to.have.property('json').that.is.a('function');
					expect(r).to.have.property('blob').that.is.a('function');
					expect(r).to.have.property('clone').that.is.a('function');
					expect(r).to.have.property('headers');
					expect(r.clone()).not.to.equal(r);
					expect(r.clone()).to.have.property('url', '/foo?redirect');
					expect(r).to.have.property('headers').with.property('get').that.is.a('function');
					expect(r.headers.get('x-foo')).to.equal('bar,baz');
					return r.json();
				})
				.then( data => {
					expect(data).to.eql({ a:'b' });

					expect(xhr.setRequestHeader).to.have.been.calledOnce.and.calledWith('a', 'b');
					expect(xhr.open).to.have.been.calledOnce.and.calledWith('get', '/foo');
					expect(xhr.send).to.have.been.calledOnce.and.calledWith();
				});

			expect(xhr.onload).to.be.a('function');
			expect(xhr.onerror).to.be.a('function');

			xhr.onload();

			return p;
		});

		it('handles empty header values', () => {
			xhr.getAllResponseHeaders = stub().returns('Server: \nX-Foo:baz');
			let p = fetch('/foo')
				.then(r => {
					expect(r.headers.get('server')).to.equal('');
					expect(r.headers.get('X-foo')).to.equal('baz');
				});

			xhr.onload();

			return p;
		});
	});
});
