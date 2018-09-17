import unfetch from '../src/index.mjs';
if (!self.fetch) self.fetch = unfetch;
