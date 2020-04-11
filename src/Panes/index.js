import './index.scss';

import _ from 'lodash';

import { KookData } from "../BatLass/KookMimeData";
import { KeyBufferCommander } from '../BatLass/KeyBufferCommander';
//import { arc } from 'd3';
import { removeElement, extractTemplateElement, elementMatches, elementClosest } from '../BatLass/elementary';
import { createspellelement, despellify } from "../BatLass/Spell";

import interact from 'interactjs';


const MimeTypeForContainer = "application/x-magicusers-list";
const TypeofDragon = "text/x-magicusers-pane-data";

const ePaneTemplate = extractTemplateElement("idTemplatePane");
const eNavigationTemplate = extractTemplateElement("idTemplateNavigation");
const eCardOpsTemplate = extractTemplateElement("idTemplateCardOperations");

const PERIOD_PASTE_URL_WAIT = 5000;

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

function matchesTitleLabel(el)
{
	return elementMatches(el, '.pele_title > .card-label');
}

function extractContentElement(e)
{
	return e.querySelector('.card-content').firstElementChild;
}



let uuid = 0;


class Pane
{
	get ContentContainerElement()
	{
		return this.element.querySelector('.pele_content');
	}

	get ContentElement()
	{
		return this.ContentContainerElement.firstElementChild;
	}

	get LabelElement()
	{
		return this.element.querySelector('.pele_title > .card-label');
	}

	get PeleExportPromise()
	{
		const e = this.ContentElement;

		const dim = {
			x: this.PositionX,
			y: this.PositionY,
			a: this.PositionAngle,
			H: this._savedH,
			W: this._savedW,
			L: this.LabelElement.innerHTML
		}
		return function ()
		{
			return e.PeleExportPromise().then(([type, txt]) =>
			{
				return Promise.resolve([type, txt, dim]);
			})

		}
	}

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

		//const content = this.element.querySelector(".pele_title .card-text");
		//content.textContent = Math.round(W) + '\u00D7' + Math.round(H);
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

	SetLabel(label)
	{
		this.LabelElement.innerHTML = label;
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

	IsZoomed()
	{
		return this.element.classList.contains("pele_zoomedin");
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



	constructor(manager, data, type)
	{
		this.element = ePaneTemplate.cloneNode(true);
		this.element.setAttribute("data-pele-id", ++uuid);
		//this.element.setAttribute("id", "ιδPane_"+uuid);

		const eContent = this.element.querySelector(".pele_content");

		let cookedata = data;
		if (!type)
		{
			const [t, d] = KookData(data);

			type = t;
			cookedata = d;
		}

		eContent._papa_export = [type, cookedata, data];
		createspellelement(eNavigationTemplate, eCardOpsTemplate, eContent, type, cookedata);


		if (this.IFrameElement())
			this.element.classList.add("pele_sleepingagent");

		this.manager = manager;
		this.manager.Container.appendChild(this.element);

		//this.element.querySelector(".pele_title").textContent = title;


		const eCopy = this.element.querySelector(".card-op-Copy");
		eCopy.addEventListener("dragstart", (event) =>
		{
			console.debug("dragstart", event.target);

			const [type, cookedata, data] = this.ContentContainerElement._papa_export;

			event.dataTransfer.setData("text/plain", data);
			event.dataTransfer.setData(TypeofDragon, JSON.stringify([type, cookedata]));

			event.dataTransfer.effectAllowed = "copy";
			//event.dataTransfer.setData(KONST.DRAGON_DROP_MIME_TYPE, "hello");
			event.stopPropagation();
		}, true);

		function lock_inmotion()
		{
			manager.Container.classList.add("pele_dragging");
			this.element.classList.add("pele_pane_inmotion");
		}
		function unlock_inmotion()
		{
			manager.Container.classList.remove("pele_dragging");
			this.element.classList.remove("pele_pane_inmotion");
		}

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
						lock_inmotion.call(this);
					},
					move: (event) =>
					{
						const x = this.PositionX + event.deltaRect.left;
						const y = this.PositionY + event.deltaRect.top;

						this.Resize(x, y, event.rect.width, event.rect.height);
					},
					end: (event) =>
					{
						unlock_inmotion.call(this);
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
				ignoreFrom: '.card-ops, .card-label, .card-label-controls',
				listeners: {
					start: event =>
					{
						lock_inmotion.call(this);
					},
					move: (event) =>
					{
						var x = this.PositionX + event.dx;
						var y = Math.max(0, this.PositionY + event.dy);

						this.MoveTo(x, y);
					},
					end: (event) =>
					{
						unlock_inmotion.call(this);

						manager.ActionMoveTo(Pane.FromElement(event.target).GetDataId(), this.PositionX, this.PositionY);
					}
				},
				inertia: false,                    // start inertial movement if thrown
				modifiers: [
				  interact.modifiers.restrict({
					restriction: 'parent'           // keep the drag coords within the element
				  })
				],
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

		this.LabelElement.addEventListener("input", (event) =>
		{
			this.LabelElement.classList.add("pele_dirty");
		}
		);


		let savedText;
		interact(this.LabelElement)
			.on("focus", (event) =>
			{
				savedText = this.LabelElement.innerHTML;
			});

		function undoLabelChange()
		{
			this.LabelElement.innerHTML = savedText;
			this.LabelElement.classList.remove("pele_dirty");
		}
		function submitLabelChange()
		{
			manager.ActionSetLabel(Pane.FromElement(event.target).GetDataId(), this.LabelElement.innerHTML);
			savedText = null;
			this.LabelElement.classList.remove("pele_dirty");
	}

		interact(this.LabelElement)
			.on("keydown", (event) =>
			{
				//console.debug("key", event.code, event.keyCode, event.key);
				switch (event.key)
				{
					case "Escape":
						undoLabelChange.call(this);
						break;
	
					case 'Enter':
						submitLabelChange.call(this);
						break;
		
					default:
						return;
				}

				event.target.blur();
				event.preventDefault();
				event.stopPropagation();
			});

		interact(this.element.querySelector(".card-op-CancelLabel"))
			.on("click", (event) =>
			{
				undoLabelChange.call(this);
			});
		interact(this.element.querySelector(".card-op-SubmitLabel"))
			.on("click", (event) =>
			{
				submitLabelChange.call(this);
			});




		function togglezoom(event)
		{
			if (!matchesTitleLabel(event.target))
				manager.ActionSetZoomState(Pane.FromElement(event.target).GetDataId(), !this.IsZoomed());
		}

		interact(this.element.querySelector(".card-op-GoFullScreen"))
			.on("click", togglezoom.bind(this));
		interact(this.element.querySelector(".card-op-Unzoom"))
			.on("click", togglezoom.bind(this));
		interact(this.element.querySelector(".pele_title"))
			.on("dblclick", togglezoom.bind(this));

		interact(this.element.querySelector(".card-op-Close"))
			.on("click", (event) =>
			{
				manager.ActionDelete(Pane.FromElement(event.target).GetDataId());
			});



		interact(this.element.querySelector(".card-op-Rotate"))
			.draggable({
				onstart: (event) =>
				{
					lock_inmotion.call(this);

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
					unlock_inmotion.call(this);
					manager.ActionRotate(Pane.FromElement(event.target).GetDataId(), getDragAngle.call(this, event));
				},
			})
			.on("dblclick", (event) =>
			{
				manager.ActionRotate(Pane.FromElement(event.target).GetDataId(), 0);
				event.stopPropagation();
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
			else if (e == container)
			{
				console.debug("mothership click");
			}
		}

		this.Container.addEventListener("click", onClick);

		let lastDblClick=Date.now();
		this.Container.addEventListener("dblclick", event=>{
			if (event.target===this.Container)
				lastDblClick=Date.now();
		});

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
			const elapsed = Date.now()-lastDblClick;
			if (elapsed > PERIOD_PASTE_URL_WAIT)
			{
				console.debug("Ignore paste");
			}
			else
			{
				let data = (event.clipboardData || window.clipboardData).getData('text');
				textdatadrop.call(this, event, data);
			}
			
		});


		this.Container.addEventListener("dragover", function (event)
		{
			event.preventDefault();
		}, false);

		this.Container.addEventListener("drop", (event) =>
		{
			let data = event.dataTransfer.getData(TypeofDragon)
			||event.dataTransfer.getData("text/html")
			|| event.dataTransfer.getData("text/uri-list")
			|| event.dataTransfer.getData("text");

			if (data)
			{
				try
				{
					data = JSON.parse(data);					
				}
				catch(err)
				{
				}
				textdatadrop.call(this, event, data);
			}

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


	DoAddText(txt, type, dim)
	{
		if (typeof txt !== "string")
		{
			const [t, d] = txt;

			txt = d;
			type = t;
		}

		const pane = new Pane(this, txt, type);


		const windowcount = this.Container.children.length;
		const gridwidth = 42;
		const r = this.Container.getBoundingClientRect();
		const nx = r.width / (2 * gridwidth);
		const ny = r.height / (2 * gridwidth);

		if (!_.isUndefined(dim) && dim.W && dim.H)
		{
			pane.Resize(dim.x, dim.y, dim.W, dim.H);
			
			if (!_.isUndefined(dim.a))
				pane.Rotate(dim.a);

			if (!_.isUndefined(dim.L))
				pane.SetLabel(dim.L);
		}
		else
		{
			pane.Resize((windowcount % nx) * gridwidth, (windowcount % ny) * gridwidth, r.width / 2, r.height / 2);
		}

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

	ActionSetLabel()
	{
		this.Action("DoSetLabel", ...arguments);

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
		function doAdd(...args)
		{
			this.DoAddText(...args);
		}

		function doMoveTo(id, ...args)
		{
			const pane = this.PaneFromDataId(id);
			if (pane)
				pane.MoveTo(...args);
		}
		function doResize(id, ...args)
		{
			const pane = this.PaneFromDataId(id);
			if (pane)
				pane.Resize(...args);
		}

		function doRotate(id, ...args)
		{
			const pane = this.PaneFromDataId(id);
			if (pane)
				pane.Rotate(...args);
		}

		function doBringToFront(id, ...args)
		{
			const pane = this.PaneFromDataId(id);
			if (pane)
				pane.BringToFront(...args);
		}

		function doDelete(id, ...args)
		{
			const pane = this.PaneFromDataId(id);
			if (pane)
				pane.Delete(...args);
		}

		function doSetTransformLock(id, ...args)
		{
			const pane = this.PaneFromDataId(id);
			if (pane)
				pane.SetTransformLock(...args);
		}

		function doSetSleepState(id, ...args)
		{
			const pane = this.PaneFromDataId(id);
			if (pane)
				pane.SetSleepState(...args);
		}

		function doSetLabel(id, ...args)
		{
			const pane = this.PaneFromDataId(id);
			if (pane)
				pane.SetLabel(...args);
		}

		function doSetZoomState(id, ...args)
		{
			const pane = this.PaneFromDataId(id);
			if (pane)
				pane.SetZoomState(...args);
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
			case "DoSetLabel": doSetLabel.apply(this, args); break;
			case "DoSetZoomState": doSetZoomState.apply(this, args); break;
			case "DoDelete": doDelete.apply(this, args); break;
		}
	}

	Export()
	{
		//return Promise.resolve([MimeTypeForEvents, this.Server.Export()]) ;

		console.debug("Export slides");

		const rgp = this.All().map(function (pane, i)
		{
			return pane.PeleExportPromise();
		});

		return Promise.all(rgp);

	}


	Import(rg)
	{
		console.debug("import slides", rg);

		rg.forEach(([type, txt, dim]) =>
		{
			const [y,x] = despellify(type, txt);
			this.ActionAddText(x, y, dim);
		});
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
					this.original_Action(...args);
				}.bind(this));

	
				Aθεος.Freyja.AddHandler((responder, cmd, ...data)=>
				{
					switch (cmd)
					{
						case "OpenNewInstance":
								this.ActionAddText(...data);
								responder.Success();
							break;
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

		return this.paneManager.Export().then(rg => [MimeTypeForContainer, rg]);
	}

	OnInit()
	{
		super.OnInit();
		//initgame.call(this);
	}



}

Aθεος.Αφροδίτη.OnReady().then(() => new GameControl());

