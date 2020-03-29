import './index.scss';

import _ from 'lodash';

import { KookData } from "../BatMan/KookData";
import { KeyBufferCommander } from '../BatMan/KeyBufferCommander';

import {removeElement, extractTemplateElement, elementMatches, elementClosest} from '../BatMan/elementary';

//import { arc } from 'd3';

const initgame = _.once(function ()
{
	let uuid = 0;

	const typeMagicIFrame = "magic.iframe";

	function matchesCloseButton(el)
	{
		return elementMatches(el, '.card-remove, .card-remove i');
	}

	function matchesSleepButton(el)
	{
		return elementMatches(el, '.card-op-sleep');
	}

	function matchesWakeButton(el)
	{
		return elementMatches(el, '.card-op-wake');
	}

	function extractContentElement(e)
	{
		return e.querySelector('.card-content').firstElementChild;
	}

	
	class MyMurriSlideShow extends Pele.MuuriSlideShow
	{
		constructor(options, gameserver)
		{
			super(options);

			this.patched_Action = gameserver.PatchRaw(function (envelope, ...args)
			{
				this.original_Action(...args, envelope);
			}.bind(this));

			this.grid.getElement().addEventListener("change", function (event)
			{
				console.debug("onchange", event);
			});

			this.rgPendingMagicFrames={};
			this.patched_AddType=gameserver.Patch((type, txt)=>{
				const e = generateElement(type, txt);
				this.DoAddElement(e);
	
				if (type === "iframe" && (txt in this.rgPendingMagicFrames))
				{
					const url = txt;
					const archivedata = this.rgPendingMagicFrames[url];
					delete this.rgPendingMagicFrames[url];

					const eFrame = extractContentElement(e);
					eFrame.addEventListener("load", ()=>{
						Aθεος.Freyja.OnReadyChild(eFrame).then(()=>{
							console.debug("Import data", eFrame);
							Aθεος.Freyja.QueryChild(eFrame.contentWindow, "Import", archivedata.MimeType, archivedata.Payload)
							    .catch((err)=>console.warn("Import error", err));
								;
						})
						.catch((err) => console.warn("import fail", err))
						;
					});

				}

			});
		}

		Action()
		{
			if (this.patched_Action)
				this.patched_Action(...arguments);
		}
		original_Action()
		{
			super.Action(...arguments);
		}

		DoAddText(txt)
		{
			const e = generateElement(...KookData(txt));
			this.DoAddElement(e);
		}

		ExportData(eContent)
		{
			const e = eContent.querySelector(".card-content").firstElementChild;

			const rg = [
				["text/plain", e._pele_export_data]
			];

			return rg;
		}


		InDragCancelZone(item, event)
		{
			const eTarget = event.target;

			return matchesCloseButton(eTarget)
				|| matchesSleepButton(eTarget)
				|| matchesWakeButton(eTarget)
				|| super.InDragCancelZone(item, event);
		}

		OnClick(event)
		{
			console.debug("OnClick", event);
			const eTarget = event.target;
			if (matchesCloseButton(eTarget))
				this.RemoveItem(eTarget);
			else if (matchesSleepButton(eTarget))
				this.SetIframeActiveState(elementClosest(eTarget, ".item"), true);
			else if (matchesWakeButton(eTarget))
				this.SetIframeActiveState(elementClosest(eTarget, ".item"), false);
			else if (elementMatches(eTarget, ".card-op-Previous"))
				this.SlidePrevious();
			else if (elementMatches(eTarget, ".card-op-Next"))
				this.SlideNext();
			else if (elementMatches(eTarget, ".card-op-ExitFullScreen"))
				this.DoEscape();
			else
				super.OnClick(event);
		}

		CreateDragShadow(item)
		{
			const e = super.CreateDragShadow(item);

			const eFrame = e.querySelector("iframe");

			if (eFrame)
				eFrame.parentElement.removeChild(eFrame);

			return e;
		}

		DoEscape()
		{
			this.SlideUnzoom();
			this.ExitEditMode()
		}

		Import(rg)
		{
			console.debug("import slides", rg);

			rg.forEach(([type, txt]) => {

				if(type === typeMagicIFrame)
				{
					const archivedata = txt;
					const url = Aθεος.Αφροδίτη.GenerateNewInstanceURL(location.protocol + "//" + archivedata.Source);

					this.rgPendingMagicFrames[url] = archivedata;
					txt = url;
					type = "iframe";
				}

				this.patched_AddType(type, txt);
			});
		}

		Export()
		{
			//return Promise.resolve([MimeTypeForEvents, this.Server.Export()]) ;

			console.debug("Export slides");

			const rgp = this.grid.getItems().map(function (item, i)
			{
				const e = extractContentElement(item.getElement());

				return e.PeleExportPromise();
			});

			return Promise.all(rgp);

		}
	}


	const slideshow = new MyMurriSlideShow(
		{
			ID: "coolslides"
		}, this);

	this.slideshow = slideshow;

	window.DoNext = () => slideshow.SlideNext();
	window.DoPrevious = () => slideshow.SlidePrevious();
	//window.DoSome = () => slideshow.DoSome();
	//window.DoDelete = () => slideshow.DoDelete();
	window.DoExitFullScreen = () => slideshow.DoEscape();



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


	document.addEventListener("paste", event =>
	{
		let data = (event.clipboardData || window.clipboardData).getData('text');
		if (data)
		{
			console.debug("pasty", data);

			slideshow.DoAdd(data);

			event.preventDefault();
			event.stopPropagation();
		}
	});

	const kbcEditMode = KeyBufferCommander(["ed", "ED"], cmd =>
	{
		console.debug("Invoked:", cmd);
		slideshow.EnterEditMode();
	});

	document.addEventListener("keydown", event =>
	{
		console.debug("key", event.code, event.keyCode, event.key);
		switch (event.key)
		{
			case "Escape":
				slideshow.DoEscape();
				break;
			case 'ArrowLeft':
				slideshow.SlidePrevious();
				break;
			case 'ArrowRight':
				slideshow.SlideNext();
				break;
			case 'ArrowUp':
				break;
			case 'ArrowDown':
				break;

			case 'Enter':
				slideshow.SlideZoom();
				break;

			default:
				kbcEditMode(event.key);
				break;
		}
	});


	const eCardOpsTemplate = extractTemplateElement("idTemplateCardOperations");
	const eItemTemplate = extractTemplateElement("idTemplateItem");
	const eNavigationTemplate = extractTemplateElement("idTemplateNavigation");

	function createslide(eContent, type, txt)
	{
		const eNav = eNavigationTemplate.cloneNode(true);

		function CreateIFrame(src)
		{
			const e = document.createElement("iframe");
			e.setAttribute("allow", "camera;microphone");
			e.setAttribute("src", src);
			eContent.appendChild(e);
			eContent.appendChild(eCardOpsTemplate.cloneNode(true));

			e._pele_export_data = src;

			e.PeleExportPromise = () =>
			Aθεος.Freyja.QueryChild(e.contentWindow, "Export")
				.then(data => Promise.resolve([typeMagicIFrame, JSON.parse(data)]))
				.catch(() => Promise.resolve([type, txt]))
			;

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

					e._pele_export_data = txt;
					e.PeleExportPromise = () => Promise.resolve([type, txt]);
				}
				break;
/*
			case typeMagicIFrame:
				{
					const archivedata = txt;

					const e = CreateIFrame(location.protocol + "//" + archivedata.Source);

					e.addEventListener("load", ()=>{
						Aθεος.Freyja.OnReadyChild(e).then(()=>{
							console.debug("Import data", e);
							Aθεος.Freyja.QueryChild(e.contentWindow, "Import", archivedata.MimeType, archivedata.Payload)
							    .catch((err)=>console.warn("Import error", err));
							Aθεος.Freyja.QueryChild(e.contentWindow, "GetURL")
									.then(url => {console.debug("GetURL", url); e._pele_export_data = url;} )
									//.catch(() => Promise.resolve([type, txt]))
								;
						})
						.catch((err) => console.warn("import fail", err))
						;
					});

				}
				break;
*/
			case "iframe": // hackhack: Make this more restrictive and secure
				{
					const e = CreateIFrame(txt);
				}
				break;

			default:
				{
					const e = document.createElement("iframe");
					e.setAttribute("srcdoc", txt);
					eContent.appendChild(e);
					eContent.appendChild(eCardOpsTemplate.cloneNode(true));

					e._pele_export_data = txt;
					e.PeleExportPromise = () => Promise.resolve([type, txt]);
				}
				break;
		}

		eContent.appendChild(eNav);
	}

	function generateElement(type, txt)
	{
		const id = ++uuid;
		const title = id;

		const itemElem = eItemTemplate.cloneNode(true);
		itemElem.setAttribute("data-id", id);
		itemElem.setAttribute("data-title", title);

		const eContent = itemElem.querySelector(".card-content");

		createslide(eContent, type, txt);

		itemElem.querySelector(".card-id").innerHTML = id;
		return itemElem;
	}


});

const MimeTypeForContainer = "application/x-magicusers-list";


class GameControl extends Aθεος.Αφροδίτη.SharedContainerWorld
{
	constructor()
	{
		super({
			Title: "Web Magic Show"
			, ReloadDocumentOnReset: true
			, Container: document.getElementById("idMagicUsersContainer")
		});



	}

	Import(type, data)
	{
		if (type === MimeTypeForContainer)
		{
			//this.Server.Import(data);
			this.slideshow.Import(data);
		}
	}

	Export()
	{
		//return Promise.resolve([MimeTypeForEvents, this.Server.Export()]) ;

		return this.slideshow.Export().then(rg => [MimeTypeForContainer, rg]);
	}

	OnInit()
	{
		super.OnInit();
		initgame.call(this);
	}
}

Aθεος.Αφροδίτη.OnReady().then(() => new GameControl());

