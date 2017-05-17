import unfetch from './'
export default typeof window === 'object' && typeof window.fetch === 'function'
  ? window.fetch
  : unfetch;
