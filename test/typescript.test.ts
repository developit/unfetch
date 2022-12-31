import unfetch, { Unfetch } from "..";
import isomorphicUnfetch from "../packages/isomorphic-unfetch";

describe("TypeScript", () => {
	describe("browser", () => {
		beforeAll(() => {
			function XMLHttpRequest() {
				const res = {
					setRequestHeader: jest.fn(),
					getAllResponseHeaders: jest.fn().mockReturnValue(""),
					getResponseHeader: jest.fn().mockReturnValue(""),
					open: jest.fn((method, url) => {
						res.responseURL = url;
					}),
					send: jest.fn(),
					status: 200,
					statusText: "OK",
					get responseText() {
						return this.responseURL.replace(/^data:\,/, "");
					},
					responseURL: null,
					onload: () => {},
				};
				setTimeout(() => res.onload());
				return res;
			}

			// @ts-ignore-next-line
			global.XMLHttpRequest = jest.fn(XMLHttpRequest);
		});

		it("should have valid TypeScript types", async () => {
			const res: Unfetch.Response = await unfetch("data:,test");
			const text = await res.text();
			expect(text).toBe("test");
		});

		// This fails because we're abusing Arrays as iterables:
		// it("should allow cast to Response", async () => {
		// 	const res: Response = await unfetch("data:,test");
		// 	const r = res.headers.keys()[0]
		// });
	});

	describe("isomorphic-unfetch", () => {
		it("should allow use of standard types like Response", async () => {
			const res: Response = await isomorphicUnfetch(new URL("data:,test"));
			const blob: Blob = await res.blob();
		});

		it("should accept Headers", async () => {
			isomorphicUnfetch("data:,test", {
				headers: new Headers({ a: "b" }),
				mode: "cors",
			});
		});
	});
});
