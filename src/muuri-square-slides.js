import * as _ from 'lodash';
import Muuri from 'Muuri';
import { elementClosest } from './BatLass/elementSelect';
import { MaxGridFitColumn } from './BatLass/MaxGridFitColumn';

const KONST =
{
	pele_dragover: "pele_dragover"
	, pele_edit_mode: "pele_edit-mode"
	, pele_zoomedin: "pele_zoomedin"
	, pele_chosen_one: "pele_chosen_one"
	, pele_sleeping: "pele_sleeping"
	, DRAGON_DROP_MIME_TYPE: "application/x-pele-move-slideshow"

};

export class MuuriSlideShow
{
	get gridElement()
	{
		return this.gridContainer.querySelector(".grid");
	}
	constructor(options)
	{
		var dragCounter = 0;
		var docElem = document.documentElement;

		this.gridContainer = document.getElementById(options.ID);
		const gridElement = this.gridElement;

		options = {
			layoutDuration: 400,
			layoutEasing: 'ease',
			dragEnabled: true,
			dragSortHeuristics:
			{
				sortInterval: 50,
				minDragDistance: 10,
				minBounceBackAngle: 1
			},
			layout:
			{
				rounding: false
			},
			dragStartPredicate: function (item, event)
			{
				//if ((event.deltaX > 2 || event.deltaY > 2))
				{
					return this.InDragCancelZone(item, event) ? false : Muuri.ItemDrag.defaultStartPredicate(item, event);
				}
			}.bind(this),
			dragPlaceholder:
			{
				enabled: true,
				duration: 400,
				createElement: function (item)
				{
					return this.CreateDragShadow(item);
				}.bind(this)
			},
			dragReleaseDuration: 400,
			dragReleaseEasing: 'ease',
			...options
		}

		this.grid = new Muuri(gridElement, options)
			.on('dragStart', function ()
			{
				++dragCounter;
				docElem.classList.add('dragging');
			})
			.on('dragEnd', function ()
			{
				if (--dragCounter < 1)
				{
					docElem.classList.remove('dragging');
				}
			})
			.on('move', (data) =>
			{
				//console.debug("move", data);

				if (data.item.isDragging())
					this.ConsolidateMove(getDataId(data.item.getElement()), data.fromIndex, data.toIndex, data.action);
				this.updateIndices();
			})
			.on('sort', () => this.updateIndices())
			.on('layoutEnd', scheduleRecomputeIfNeeded.bind(this))
			.on('add', scheduleRecomputeIfNeeded.bind(this))
			.on('remove', scheduleRecomputeIfNeeded.bind(this))
			;

		function scheduleRecomputeIfNeeded()
		{
			const currentColumns = this.grid.getElement().getAttribute("data-pele-square-size-column-count");

			if (this.ComputeFitColumns() != currentColumns)
				setTimeout(recomputedimensions.bind(this), 50);

		}

		gridElement.addEventListener('click', (e) => { this.OnClick(e); });
		gridElement.addEventListener('dblclick', (e) => { this.OnDblClick(e); });

		gridElement.addEventListener("dragover", function (event)
		{
			event.preventDefault();
		}, false);

		gridElement.addEventListener("drop", function (event)
		{
			let data = event.dataTransfer.getData("text/html")
				|| event.dataTransfer.getData("text/uri-list")
				|| event.dataTransfer.getData("text");

			if (data)
			{
				console.debug("text/drop", data);

				this.DoAdd(data);

				event.preventDefault();
				event.stopPropagation();
			}
		}.bind(this));


		recomputedimensions.call(this);
		this.ShowHideBasedOnZoomin();

	}


	ConsolidateMove()
	{
		this.Action("DoMove", ...arguments);
	}

	OnDblClick(event)
	{
		const eItem = elementClosest(event.target, ".item");
		if (eItem)
		{
			if (!this.grid.getItems(eItem)[0].isDragging())
				this.SlideZoom();
		}
		else
		{
			const eOverlay = elementClosest(event.target, ".pele_deactive_overlay");
			if (eOverlay)
			{
				event.stopPropagation();
				//self.Action("DoFullScreen", rowIndex(e));
			}
		}
	}

	OnClick(event)
	{
		const eItem = elementClosest(event.target, ".item");
		if (eItem && this.InEditMode())
		{

		}
		else if (eItem && !this.IsInZoomMode())
		{
			this.DoSelect(getDataId(eItem));
		}
		else
		{
			const eOverlay = elementClosest(event.target, ".pele_deactive_overlay");
			//	if (eOverlay)
			{
				//console.debug("In Overlay");
				//event.stopPropagation();
				//self.Action("DoSelect", rowIndex(e));
			}
		}
	}


	DoAdd()
	{
		this.Action("DoAdd", ...arguments);
	}


	DoDelete()
	{
		this.Action("DoDelete", ...arguments);
	}

	DoSelect()
	{
		this.Action("DoSelect", ...arguments);
	}

	Action(cmd, ...args)
	{
		function doAdd(txt)
		{
			this.AddUnknown(txt);
		}

		function doDelete(id, envelope)
		{
			const e = this.ItemFromId(id) || this.findChosenItem();

			removeItem.call(this, e, envelope);
		}

		function doMove(id, from, to, action)
		{
			//console.debug("doMove", id, from, to, action);
			if (action === "move")
			{
				const e = this.ItemFromId(id);
				//console.debug("move", from, ">", to);
				this.grid.move(e, to, false);
			}
		}

		function doSelect(id)
		{
			const e = this.ItemFromId(id).getElement();
			doChooseSlide.call(this, e);
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
			case "DoMove": doMove.apply(this, args); break;
			case "DoSelect": doSelect.apply(this, args); break;
			case "ToggleZoom": doZoom.apply(this, args); break;
			case "SetIframeActiveState": doIframe.apply(this, args); break;
		}
	}

	ItemFromId(id)
	{
		const e = this.grid.getElement().querySelector("[data-id='" + id + "']");
		return this.grid.getItems(e)[0];
	}

	RemoveItem(e)
	{
		this.DoDelete(getDataId(elementClosest(e, '.item')));
	}

	CreateDragShadow(item)
	{
		return item.getElement().cloneNode(true);
	}

	InDragCancelZone(item, event)
	{
		return this.InEditMode() || this.IsInZoomMode();
	}

	IsInZoomMode()
	{
		return document.body.classList.contains(KONST.pele_zoomedin);
	}

	DoAddElement(e)
	{
		setupDragHandlers.call(this, e);

		this.grid.add(e);
		this.updateIndices();
		this.ShowHideBasedOnZoomin();

		if (this.IsInZoomMode())
			doChooseSlide.call(this, e);
	}

	AddUnknown(txt)
	{
		try
		{
			this.AddType(...JSON.parse(txt));
		}
		catch(err)
		{
			this.DoAddText(txt);
		}
	}



	ExportData(eContent)
	{
		const e = eContent.querySelector(".card-content").firstElementChild;

		const ed = e._pele_export_data;

		const rg = [
			["text/plain", JSON.stringify(ed)]
		];

		return rg;
	}

	SlidePrevious()
	{
		this.SlideIncrement(-1);
	}

	SlideNext()
	{
		this.SlideIncrement(1);
	}

	SlideZoom()
	{
		if (!this.IsInZoomMode())
			this.ToggleZoom();
	}

	ToggleZoom()
	{
		const eChosen = this.findChosenOne();
		if (eChosen)
			this.Action("ToggleZoom", getDataId(eChosen));
	}

	SetIframeActiveState(eCard, fChecked)
	{
		if (eCard && eCard.querySelector(".card-content iframe"))
			this.Action("SetIframeActiveState", getDataId(eCard), fChecked);
	}

	SlideUnzoom()
	{
		if (this.IsInZoomMode())
			this.ToggleZoom();
	}

	SlideIncrement(amount)
	{
		const eFirst = this.grid.getItems(0);

		if (eFirst.length)
		{
			let eNext;
			const eChosen = this.findChosenItem();
			if (!eChosen)
				eNext = eFirst;
			else
			{
				const iChosen = this.ElementIndex(eChosen);

				eNext = this.grid.getItems(iChosen + amount);
				if (!eNext.length)
					eNext = this.grid.getItems(0);
			}

			this.DoSelect(getDataId(eNext[0].getElement()));
		}
	}

	InEditMode()
	{
		return this.grid.getElement().classList.contains(KONST.pele_edit_mode);

	}

	EnterEditMode()
	{
		this.grid.getElement().classList.add(KONST.pele_edit_mode);
		this.grid.getItems().forEach(item =>
		{
			const e = item.getElement().querySelector(".card");
			e.setAttribute("draggable", true);
		});
	}

	ExitEditMode()
	{
		this.grid.getElement().classList.remove(KONST.pele_edit_mode);
		this.grid.getItems().forEach(item =>
		{
			const e = item.getElement().querySelector(".card");
			e.removeAttribute("draggable");
		});
	}

	ShowHideBasedOnZoomin()
	{
		const fAlreadyzoomed = this.IsInZoomMode();

		const eChosen = this.findChosenOne();

		if (fAlreadyzoomed && eChosen)
		{
			const all = this.grid.getItems().filter(item => eChosen != item);
			this.grid.hide(all);
			this.grid.show(eChosen);
		}
		else
		{
			this.grid.show(this.grid.getItems());
		}

		//this.updateIndices();
		//this.grid.refreshItems().layout();
	}

	ComputeFitColumns()
	{
		const rg = this.grid.getItems();
		const slidecount = rg.length;
		return MaxGridFitColumn(this.gridContainer, slidecount);
	}


	ElementIndex(e)
	{
		return this.grid.getItems().indexOf(e);
	}




	unchooseSlide(e)
	{
		if (e)
			e.classList.remove(KONST.pele_chosen_one);
	}

	findChosenItem()
	{
		const eChosen = this.grid.getItems().filter(item => item.getElement().classList.contains(KONST.pele_chosen_one));
		if (eChosen.length)
			return eChosen[0];
	}

	findChosenOne()
	{
		const eChosen = this.findChosenItem();
		if (eChosen)
			return eChosen.getElement();
	}

	chooseSlide(e)
	{
		if (e)
		{
			e.classList.add(KONST.pele_chosen_one);
		}
	}


	DeleteSlide(e)
	{
		if (isChosen(e))
			this.unchooseSlide(e);

		if (this.IsInZoomMode())
		{
			unzoomSlide.call(this);
		}

		this.ShowHideBasedOnZoomin();
	}


	updateIndices()
	{
		this.grid.getItems().forEach(function (item, i)
		{
			var newId = i + 1;
			//item.getElement().setAttribute('data-id', newId);
			item.getElement().querySelector('.card-id').innerHTML = newId;
			if (item._dragPlaceholder.isActive())
			{
				item._dragPlaceholder._element.querySelector('.card-id').innerHTML = newId;
			}
		});
	}
}

function getDataId(e)
{
	return e.getAttribute('data-id');
}

function removeItem(elem, envelope)
{
	//console.debug("removeItem", elem, envelope);

	function xxx(elem)
	{
		this.DeleteSlide(elem.getElement());
		this.grid.remove(elem, { removeElements: true });

		this.updateIndices();
	}

	if (elem)
	{
		if (envelope.inplaybackmode)
			xxx.call(this, elem);
		else
			this.grid.hide(elem, {
				onFinish: function (items)
				{
					xxx.call(this, elem);
				}.bind(this)
			});
	}

	//this.updateIndices();

}

function isChosen(e)
{
	return e.classList.contains(KONST.pele_chosen_one);
}

function recomputedimensions()
{
	//console.debug("recomputedimensions");	
	this.updateIndices();
	this.grid.getElement().setAttribute("data-pele-square-size-column-count", this.ComputeFitColumns());
	this.grid.refreshItems().layout();

}


function doChooseSlide(e)
{
	//console.debug("doChooseSlide", e);
	if (e)
	{
		this.unchooseSlide(this.findChosenOne());
		this.chooseSlide(e);
		this.ShowHideBasedOnZoomin();
	}
}


function doSetIframeActiveState(e, fState)
{
	if (e)
	{
		const eFrame = e.querySelector(".card-content iframe");
		if (eFrame)
		{
			console.debug("iFrame detected", eFrame, fState);
			if (fState)
			{
				e.classList.add(KONST.pele_sleeping);
				eFrame.setAttribute("sandbox", "");
			}
			else
			{
				e.classList.remove(KONST.pele_sleeping);
				eFrame.removeAttribute("sandbox");
			}

			eFrame.src = eFrame.src;
		}
	}
}

function unzoomSlide()
{
	//alreadyZoomed.classList.remove("pele_zoomedin");
	document.body.classList.remove(KONST.pele_zoomedin);
}

function doZoomSlide(e)
{

	if (this.IsInZoomMode())
		unzoomSlide.call(this);
	else
		document.body.classList.add(KONST.pele_zoomedin);
	//	updateIndices();
	//

	recomputedimensions.call(this);
	this.ShowHideBasedOnZoomin();
}

function extractURL(e)
{
	const eContainer = e.querySelector("div.card-content");
}

function setupDragHandlers(e)
{
	const item = elementClosest(e, ".item");
	const slideshow = this;

	e.addEventListener("dragstart", function (event)
	{
		console.debug("dragstart", event.target);

		const exportdata = slideshow.ExportData(item);
		exportdata.forEach(rg =>
		{
			event.dataTransfer.setData(rg[0], rg[1]);
		})
		//event.dataTransfer.effectAllowed = "copy";
		//event.dataTransfer.setData(KONST.DRAGON_DROP_MIME_TYPE, "hello");
		event.stopPropagation();
	}, true);

}