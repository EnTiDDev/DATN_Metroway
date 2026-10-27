function sortObject(obj) {
	const sorted = {};
	const keys = [];
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			keys.push(encodeURIComponent(key));
		}
	}
	keys.sort();
	for (let i = 0; i < keys.length; i++) {
		const k = keys[i];
		sorted[k] = encodeURIComponent(obj[k]).replace(/%20/g, "+");
	}
	return sorted;
}

module.exports = { sortObject };


