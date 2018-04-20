import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-post-replace';

let { FORMAT } = process.env;

let polyfill = 'typeof fetch==\'function\' ? fetch.bind() : '

export default {
	useStrict: false,
	sourceMap: true,
	entry: 'src/index.js',
	plugins: [
		buble(),
		FORMAT==='cjs' && replace({
			'module.exports = index;': '',
			'var index =': `module.exports = ${polyfill}`
		}),
		FORMAT==='umd' && replace({
			'return index;': '',
			'var index =': `return ${polyfill}`
		}),
		FORMAT==='esm' && replace({
			'export default index;': '',
			'var index =': `export default ${polyfill}`
		})
	]
};
