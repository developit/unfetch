import { expect } from 'chai';
import fs from 'fs';
import vm from 'vm';

describe('isomorphic-unfetch', () => {
	describe('"browser" entry', () => {
		it('should resolve to fetch when window.fetch exists', () => {
			function fetch() { return this }
			function unfetch() {}

			let sandbox = {
				process: undefined,
				window: { fetch },
				fetch,
				exports: {},
				require: () => unfetch
			};
			sandbox.global = sandbox.window;
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve('../packages/isomorphic-unfetch/browser');
			vm.runInNewContext(fs.readFileSync(filename), sandbox, filename);

			expect(sandbox.module.exports).to.equal(fetch);
		});

		it('should resolve to unfetch when window.fetch does not exist', () => {
			function unfetch() {}

			let sandbox = {
				process: undefined,
				window: {},
				exports: {},
				require: () => unfetch
			};
			sandbox.global = sandbox.window;
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve('../packages/isomorphic-unfetch/browser');
			vm.runInNewContext(fs.readFileSync(filename), sandbox, filename);

			expect(sandbox.module.exports).to.equal(unfetch);
		});
	});

	describe('"main" entry', () => {
		it('should resolve to fetch when window.fetch exists', () => {
			function fetch() { return this }
			function unfetch() {}

			let sandbox = {
				process: undefined,
				window: { fetch },
				fetch,
				exports: {},
				require: () => unfetch
			};
			sandbox.global = sandbox.window;
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve('../packages/isomorphic-unfetch');
			vm.runInNewContext(fs.readFileSync(filename), sandbox, filename);

			expect(sandbox.module.exports).to.equal(fetch);
		});

		it('should resolve to unfetch when window.fetch does not exist', () => {
			function unfetch() {}

			let sandbox = {
				process: undefined,
				window: {},
				exports: {},
				require: () => unfetch
			};
			sandbox.global = sandbox.window;
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve('../packages/isomorphic-unfetch');
			vm.runInNewContext(fs.readFileSync(filename), sandbox, filename);

			expect(sandbox.module.exports).to.equal(unfetch);
		});
	});


	describe('"main" entry in NodeJS', () => {
		it('should resolve to fetch when window.fetch exists', () => {
			function fetch() { return this }
			function unfetch() {}

			let sandbox = {
				process: {},
				global: { fetch },
				exports: {},
				require: () => unfetch
			};
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve('../packages/isomorphic-unfetch');
			vm.runInNewContext(fs.readFileSync(filename), sandbox, filename);

			expect(sandbox.module.exports).to.equal(fetch);
		});

		it('should resolve to unfetch when window.fetch does not exist', () => {
			let modules = {
				unfetch() {},
				'node-fetch': function nodeFetch() { return 'I AM NODE-FETCH'; }
			};

			let sandbox = {
				process: {},
				global: {},
				exports: {},
				require: (module) => modules[module]
			};
			sandbox.global.process = sandbox.process;
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve('../packages/isomorphic-unfetch');
			vm.runInNewContext(fs.readFileSync(filename), sandbox, filename);

			expect(sandbox.module.exports('/')).to.equal(modules['node-fetch']('/'));
		});
	});
});
