import './index.scss';

import _ from 'lodash';

import { KookData } from "../BatLass/KookMimeData";
import { KeyBufferCommander } from '../BatLass/KeyBufferCommander';

import { removeElement, extractTemplateElement, elementMatches, elementClosest } from '../BatLass/elementary';
import { createspellelement, despellify } from "../BatLass/Spell";

//import { arc } from 'd3';

const initgame = _.once(function ()
{
	let uuid = 0;

	function matchesCloseButton(el)
	{
		return elementMatches(el, '.card-remove, .card-remove i');
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

		AddType(type, txt)
		{
			const e = generateElement(type, txt);
			this.DoAddElement(e);
		}

		DoAddText(txt)
		{
			this.AddType(...KookData(txt));
		}

		InDragCancelZone(item, event)
		{
			const eTarget = event.target;

			return matchesCloseButton(eTarget)
				|| super.InDragCancelZone(item, event);
		}

		OnClick(event)
		{
			console.debug("OnClick", event);
			const eTarget = event.target;
			if (matchesCloseButton(eTarget))
				this.RemoveItem(eTarget);
			else if (elementMatches(eTarget, ".card-op-Previous"))
				this.SlidePrevious();
			else if (elementMatches(eTarget, ".card-op-Next"))
				this.SlideNext();
			else if (elementMatches(eTarget, ".card-op-ExitFullScreen"))
				this.DoEscape();
			else
				super.OnClick(event);
		}
		OnDblClick(event)
		{
			console.debug("OnDblClick", event);
			const eTarget = event.target;

			super.OnDblClick(event);
		}
		ToggleZoom()
		{
			// No Zoom;
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
				this.DoAdd(JSON.stringify(despellify(type, txt)));
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

		if (type == "iframe")
			txt = stripinstance(txt);

		const itemElem = eItemTemplate.cloneNode(true);
		itemElem.setAttribute("data-id", id);
		itemElem.setAttribute("data-title", title);

		const eContent = itemElem.querySelector(".card-content");

		const e = createspellelement(eNavigationTemplate, eCardOpsTemplate, eContent, type, txt);
		e._pele_export_data = [type, txt];

		itemElem.querySelector(".card-id").innerHTML = id;
		return itemElem;
	}

	function stripinstance(txt)
	{
		const url = new URL(txt);
		const params = url.searchParams;
		params.delete("i");
		return url.protocol + "//" + url.host + url.pathname + params;
	}

	Aθεος.Freyja.AddHandler(function (responder, cmd, ...data)
	{
		switch (cmd)
		{
			case "OpenNewInstance":
				Aθεος.Freyja.QueryParent("OpenNewInstance", ...data)
					.then(() => responder.Success())
					.catch(err =>
					{
						responder.Fail();
					});
				;
				
				responder.Pending();

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
			Title: "Magic Bag"
			, ReloadDocumentOnReset: true
			, Container: document.getElementById("idMagicUsersContainer")
			, Manifest:
			{
				Description: "Drop links to Magic Web Apps, and other online content. This collection can be used to launch NEW instances that you can share with others."
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

