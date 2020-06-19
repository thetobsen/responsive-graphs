export const extractHierarchy = (order) => {
	const parts = order.split('.');
	return parts
		.map(level => level.startsWith('0') ? level.substring(1) : level)
		.join('.');
};
