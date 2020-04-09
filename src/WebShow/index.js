import './index.scss';

import _ from 'lodash';

import { KookData } from "../BatMan/KookMimeData";
import { KeyBufferCommander } from '../BatMan/KeyBufferCommander';

import { removeElement, extractTemplateElement, elementMatches, elementClosest } from '../BatMan/elementary';
import { createspellelement, despellify } from "../BatMan/Spell";

//import { arc } from 'd3';

const initgame = _.once(function ()
{
	let uuid = 0;

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
			this.patched_AddType = gameserver.Patch((type, txt) =>
			{
				const e = generateElement(type, txt);
				this.DoAddElement(e);
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

			rg.forEach(([type, txt]) =>
			{
				this.patched_AddType(...despellify(type, txt));
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

	function generateElement(type, txt)
	{
		const id = ++uuid;
		const title = id;

		const itemElem = eItemTemplate.cloneNode(true);
		itemElem.setAttribute("data-id", id);
		itemElem.setAttribute("data-title", title);

		const eContent = itemElem.querySelector(".card-content");

		createspellelement(eNavigationTemplate, eCardOpsTemplate, eContent, type, txt);

		itemElem.querySelector(".card-id").innerHTML = id;
		return itemElem;
	}

	Aθεος.Freyja.AddHandler(function (responder, cmd, ...data)
	{
		switch (cmd)
		{
			case "OpenNewInstance":
				slideshow.DoAdd(...data);
				responder.Success();
				break;
		}
	});
	
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
			, Manifest:
			{
				Description:"Drag and drop links to Magic Web Apps, and other online content. They will be displayed in an ordered list of square tiles. View them fullscreen for astonishing collaborative presentations"
			}
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

