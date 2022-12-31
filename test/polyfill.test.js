import vm from "vm";
import fs from "fs";

describe("unfetch/polyfill", () => {
	it("should resolve to fetch when window.fetch exists", () => {
		function fetch() {}
		let window = { fetch, require };
		window.window = window.global = window.self = window;
		let filename = require.resolve("../polyfill/index.js");
		vm.runInNewContext(
			fs.readFileSync(filename, "utf8"),
			window,
			"polyfill-test.js"
		);
		expect(window.fetch).toBe(fetch);
	});

	it("should resolve to unfetch when window.fetch does not exist", () => {
		let window = { require };
		window.window = window.global = window.self = window;
		let filename = require.resolve("../polyfill/index.js");
		vm.runInNewContext(
			fs.readFileSync(filename, "utf8"),
			window,
			"polyfill-test.js"
		);
		expect(window.fetch).toEqual(expect.any(Function));
		expect(window.fetch).toHaveLength(2);
	});
});
