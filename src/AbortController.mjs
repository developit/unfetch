export default function() {
	this.signal = { onabort: () => {} };
	this.abort = () => {
		this.signal.onabort();
	};
}
