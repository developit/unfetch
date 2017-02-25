import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-post-replace';

export default {
	useStrict: false,
	plugins: [
		buble(),
		replace(
			process.env.FORMAT==='cjs' ? {
				'module.exports = index;': '',
				'var index =': 'module.exports ='
			} : {
				'return index;': '',
				'var index =': 'return'
			}
		)
	]
};
