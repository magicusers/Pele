export function KeyBufferCommander(rgKeys, callback)
{
	let buffer=[];

	let lastTime = Date.now();

	return function (key)
	{
		const now = Date.now();	
		if (now-lastTime > 1000)
		{
			buffer=[];
		}		
		lastTime = now;
		
		buffer.push(key);

		const sequence=buffer.join('');

		//console.debug(sequence);
		if (rgKeys.includes(sequence))
		{
			callback(sequence);
			buffer=[];
		}
	}
}