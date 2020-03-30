import './index.scss';

import _ from 'lodash';

import { KookData } from "../BatMan/KookMimeData";
import { KeyBufferCommander } from '../BatMan/KeyBufferCommander';
//import { arc } from 'd3';
import { removeElement, extractTemplateElement, elementMatches, elementClosest } from '../BatMan/elementary';

import interact from 'interactjs';



const MimeTypeForContainer = "application/x-magicusers-list";

const ePaneTemplate = extractTemplateElement("idTemplatePane");
const eNavigationTemplate = extractTemplateElement("idTemplateNavigation");
const eCardOpsTemplate = extractTemplateElement("idTemplateCardOperations");

function matchesCloseButton(el)
{
	return elementMatches(el, '.card-remove');
}

function matchesSleepButton(el)
{
	return elementMatches(el, '.card-op-sleep');
}

function matchesWakeButton(el)
{
	return elementMatches(el, '.card-op-wake');
}

function matchesRotateButton(el)
{
	return elementMatches(el, '.card-op-Rotate');
}

function extractContentElement(e)
{
	return e.querySelector('.card-content').firstElementChild;
}


function createslide(eContent, type, txt)
{
	const eNav = eNavigationTemplate.cloneNode(true);

	function createiframe(eContent, txt)
	{
		const e = document.createElement("iframe");

		e._pele_export_data = txt;
		eContent.appendChild(e);

		eContent.appendChild(eCardOpsTemplate.cloneNode(true));

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

		case "iframe": // hackhack: Make this more restrictive and secure
			{
				const src = txt;
				const e = createiframe(eContent);

				e.setAttribute("allow", "camera;microphone");
				e.setAttribute("src", src);


				e.PeleExportPromise = () =>
					Aθεος.Freyja.QueryChild(e.contentWindow, "Export")
						.then(data => Promise.resolve([typeMagicIFrame, JSON.parse(data)]))
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
				const e = createiframe(eContent);
				e.setAttribute("srcdoc", txt);

				e.PeleExportPromise = () => Promise.resolve([type, txt]);
			}
			break;
	}

	eContent.appendChild(eNav);
}

let uuid = 0;


class Pane
{
	UpdateTransform()
	{
		let transform = 'translate(' + this.PositionX + 'px,' + this.PositionY + 'px)';

		const angle = this.PositionAngle;
		if (angle)
			transform += ' rotate(' + angle + 'rad' + ')';

		this.element.style.webkitTransform =
			this.element.style.transform = transform;

	}

	MoveTo(x, y)
	{
		// update the posiion attributes
		this.PositionX = x;
		this.PositionY = y;

		this.UpdateTransform();
	}

	Resize(x, y, W, H)
	{
		this._savedW = W;
		this._savedH = H;

		// update the element's style
		this.element.style.width = W + 'px';
		this.element.style.height = H + 'px';

		this.PositionX = x;
		this.PositionY = y;

		this.UpdateTransform();

		const content = this.element.querySelector(".pele_title .card-text");
		content.textContent = Math.round(W) + '\u00D7' + Math.round(H);
	}

	Rotate(angle)
	{
		this.PositionAngle = angle;
		this.UpdateTransform();
	}

	SetTransformLock(fState)
	{
		if (fState)
			this.element.classList.add("pele_tranform_lock");
		else
			this.element.classList.remove("pele_tranform_lock");
	}

	IFrameElement()
	{
		return this.element.querySelector(".pele_content > iframe");
	}

	SetSleepState(fState)
	{
		const eFrame = this.IFrameElement();
		if (eFrame)
		{
			console.debug("iFrame detected", eFrame, fState);
			if (fState)
			{
				this.element.classList.add("pele_sleeping");
				eFrame.setAttribute("sandbox", "");
			}
			else
			{
				this.element.classList.remove("pele_sleeping");
				eFrame.removeAttribute("sandbox");
			}

			eFrame.src = eFrame.src;
		}
	}


	SetZoomState(fState)
	{
		if (fState)
		{
			this.element.classList.add("pele_zoomedin");
			this.element.style.transform = null;
			this.element.style.width = null;
			this.element.style.height = null;
		}
		else
		{
			this.element.classList.remove("pele_zoomedin");
			this.Resize(this.PositionX, this.PositionY, this._savedW, this._savedH);
		}
	}


	Delete()
	{
		removeElement(this.element);
		this.manager.BringToFront(this.manager.FrontPane());
	}



	constructor(manager, data)
	{
		this.element = ePaneTemplate.cloneNode(true);
		this.element.setAttribute("data-pele-id", ++uuid);

		createslide(this.element.querySelector(".pele_content"), ...KookData(data));

		if (this.IFrameElement())
			this.element.classList.add("pele_sleepingagent");

		this.manager = manager;
		this.manager.Container.appendChild(this.element);

		//this.element.querySelector(".pele_title").textContent = title;



		interact(this.element)
			.resizable({
				// resize from all edges and corners
				ignoreFrom: '.pele_title',
				edges: {
					left: ".pele_resize_border_left",
					right: ".pele_resize_border_right",
					bottom: ".pele_resize_border_bottom",
					top: ".pele_resize_border_top"
				},

				listeners: {
					start: event =>
					{
						this.element.classList.add("pele_pane_inmotion");
					},
					move: (event) =>
					{
						const x = this.PositionX + event.deltaRect.left;
						const y = this.PositionY + event.deltaRect.top;

						this.Resize(x, y, event.rect.width, event.rect.height);
					},
					end: (event) =>
					{
						this.element.classList.remove("pele_pane_inmotion");

						manager.ActionResize(Pane.FromElement(event.target).GetDataId(), this.PositionX, this.PositionY, event.rect.width, event.rect.height);
					}
				},
				modifiers: [
					// keep the edges inside the parent
					interact.modifiers.restrictEdges({
						outer: 'parent'
					}),

					// minimum size
					interact.modifiers.restrictSize({
						min: { width: 100, height: 50 }
					})
				],

				inertia: true
			})
			.draggable({
				allowFrom: '.pele_title',
				ignoreFrom: '.card-ops',
				listeners: {
					start: event =>
					{
						this.element.classList.add("pele_pane_inmotion");
					},
					move: (event) =>
					{
						var x = this.PositionX + event.dx;
						var y = this.PositionY + event.dy;

						this.MoveTo(x, y);
					},
					end: (event) =>
					{
						this.element.classList.remove("pele_pane_inmotion");
						manager.ActionMoveTo(Pane.FromElement(event.target).GetDataId(), this.PositionX, this.PositionY);
					}
				},
				inertia: true,

			})
			;


		interact(this.element.querySelector(".card-op-Lock"))
			.on("click", (event) =>
			{
				manager.ActionSetTransformLock(Pane.FromElement(event.target).GetDataId(), true);
			});
		interact(this.element.querySelector(".card-op-Unlock"))
			.on("click", (event) =>
			{
				manager.ActionSetTransformLock(Pane.FromElement(event.target).GetDataId(), false);
			});

		interact(this.element.querySelector(".card-op-sleep"))
			.on("click", (event) =>
			{
				manager.ActionSetSleepState(Pane.FromElement(event.target).GetDataId(), true);
			});

		Array.from(this.element.querySelectorAll(".card-op-wake")).forEach(e => interact(e)
			.on("click", (event) =>
			{
				manager.ActionSetSleepState(Pane.FromElement(event.target).GetDataId(), false);
			})
		);



		interact(this.element.querySelector(".card-op-GoFullScreen"))
			.on("click", (event) =>
			{
				manager.ActionSetZoomState(Pane.FromElement(event.target).GetDataId(), true);
			});
		interact(this.element.querySelector(".card-op-Unzoom"))
			.on("click", (event) =>
			{
				manager.ActionSetZoomState(Pane.FromElement(event.target).GetDataId(), false);
			});

		interact(this.element.querySelector(".card-op-Close"))
			.on("click", (event) =>
			{
				manager.ActionDelete(Pane.FromElement(event.target).GetDataId());
			});



		interact(this.element.querySelector(".card-op-Rotate"))
			.draggable({
				onstart: (event) =>
				{
					this.element.classList.add("pele_pane_inmotion");

					const rect = this.element.getBoundingClientRect();


					// store the center as the element has css `transform-origin: center center`
					this.PositionCenterX = rect.left + rect.width / 2;
					this.PositionCenterY = rect.top + rect.height / 2;
					// get the angle of the element when the drag starts
					this.PositionAngle = getDragAngle.call(this, event);
				},
				onmove: (event) =>
				{
					const angle = getDragAngle.call(this, event);

					// update transform style on dragmove
					this.element.style.transform = 'translate(' + this.PositionX + 'px, ' + this.PositionY + 'px) rotate(' + angle + 'rad' + ')';
				},
				onend: (event) =>
				{
					this.element.classList.remove("pele_pane_inmotion");
					manager.ActionRotate(Pane.FromElement(event.target).GetDataId(), getDragAngle.call(this, event));
				},
			})
			.on("dblclick", (event) =>
			{
				manager.ActionRotate(Pane.FromElement(event.target).GetDataId(), 0);
			})

		function getDragAngle(event)
		{
			var startAngle = this.PositionAngle;
			var angle = Math.atan2(this.PositionCenterY - event.clientY,
				this.PositionCenterX - event.clientX);

			return angle - startAngle;
		}

		this.element.addEventListener("mousedown", event =>
		{
			manager.ActionBringToFront(Pane.FromElement(event.target).GetDataId());
		});

		this.element._pele_pane_self_reference = this;
	}

	get PositionX()
	{
		return (parseFloat(this.element.getAttribute('data-x')) || 0)
	}
	set PositionX(x)
	{
		this.element.setAttribute('data-x', x);
	}

	get PositionY()
	{
		return (parseFloat(this.element.getAttribute('data-y')) || 0)
	}
	set PositionY(y)
	{
		this.element.setAttribute('data-y', y);
	}

	get PositionCenterX()
	{
		return (parseFloat(this.element.getAttribute('data-center-x')) || 0)
	}
	set PositionCenterX(x)
	{
		this.element.setAttribute('data-center-x', x);
	}
	get PositionCenterY()
	{
		return (parseFloat(this.element.getAttribute('data-center-y')) || 0)
	}
	set PositionCenterY(y)
	{
		this.element.setAttribute('data-center-y', y);
	}
	get PositionAngle()
	{
		return (parseFloat(this.element.getAttribute('data-angle')) || 0);
	}
	set PositionAngle(a)
	{
		this.element.setAttribute('data-angle', a);
	}


	OnClick(event)
	{
		const e = event.target;

		/* 		if (matchesSleepButton(e))
					alert("yo"); */
	}


	static FromElement(el)
	{
		const e = el && elementClosest(el, ".pele_pane");
		return e && e._pele_pane_self_reference;
	}

	OnDeactivate()
	{
		this.element.classList.remove("pele_pane_active");
	}

	OnActivate()
	{
		this.element.classList.add("pele_pane_active");
	}

	static FindActive(container)
	{
		return this.FromElement(container.querySelector(".pele_pane_active"));
	}

	BringToFront()
	{
		this.manager.BringToFront(this);
	}

	GetDataId()
	{
		return this.element.getAttribute('data-pele-id');
	}

	get zIndex()
	{
		return this.element.style.zIndex;
	}
	set zIndex(z)
	{
		this.element.style.zIndex = z;
	}
}


class PaneManager
{
	constructor(container)
	{
		this.Container = container;


		function onClick(event)
		{
			const e = event.target;

			const ePane = Pane.FromElement(e);
			if (ePane)
				ePane.OnClick(event);

		}

		this.Container.addEventListener("click", onClick);

		//this.Add("yo baby");
		//this.Add("helo");

		function textdatadrop(event, data)
		{
			if (data)
			{
				this.ActionAddText(data);

				event.preventDefault();
				event.stopPropagation();
			}
		}

		document.addEventListener("paste", event =>
		{
			let data = (event.clipboardData || window.clipboardData).getData('text');
			textdatadrop.call(this, event, data);
		});


		this.Container.addEventListener("dragover", function (event)
		{
			event.preventDefault();
		}, false);

		this.Container.addEventListener("drop", (event) =>
		{
			let data = event.dataTransfer.getData("text/html")
				|| event.dataTransfer.getData("text/uri-list")
				|| event.dataTransfer.getData("text");

			textdatadrop.call(this, event, data);
		});
	}

	All()
	{
		return Array.from(this.Container.querySelectorAll(".pele_pane")).map(e => Pane.FromElement(e));
	}

	PaneFromDataId(id)
	{
		return Pane.FromElement(this.Container.querySelector("[data-pele-id='" + id + "']"));
	}

	FrontPane()
	{
		try
		{
			return this.All().reduce((f, e) => f.zIndex > e.zIndex ? f : e);
		}
		catch (err)
		{ }
	}

	BringToFront(pane)
	{
		if (pane)
		{
			const currentActive = Pane.FindActive(this.Container);

			if (currentActive != pane)
			{
				let newindex;
				if (currentActive)
				{
					newindex = currentActive.zIndex;
					currentActive.OnDeactivate();

					if (pane.zIndex)
					{
						const baseindex = pane.zIndex;

						this.All().forEach(p =>
						{
							if (p.zIndex > baseindex)
								--p.zIndex;
						});
					}
					else
						++newindex;
				}
				else
				{
					newindex = this.Container.children.length;
				}

				console.debug("new z=", newindex);
				pane.zIndex = newindex;
				pane.OnActivate();
			}
		}
	}


	DoAddText(txt)
	{
		const pane = new Pane(this, txt);

		const windowcount = this.Container.children.length;
		const gridwidth = 42;
		const r = this.Container.getBoundingClientRect();
		const nx = r.width / (2 * gridwidth);
		const ny = r.height / (2 * gridwidth);

		pane.Resize((windowcount % nx) * gridwidth, (windowcount % ny) * gridwidth, r.width / 2, r.height / 2);

		this.BringToFront(pane);
	}


	ActionAddText()
	{
		this.Action("DoAdd", ...arguments);
	}

	ActionMoveTo()
	{
		this.Action("DoMoveTo", ...arguments);
	}

	ActionRotate()
	{
		this.Action("DoRotate", ...arguments);
	}

	ActionResize()
	{
		this.Action("DoResize", ...arguments);
	}

	ActionBringToFront()
	{
		this.Action("DoBringToFront", ...arguments);
	}

	ActionSetTransformLock()
	{
		this.Action("DoSetTransformLock", ...arguments);
	}

	ActionSetSleepState()
	{
		this.Action("DoSetSleepState", ...arguments);
	}

	ActionSetZoomState()
	{
		this.Action("DoSetZoomState", ...arguments);
	}

	ActionDelete()
	{
		this.Action("DoDelete", ...arguments);
	}


	Action(cmd, ...args)
	{
		function doAdd(txt)
		{
			this.DoAddText(txt);
		}

		function doMoveTo(id, ...args)
		{
			this.PaneFromDataId(id).MoveTo(...args);
		}
		function doResize(id, ...args)
		{
			this.PaneFromDataId(id).Resize(...args);
		}

		function doRotate(id, ...args)
		{
			this.PaneFromDataId(id).Rotate(...args);
		}

		function doBringToFront(id, ...args)
		{
			this.PaneFromDataId(id).BringToFront(...args);
		}

		function doDelete(id, ...args)
		{
			this.PaneFromDataId(id).Delete(...args);
		}

		function doSetTransformLock(id, ...args)
		{
			this.PaneFromDataId(id).SetTransformLock(...args);
		}

		function doSetSleepState(id, ...args)
		{
			this.PaneFromDataId(id).SetSleepState(...args);
		}

		function doSetZoomState(id, ...args)
		{
			this.PaneFromDataId(id).SetZoomState(...args);
		}

		function doZoom(id)
		{
			const e = this.ItemFromId(id).getElement();
			doZoomSlide.call(this, e);
		}

		function doIframe(id, fState)
		{
			const e = this.ItemFromId(id).getElement();
			doSetIframeActiveState.call(this, e, fState);
		}

		switch (cmd)
		{
			case "DoAdd": doAdd.apply(this, args); break;
			case "DoDelete": doDelete.apply(this, args); break;
			case "DoMoveTo": doMoveTo.apply(this, args); break;
			case "DoRotate": doRotate.apply(this, args); break;
			case "DoResize": doResize.apply(this, args); break;
			case "DoBringToFront": doBringToFront.apply(this, args); break;
			case "DoSetTransformLock": doSetTransformLock.apply(this, args); break;
			case "DoSetSleepState": doSetSleepState.apply(this, args); break;
			case "DoSetZoomState": doSetZoomState.apply(this, args); break;
			case "DoDelete": doDelete.apply(this, args); break;
			case "SetIframeActiveState": doIframe.apply(this, args); break;
		}
	}
}

class GameControl extends Aθεος.Αφροδίτη.SharedContainerWorld
{
	constructor()
	{
		super({
			Title: "Magic Panes"
			, ReloadDocumentOnReset: true
			, Container: document.getElementById("idMagicUsersContainer")
		});

		class MyPaneManager extends PaneManager
		{
			constructor(gameserver, container)
			{
				super(container);

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

		}

		this.paneManager = new MyPaneManager(this, document.getElementById("painMain"));

	}

	Import(type, data)
	{
		if (type === MimeTypeForContainer)
		{
			//this.Server.Import(data);
			this.paneManager.Import(data);
		}
	}

	Export()
	{
		//return Promise.resolve([MimeTypeForEvents, this.Server.Export()]) ;

		//return this.slideshow.Export().then(rg => [MimeTypeForContainer, rg]);
	}

	OnInit()
	{
		super.OnInit();
		//initgame.call(this);
	}



}

Aθεος.Αφροδίτη.OnReady().then(() => new GameControl());

