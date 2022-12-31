import {
	Body as NodeBody,
	Headers as NodeHeaders,
	Request as NodeRequest,
	Response as NodeResponse,
	RequestInit as NodeRequestInit,
} from "node-fetch";

/** @augments Headers */
export interface UnfetchHeaders {
	keys: () => string[];
	entries: () => [string, string][];
	get: (key: string) => string | null;
	has: (key: string) => boolean;

	/** @deprecated not supported by unfetch */
	append: never;
	/** @deprecated not supported by unfetch */
	delete: never;
	/** @deprecated not supported by unfetch */
	forEach: never;
	/** @deprecated not supported by unfetch */
	set: never;
	/** @deprecated not supported by unfetch */
	values: never;
	/** @deprecated not supported by unfetch */
	[Symbol.iterator]: never;
}

/** @augments Response */
export interface UnfetchResponse {
	ok: boolean;
	statusText: string;
	status: number;
	url: string;
	text: () => Promise<string>;
	json: () => Promise<any>;
	blob: () => Promise<Blob>;
	clone: () => UnfetchResponse;
	headers: UnfetchHeaders;

	/** @deprecated not supported by unfetch */
	arrayBuffer: never;
	/** @deprecated not supported by unfetch */
	body: never;
	/** @deprecated not supported by unfetch */
	bodyUsed: never;
	/** @deprecated not supported by unfetch */
	formData: never;
	/** @deprecated not supported by unfetch */
	redirected: never;
	/** @deprecated not supported by unfetch */
	type: never;
}

/** @augments RequestInit */
export interface UnfetchRequestInit {
	method?: string;
	headers?: Record<string, string>;
	credentials?: "include" | "omit";
	body?: Parameters<XMLHttpRequest["send"]>[0];

	/** @deprecated not supported by unfetch */
	cache?: never;
	/** @deprecated not supported by unfetch */
	integrity?: never;
	/** @deprecated not supported by unfetch */
	keepalive?: never;
	/** @deprecated not supported by unfetch */
	mode?: never;
	/** @deprecated not supported by unfetch */
	redirect?: never;
	/** @deprecated not supported by unfetch */
	referrer?: never;
	/** @deprecated not supported by unfetch */
	referrerPolicy?: never;
	/** @deprecated not supported by unfetch */
	signal?: never;
	/** @deprecated not supported by unfetch */
	window?: never;
}

export namespace Unfetch {
	export type IsomorphicHeaders = Headers | NodeHeaders;
	export type IsomorphicBody = Body | NodeBody;
	export type IsomorphicResponse = Response | NodeResponse;
	export type IsomorphicRequest = Request | NodeRequest;
	export type IsomorphicRequestInit = RequestInit | NodeRequestInit;

	export type Headers = UnfetchHeaders | globalThis.Headers;
	export type Body = globalThis.Body;
	export type Response = UnfetchResponse | globalThis.Response;
	export type Request = UnfetchRequestInit | globalThis.Request;
	export type RequestInit = UnfetchRequestInit | globalThis.RequestInit;
}

export interface Unfetch {
	(url: string | URL, options?: UnfetchRequestInit): Promise<UnfetchResponse>;
}

declare const unfetch: Unfetch;

export default unfetch;
