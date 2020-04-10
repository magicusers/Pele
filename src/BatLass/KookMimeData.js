
var GetFileNameMimeType = (function ()
{
	var rgMap =
	{
		/*
			"3g2": "video/3gpp2",
			"3gp": "video/3gpp",
			"3gp2": "video/3gpp2",
			"3gpp": "video/3gpp",
			*/
		aa: "audio/audible",
		aac: "audio/vnd.dlna.adts",
		aax: "audio/vnd.audible.aax",
		adt: "audio/vnd.dlna.adts",
		adts: "audio/vnd.dlna.adts",
		aif: "audio/aiff",
		aifc: "audio/aiff",
		aiff: "audio/aiff",
		asf: "video/x-ms-asf",
		asx: "video/x-ms-asf",
		au: "audio/basic",
		avi: "video/avi",
		bmp: "image/bmp",
		dib: "image/bmp",
		gif: "image/gif",
		ico: "image/x-icon",
		jfif: "image/jpeg",
		jpe: "image/jpeg",
		jpeg: "image/jpeg",
		jpg: "image/jpeg",
		m1v: "video/mpeg",
		m2t: "video/vnd.dlna.mpeg-tts",
		m2ts: "video/vnd.dlna.mpeg-tts",
		m2v: "video/mpeg",
		m3u: "audio/mpegurl",
		m3u8: "audio/x-mpegurl",
		m4a: "audio/m4a",
		m4b: "audio/m4b",
		m4p: "audio/m4p",
		m4r: "audio/x-m4r",
		m4v: "video/x-m4v",
		mid: "audio/mid",
		midi: "audio/mid",
		mod: "video/mpeg",
		mov: "video/quicktime",
		mp2: "audio/mpeg",
		mp2v: "video/mpeg",
		mp3: "audio/mpeg",
		mp4: "video/mp4",
		mp4v: "video/mp4",
		mpa: "video/mpeg",
		mpe: "video/mpeg",
		mpeg: "video/mpeg",
		mpg: "video/mpeg",
		mpv2: "video/mpeg",
		oga: "audio/ogg",
		ogv: "video/ogg",
		pls: "audio/scpls",
		png: "image/png",
		rmi: "audio/mid",
		snd: "audio/basic",
		svg: "image/svg+xml",
		//tga: "image/targa",
		//tif: "image/tiff",
		//tiff: "image/tiff",
		ts: "video/vnd.dlna.mpeg-tts",
		tts: "video/vnd.dlna.mpeg-tts",
		wav: "audio/wav",
		wave: "audio/wav",
		wax: "audio/x-ms-wax",
		wm: "video/x-ms-wm",
		wma: "audio/x-ms-wma",
		wmv: "video/x-ms-wmv",
		wmx: "video/x-ms-wmx",
		wvx: "video/x-ms-wvx"
	};
	return function (prefix)
	{
		return prefix && rgMap[prefix.toLowerCase()];
	};

})();

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
			datatype = "iframe";

			const url = new URL(txt);
			const fileprefix = txt.split('#').shift().split('?').shift().split('/').pop().split(".").pop();

			const mimetype = GetFileNameMimeType(fileprefix);

			if (mimetype)
			{
				if (mimetype.match(/image.*/))
					datatype = "img";
				else if (mimetype.match(/video.*/))
					datatype = "video";
				else if (mimetype.match(/audio.*/))
					datatype = "audio"
			}
		}
	}
	catch
	{
		datatype = null;
	}

	return [datatype, cooked];

}
