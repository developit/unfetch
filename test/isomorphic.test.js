import fs from "fs";
import vm from "vm";

describe("isomorphic-unfetch", () => {
	describe('"browser" entry', () => {
		it("should resolve to fetch when window.fetch exists", () => {
			function fetch() {
				return this;
			}
			function unfetch() {}

			let sandbox = {
				process: undefined,
				window: { fetch },
				fetch,
				exports: {},
				require: () => unfetch,
			};
			sandbox.global = sandbox.self = sandbox.window;
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve(
				"../packages/isomorphic-unfetch/browser.js"
			);
			vm.runInNewContext(fs.readFileSync(filename, "utf8"), sandbox, filename);

			expect(sandbox.module.exports).toBe(fetch);
		});

		it("should resolve to unfetch when window.fetch does not exist", () => {
			function unfetch() {}

			let sandbox = {
				process: undefined,
				window: {},
				exports: {},
				require: () => unfetch,
			};
			sandbox.global = sandbox.self = sandbox.window;
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve(
				"../packages/isomorphic-unfetch/browser.js"
			);
			vm.runInNewContext(fs.readFileSync(filename, "utf8"), sandbox, filename);

			expect(sandbox.module.exports).toBe(unfetch);
		});
	});

	describe('"main" entry', () => {
		it("should resolve to fetch when window.fetch exists", () => {
			function fetch() {
				return this;
			}
			function unfetch() {}

			let sandbox = {
				process: undefined,
				window: { fetch },
				fetch,
				exports: {},
				require: () => unfetch,
			};
			sandbox.global = sandbox.self = sandbox.window;
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve("../packages/isomorphic-unfetch");
			vm.runInNewContext(fs.readFileSync(filename, "utf8"), sandbox, filename);

			expect(sandbox.module.exports).toBe(fetch);
		});

		it("should resolve to unfetch when window.fetch does not exist", () => {
			function unfetch() {}

			let sandbox = {
				process: undefined,
				window: {},
				exports: {},
				require: () => unfetch,
			};
			sandbox.global = sandbox.self = sandbox.window;
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve("../packages/isomorphic-unfetch");
			vm.runInNewContext(fs.readFileSync(filename, "utf8"), sandbox, filename);

			expect(sandbox.module.exports).toBe(unfetch);
		});
	});

	describe('"main" entry in NodeJS', () => {
		it("should resolve to fetch when window.fetch exists", () => {
			function fetch() {
				return this;
			}
			function unfetch() {}

			let sandbox = {
				process: {},
				global: { fetch },
				exports: {},
				require: () => unfetch,
			};
			sandbox.module = { exports: sandbox.exports };
			let filename = require.resolve("../packages/isomorphic-unfetch");
			vm.runInNewContext(fs.readFileSync(filename, "utf8"), sandbox, filename);

			expect(sandbox.module.exports).toBe(fetch);
		});

		it("should resolve to unfetch when window.fetch does not exist", async () => {
			let modules = {
				unfetch() {},
				"node-fetch": {
					default: function nodeFetch(url) {
						return "hello from node-fetch";
					},
				},
			};

			let sandbox = {
				process: {},
				global: {
					fetch: null,
				},
				exports: {},
				require: (module) => modules[module],
			};
			sandbox.global.process = sandbox.process;
			sandbox.module = { exports: sandbox.exports };
			let filename = require
				.resolve("../packages/isomorphic-unfetch")
				.replace(/\.js$/, ".mjs");
			const context = vm.createContext(sandbox);
			const mod = new vm.SourceTextModule(fs.readFileSync(filename, "utf8"), {
				context,
				async importModuleDynamically(specifier, script, assertions) {
					const exp = modules[specifier];
					const module = new vm.SyntheticModule(Object.keys(exp), () => {
						for (let key in exp) module.setExport(key, exp[key]);
					});
					await module.link(() => {});
					await module.evaluate();
					return module;
				},
			});
			await mod.link(() => {});
			await mod.evaluate();

			const ns = mod.namespace;

			expect(await ns.default("/")).toBe(
				await modules["node-fetch"].default("/")
			);
		});
	});
});
