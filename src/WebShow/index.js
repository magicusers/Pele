import './index.scss';

import _ from 'lodash';

import { KookData } from "../BatMan/KookData";
import { elementMatches, elementClosest } from '../BatMan/elementSelect';
import { KeyBufferCommander } from '../BatMan/KeyBufferCommander';

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

		DoAddText(txt)
		{
			const e = generateElement(txt);
			this.DoAddElement(e);
			e._pele_export_data = txt;
		}

		ExportData(e)
		{
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
	}


	const slideshow = new MyMurriSlideShow(
		{
			ID: "coolslides"
		}, this);

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
				Aθεος.Freyja.Children().forEach(child=>Aθεος.Freyja.QueryChild(child, cmd, ...data));				
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

	function removeElement(e)
	{
		e.parentElement.removeChild(e);
	}

	function extractTemplateElement(id)
	{
		const e = document.getElementById(id);
		removeElement(e);
		e.removeAttribute("id", e);

		return e;
	}


	const eCardOpsTemplate = extractTemplateElement("idTemplateCardOperations");
	const eItemTemplate = extractTemplateElement("idTemplateItem");
	const eNavigationTemplate = extractTemplateElement("idTemplateNavigation");

	function createslide(eContent, type, txt)
	{
		const eNav = eNavigationTemplate.cloneNode(true);

		switch (type)
		{
			case "img":
				{
					const e = document.createElement("div");
					e.classList.add("pele-responsive_image_container");
					e.style.backgroundImage = `url(${txt})`;

					removeElement(eNav.querySelector(".card-op-sleep"));
					eContent.appendChild(e);
				}
				break;

			case "iframe": // hackhack: Make this more restrictive and secure
				{
					const e = document.createElement("iframe");
					e.setAttribute("allow", "camera;microphone");
					e.setAttribute("src", txt);
					eContent.appendChild(e);
					eContent.appendChild(eCardOpsTemplate.cloneNode(true));
				}
				break;

			default:
				{

					const e = document.createElement("iframe");
					e.setAttribute("srcdoc", txt);
					eContent.appendChild(e);
					eContent.appendChild(eCardOpsTemplate.cloneNode(true));
				}
				break;
		}

		eContent.appendChild(eNav);
	}

	function generateElement(txt)
	{
		const id = ++uuid;
		const title = id;

		const itemElem = eItemTemplate.cloneNode(true);
		itemElem.setAttribute("data-id", id);
		itemElem.setAttribute("data-title", title);

		const eContent = itemElem.querySelector(".card-content");

		createslide(eContent, ...KookData(txt));

		itemElem.querySelector(".card-id").innerHTML = id;
		return itemElem;
	}


});

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


	OnInit()
	{
		super.OnInit();
		initgame.call(this);
	}
}

Aθεος.Αφροδίτη.OnReady().then(() => new GameControl());

