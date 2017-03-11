import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-post-replace';

let { FORMAT } = process.env;

export default {
	useStrict: false,
	sourceMap: true,
	entry: 'src/index.js',
	plugins: [
		buble(),
		FORMAT==='cjs' && replace({
			'module.exports = index;': '',
			'var index =': 'module.exports ='
		}),
		FORMAT==='umd' && replace({
			'return index;': '',
			'var index =': 'return'
		})
	]
};
