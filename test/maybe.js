import proxyquire from 'proxyquire';
import { expect } from 'chai';
import fetch from '../src';

describe('unfetch/maybe', () => {
  it('uses unfetch when global.window.fetch is not available', () => {
    const result = proxyquire('../src/maybe', {}).default;
    expect(result).to.equal(fetch);
  });

  it('uses global.window.fetch when available', () => {
    const mockFetch = () => {};
    global.window = {
      fetch: mockFetch
    };

    const result = proxyquire('../src/maybe', {}).default;
    expect(result).to.equal(mockFetch);

    delete global.window;
  });
});
