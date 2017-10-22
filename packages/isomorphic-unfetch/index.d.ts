declare const unfetch: typeof fetch;

declare module "isomorphic-unfetch" {
  export = unfetch;
}
