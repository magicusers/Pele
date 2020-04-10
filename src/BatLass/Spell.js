import { removeElement, extractTemplateElement, elementMatches, elementClosest } from './elementary';

const KONST={
	typeMagicIFrame:"magic.iframe"
}



Aθεος.Freyja.AddHandler(function (responder, cmd, ...data)
{
	console.debug("Freyja IPC", cmd, ...data);
	switch (cmd)
	{
		case "Mediaplayer.Control.Directive":
			Aθεος.Freyja.Children().forEach(child => Aθεος.Freyja.QueryChild(child, cmd, ...data));
			//responder.Success();
			break;
	}
});


let rgPendingMagicFrames = {};

export function despellify(type, txt)
{
	if(type === KONST.typeMagicIFrame)
	{
		const archivedata = txt;
		const url = Aθεος.Αφροδίτη.GenerateNewInstanceURL(location.protocol + "//" + archivedata.Source);

		rgPendingMagicFrames[url] = archivedata;
		txt = url;
		type = "iframe";
	}

	return [type, txt];
}

export function createspellelement(eNavigationTemplate, eCardOpsTemplate, eContent, type, txt)
{
	const eNav = eNavigationTemplate.cloneNode(true);

	function createiframe(eContent, txt)
	{
		const e = document.createElement("iframe");

		eContent.appendChild(e);

		eContent.appendChild(eCardOpsTemplate.cloneNode(true));

		if (txt in rgPendingMagicFrames)
		{
			const url = txt;
			const archivedata = rgPendingMagicFrames[url];
			delete rgPendingMagicFrames[url];

			e.addEventListener("load", () =>
			{
				Aθεος.Freyja.OnReadyChild(e).then(() =>
				{
					console.debug("Import data", e);
					Aθεος.Freyja.QueryChild(e.contentWindow, "Import", archivedata.MimeType, archivedata.Payload)
						.catch((err) => console.warn("Import error", err));
					;
				})
					.catch((err) => console.warn("import fail", err))
					;
			});

		}
			
		return e;
	}

	switch (type)
	{
		case "img":
			{
				const e = document.createElement("div");
				e.classList.add("pele-responsive_image_container");
				e.style.backgroundImage = `url(${txt})`;
				removeElement(eNav.querySelector(".card-op-sleep"));
				eContent.appendChild(e);

				e.PeleExportPromise = () => Promise.resolve([type, txt]);
			}
			break;

		case "iframe": // hackhack: Make this more restrictive and secure
			{
				const src = txt;
				const e = createiframe(eContent, txt);

				e.setAttribute("allow", "camera;microphone");
				e.setAttribute("src", src);


				e.PeleExportPromise = () =>
					Aθεος.Freyja.QueryChild(e.contentWindow, "Export")
						.then(data => Promise.resolve([KONST.typeMagicIFrame, JSON.parse(data)]))
						.catch(() => Promise.resolve([type, txt]))
					;

			}
			break;

		case "audio":
		case "video":
			console.warn("can't handle media type", type);
			break;

		default:
			{
				const e = createiframe(eContent, txt);
				e.setAttribute("srcdoc", txt);

				e.PeleExportPromise = () => Promise.resolve([type, txt]);
			}
			break;
	}

	eContent.appendChild(eNav);
}