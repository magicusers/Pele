export function MaxGridFit(elem, count)
{
	const r = elem.getBoundingClientRect();
	const numRows = Math.ceil(Math.sqrt(count * r.height / r.width));

	return Math.ceil(numRows * r.width / r.height);
}