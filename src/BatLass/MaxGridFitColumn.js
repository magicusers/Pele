export function MaxGridFitColumn(elem, count)
{
	const r = elem.getBoundingClientRect();
	const fracrows = Math.sqrt(count * r.height / r.width);
	if (fracrows < 1)
	{
		return Math.ceil(count/(fracrows*fracrows));
	}

	const numRows = Math.min(count, Math.ceil(fracrows)) ;
	const numCols = Math.ceil(Math.sqrt(count * r.width / r.height));

	const ret =  Math.min(count, Math.ceil(numRows * r.width/r.height) );

	//console.debug("MaxGridFitColumn", count, ret, numCols, numRows, r.width / r.height, r);


	return ret;
}