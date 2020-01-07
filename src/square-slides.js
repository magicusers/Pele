import { set } from "d3";
import {KookData} from "./BatMan/KookData";

const KONST =
{
	slideactive: "slideactive"
	, activated: "activated"
	, fullscreen: "fullscreen"
	, responsive_image_container: "responsive_image_container"
	, pele_dragover: "pele_dragover"
	, DRAGON_DROP_MIME_TYPE: "application/x-pele-move-slideshow"
};

export class SquareSlides
{
	constructor(options)
	{
		const self = this;

		this.eList = document.getElementById(options.ID);

		/* events fired on the drop targets */
		this.eList.addEventListener("dragover", function (event)
		{
			// prevent default to allow drop
			event.preventDefault();
		}, false);


		this.eList.addEventListener("drop", event =>
		{
			let data = event.dataTransfer.getData("text/html")
				|| event.dataTransfer.getData("text/uri-list")
				|| event.dataTransfer.getData("text/*");

			if (data)
			{
				console.debug("text/drop", data);
				self.DoAdd(data);

				event.preventDefault();
				event.stopPropagation();
			}
		});


		function RecomputeDimensions()
		{
			const slidecount = this.eList.children.length;

			const r = this.eList.getBoundingClientRect();

			const numRows = Math.ceil(Math.sqrt(slidecount* r.height/r.width));

			const numCol = Math.ceil(numRows* r.width/r.height);

			Array.from(this.eList.children).forEach(e=>{
				e.setAttribute("data-pele-square-size-column-count", numCol);
			});
		}
		
		const observer = new MutationObserver(mutations => {
			console.debug(mutations);
			RecomputeDimensions.call(this);
		});
		observer.observe(this.eList, {attributes:false, childList:true, characterData:false});

		window.addEventListener("resize", RecomputeDimensions.bind(this));		
	}


	DoNext()
	{
		this.Action("DoNext");
	}

	DoPrevious()
	{
		this.Action("DoPrevious");
	}

	DoAdd(...args)
	{
		this.Action("DoAdd", ...args);
	}

	DoSome()
	{
		this.Action("DoSome");
	}

	DoDelete()
	{
		this.Action("DoDelete");
	}


	Action(cmd, ...args)
	{
		switch (cmd)
		{
			case "MoveRow": doMoveRow.apply(this, args); break;
			case "DoNext": doNext.apply(this, args); break;
			case "DoPrevious": doPrevious.apply(this, args); break;
			case "DoSome": doSome.apply(this, args); break;
			case "DoDelete": doDelete.apply(this, args); break;

			case "DoSelect": doSelectIndex.apply(this, args); break;
			case "DoFullScreen": doFullScreenIndex.apply(this, args); break;
			case "DoSmallScreen": doSmallScreenIndex.apply(this, args); break;
			case "DoAdd": doAdd.apply(this, args); break;
		}
	}


}

function createslide(type, txt)
{
	let eContent;

	switch (type)
	{
		case "img":
			eContent = document.createElement("div");
			eContent.classList.add(KONST.responsive_image_container);
			eContent.style.backgroundImage = `url("${txt}")`;
			break;

		case "iframe":
			eContent = document.createElement("iframe");
			eContent.setAttribute("src", txt);
			break;

		default:
			eContent = document.createElement("div");
			eContent.innerHTML = txt;

			break;
	}

	return eContent;
}

function doAdd(txt)
{
	const self = this;

	const e = document.createElement("article");

	e.setAttribute("draggable", true);


	this.eContent = createslide.apply(this, KookData(txt));
	e.appendChild(this.eContent);

	const eClose = document.createElement("button");
	eClose.innerHTML = "×";
	eClose.style.backgroundColor = "green";

	e.appendChild(eClose);

	eClose.addEventListener("click", event => 
	{
		console.debug("clicked deselect button");
		event.stopPropagation();
		self.Action("DoSmallScreen", rowIndex(e));

	});

	const eOverlay = document.createElement("div");
	e.appendChild(eOverlay);

	setupOverlay.call(this, eOverlay);

	function setupOverlay(eOverlay)
	{
		eOverlay.classList.add("deactive_overlay");
		const self = this;
		eOverlay.addEventListener("click", event =>
		{
			console.debug("clicked overlay");
			event.stopPropagation();
			self.Action("DoSelect", rowIndex(e));
		});

		eOverlay.addEventListener("dblclick", event =>
		{
			console.debug("DOUBLE clicked while active");
			event.stopPropagation();
			self.Action("DoFullScreen", rowIndex(e));
		});
	}

	e.addEventListener("click", event =>
	{
		console.debug("clicked while active", event.target);
		self.DoNext();
	});


	e.addEventListener("dragstart", function (event)
	{
		//console.debug("dragstart", event.target);

		if (e.classList.contains(KONST.fullscreen))
			event.preventDefault();
		else
		{
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData(KONST.DRAGON_DROP_MIME_TYPE, rowIndex(e));
		}
	});

	e.addEventListener("dragover", function (event)
	{
		if (event.dataTransfer.types.includes(KONST.DRAGON_DROP_MIME_TYPE))
		{
			e.classList.add(KONST.pele_dragover);
			event.preventDefault();
		}
	});

	e.addEventListener("dragleave", function (event)
	{
		e.classList.remove(KONST.pele_dragover);
	});


	e.addEventListener("drop", function (event)
	{
		e.classList.remove(KONST.pele_dragover);

		const originalrow = event.dataTransfer.getData(KONST.DRAGON_DROP_MIME_TYPE);
		if (originalrow !== undefined)
		{
			const row_index = rowIndex(e);
			if (originalrow != row_index)
			{
				console.debug("move successful", originalrow, row_index);
				self.Action("MoveRow", originalrow, row_index);
			}
			event.preventDefault();
		}
	});

	e.addEventListener("dragend", function (event)
	{
		//	event.preventDefault();
	});

	this.eList.appendChild(e);

	return e;
}

function rowIndex(row)
{
	return [...row.parentNode.children].indexOf(row);
}


function doNext()
{
	const e = this.selecteditem ? this.selecteditem.nextElementSibling : this.eList.firstElementChild;

	doselect.call(this, e);
}

function doPrevious()
{
	const e = this.selecteditem ? this.selecteditem.previousElementSibling : this.eList.lastElementChild;
	doselect.call(this, e);
}

function doSome()
{
	if (this.selecteditem)
	{
		const index = rowIndex(this.selecteditem);

		if (this.selecteditem.classList.contains(KONST.fullscreen))
			doSmallScreenIndex.call(this, index);
		else
			doFullScreenIndex.call(this, index);
	}
}


function doDelete()
{
	if (this.selecteditem)
	{
		doNext.call(this);

		if (this.selecteditem)
			this.selecteditem.parentElement.removeChild(this.selecteditem);
	}


}

function doFullScreenIndex(i)
{
	gofullscreen.call(this, this.eList.children[i]);
}

function doSmallScreenIndex(i)
{
	gosmallscreen.call(this, this.eList.children[i]);
}


function deselectSlide(e)
{
	if (e)
	{
		e.classList.remove(KONST.activated);
		e.classList.remove(KONST.fullscreen);
		this.selecteditem = null;
	}
}

function doselect(e)
{
	const fSame = e == this.selecteditem;

	if (!fSame && e)
	{
		const isFullscreen = this.selecteditem && this.selecteditem.classList.contains(KONST.fullscreen);
		deselectSlide.call(this, this.selecteditem);

		e.classList.add(KONST.activated);
		if (isFullscreen)
			e.classList.add(KONST.fullscreen);
		this.selecteditem = e;
	}
}

function doSelectIndex(i)
{
	doselect.call(this, this.eList.children[i]);
}


function gofullscreen(e)
{
	if (e)
	{
		e.classList.add(KONST.fullscreen);
		document.body.classList.add(KONST.slideactive);

	}
}


function doMoveRow(from, to)
{
	const eFrom = this.eList.children[from];
	const eTo = this.eList.children[to];

	if (eFrom && eTo)
		this.eList.insertBefore(eFrom, eTo);
}

function gosmallscreen(e)
{
	if (e)
	{
		document.body.classList.remove(KONST.slideactive);
		e.classList.remove(KONST.fullscreen);
	}
}

