
export function KookData(txt)
{
	let datatype;
	let cooked = txt;
	try
	{
		const doc = new DOMParser().parseFromString(txt, "text/html");
		const e = doc.body.firstElementChild;
		if (e)
		{
			const tag = e.tagName.toLowerCase();
			switch (tag)
			{
				case "img":
				case "iframe":
					cooked = e.getAttribute("src");
					datatype = tag;
					break;

				case "a":
					cooked = e.getAttribute("href");
					datatype = "iframe";
					break;

				default:
					break;
			}
		}

		if (!datatype)
		{
			const url = new URL(txt);
			const fileprefix = txt.split('#').shift().split('?').shift().split('/').pop().split(".").pop();

			if (fileprefix && "jpg.jpeg.png.svg.gif.bmp.ico".indexOf(fileprefix.toLowerCase()) >= 0)
				datatype = "img";
			else
				datatype = "iframe";
		}
	}
	catch
	{
		datatype = null;
	}

	return [datatype, cooked];

}
