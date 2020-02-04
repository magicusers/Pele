import './index.scss';

import * as _ from 'lodash';

import { KookData } from "../BatMan/KookData";
import { elementMatches } from '../BatMan/elementSelect';
import { KeyBufferCommander } from '../BatMan/KeyBufferCommander';



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
		let uuid = 0;

		class MyMurriSlideShow extends Pele.MuuriSlideShow
		{
			constructor(options, gameserver)
			{
				super(options);

				this.patched_Action = gameserver.PatchRaw(function (envelope, ...args)
				{
					this.original_Action(...args, envelope);
				}.bind(this));
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
				return elementMatches(event.target, '.card-remove, .card-remove i') || super.InDragCancelZone(item, event);
			}

			OnClick(e)
			{
				if (elementMatches(e.target, '.card-remove, .card-remove i'))
					this.RemoveItem(e.target);
				else
					super.OnClick(e);
			}

			CreateDragShadow(item)
			{
				const e = super.CreateDragShadow(item);

				const eFrame = e.querySelector("iframe");

				if (eFrame)
					eFrame.parentElement.removeChild(eFrame);

				return e;
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
		window.DoExitFullScreen = doEscape;
		
		function doEscape()
		{
					slideshow.SlideUnzoom();
					slideshow.ExitEditMode()

		}

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
					doEscape();
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

		function createslide(type, txt)
		{
			switch (type)
			{
				case "img":
					return `<div class='pele-responsive_image_container' style='background-image:url(${txt})'></div>`;

				case "iframe": /* hackhack: Make this more restrictive and secure */
					return `<iframe allow='camera;microphone' src='${txt}'></iframe>`;
			}

			return `<iframe srcdoc='${txt}'></iframe>`;
			//return `<div>${txt}</div>`;
		}


		function generateElement(txt)
		{
			const id = ++uuid;
			const title = id;

			var itemElem = document.createElement('div');
			var itemTemplate = '' +
				'<div class="item" data-id="' + id + '" data-title="' + title + '">' +
				'<div class="item-content">' +
				'<div class="card">' +
				'<div class="card-content">' +
				createslide.apply(this, KookData(txt)) +
				'</div>' +
				//'<div class="card-title">' + title + '</div>' +
				'<div class="pele_deactive_overlay"></div>' +
				'<div class="card-id">' + id + '</div>' +
				'<div class="card-remove"></div>' +
				'</div>' +
				'</div>' +
				'</div>';

			itemElem.innerHTML = itemTemplate;

			const e = itemElem.firstChild;
			return e;

		}

		super.OnInit();
	}
}

Aθεος.Αφροδίτη.OnReady().then(()=>new GameControl());

