import unfetch from './index'
export default typeof fetch == 'function' ? fetch : unfetch
