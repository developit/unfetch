import fetch from '../src';
import chai, { expect } from 'chai';
import { spy, stub } from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);


describe('unfetch', () => {
	it('should be a function', () => {
		expect(fetch).to.be.a('function');
	});

	describe('fetch()', () => {
		it('sanity test', () => {
			let xhr = {
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

			let p = fetch('/foo', { headers: { a: 'b' } })
				.then( r => {
					expect(r).to.have.property('text').that.is.a('function');
					expect(r).to.have.property('json').that.is.a('function');
					expect(r).to.have.property('xml').that.is.a('function');
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

					delete global.XMLHttpRequest;
				});

			expect(xhr.onload).to.be.a('function');
			expect(xhr.onerror).to.be.a('function');

			xhr.onload();

			return p;
		});
	});
});
