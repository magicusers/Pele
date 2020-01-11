export function KeyBufferCommander(rgKeys, callback, period)
{
	let buffer=[];

	let lastTime = Date.now();

	period = period||1000;

	return function (key)
	{
		const now = Date.now();	
		if (now-lastTime > period)
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