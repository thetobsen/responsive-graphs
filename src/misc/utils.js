export const extractHierarchy = (order) => {
	const parts = order.split('.');
	return parts
		.map(level => level.startsWith('0') ? level.substring(1) : level)
		.join('.');
};

export const getPrettifiedDuration = (momentDuration) => {
	const hours = momentDuration.get('hours');
	const minutes = momentDuration.get('minutes');

	return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes} h`;
};