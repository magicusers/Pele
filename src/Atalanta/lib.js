import { removeElement, extractTemplateElement, elementMatches, elementClosest, createElementFromHTML } from '../BatLass/elementary';


/*
	Thank you TogetherJS
*/

function isIgnorableElement(el)
{
	try
	{
		return el.classList.contains("Aταλάντη-ignorable");
		//return el.className.indexOf("Aταλάντη") >= 0;
	}
	catch (ex)
	{
	}
}

function jqoffset(elem, docElem)
{
	const box = elem.getBoundingClientRect();

	docElem = docElem || elem.parentElement;

	return {
		top: box.top + (docElem.scrollTop) - (docElem.clientTop || 0),
		left: box.left + (docElem.scrollLeft) - (docElem.clientLeft || 0),
		H: box.height,
		W: box.width
	};
}

function hashFnv32a(str, asString, seed)
{
	/*jshint bitwise:false */
	var i, l,
		hval = (seed === undefined) ? 0x811c9dc5 : seed;

	for (i = 0, l = str.length; i < l; i++)
	{
		hval ^= str.charCodeAt(i);
		hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
	}
	if (asString)
	{
		// Convert to 8 digit hex string
		return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
	}
	return hval >>> 0;
}

class CannotFind
{
	constructor(location, reason, context)
	{
		this.prefix = "";
		this.location = location;
		this.reason = reason;
		this.context = context;
	}

	toString()
	{
		var loc;
		try
		{
			loc = ElementAddress(this.context);
		} catch (e)
		{
			loc = this.context;
		}
		return (
			"[CannotFind " + this.prefix +
			"(" + this.location + "): " +
			this.reason + " in " +
			loc + "]");
	}
};

function get_line_intersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y)
{
	const s1_x = p1_x - p0_x;
	const s1_y = p1_y - p0_y;
	const s2_x = p3_x - p2_x;
	const s2_y = p3_y - p2_y;

    
    const s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        return [p0_x + (t * s1_x), p0_y + (t * s1_y)];
    }
}

function ElementAddress(el)
{
	console.assert(el !== null, "Got null element");
	if (el.id)
	{
		return "#" + el.id;
	}
	if (el.tagName == "BODY")
	{
		return "body";
	}
	if (el.tagName == "HEAD")
	{
		return "head";
	}
	if (el === document)
	{
		return "document";
	}
	var parent = el.parentNode;
	if ((!parent) || parent == el)
	{
		console.warn("ElementAddress(", el, ") has null parent");
		throw new Error("No locatable parent found");
	}

	var parentLocation = ElementAddress(parent);
	var children = parent.childNodes;
	var _len = children.length;
	var index = 0;
	for (var i = 0; i < _len; i++)
	{
		if (children[i] == el)
		{
			break;
		}
		if (children[i].nodeType == document.ELEMENT_NODE)
		{
			if (isIgnorableElement(children[i]))
			{
				// Don't count our UI
				continue;
			}
			// Don't count text or comments
			index++;
		}
	}
	return parentLocation + "," + (index + 1);
};


function IgnoreElement(el)
{
	while (el)
	{
		if (isIgnorableElement(el))
		{
			return true;
		}
		el = el.parentNode;
	}
	return false;
};


function FindElementAddress(path)
{
	// FIXME: should this all just be done with document.querySelector()?
	// But no!  We can't ignore togetherjs elements with querySelector.
	// But maybe!  We *could* make togetherjs elements less obtrusive?
	let container = document;
	const rg = path.split(",");

	switch (rg[0])
	{
		case "body":
			container = document.body;
			break;

		case "head":
			container = document.head;
			break;

		case "document":
			container = document;
			break;

		default:
			container = document.getElementById(rg[0].substr(1));
			break;
	}

	if (container)
	{
		if (rg.length == 1)
			return container;

		let el = null;
		for (let iElem = 1; iElem < rg.length; ++iElem)
		{
			const num = parseInt(rg[iElem], 10);
			let count = num;
			let children = container.childNodes;
			for (var i = 0; i < children.length; ++i)
			{
				var child = children[i];
				if (child.nodeType == document.ELEMENT_NODE)
				{
					if (isIgnorableElement(child))
					{
						continue;
					}
					count--;
					if (count === 0)
					{
						// this is the element
						el = child;
						break;
					}
				}
			}

			if (!el)
			{
				throw new CannotFind(":nth-child(" + num + ")", "container only has " + (num - count) + " elements", container);
			}

			container = el;
		}

		if (el)
			return el;
	}

	throw new CannotFind(path, "Malformed location", container);
};

function isInvisible(el)
{
	const s = window.getComputedStyle(e);
	return (s.display === 'none' || s.visibility === "hidden");
}

function ElementByPixel(height)
{
	/* Returns {location: "...", offset: pixels}
	
	   To get the pixel position back, you'd do:
		 $(location).offset().top + offset
	 */
	function search(start, height)
	{
		var last = null;
		var children = start.children();
		children.each(function (el)
		{
			if (isIgnorableElement(el) || el.style.position == "fixed" || isInvisible(el))
			{
				return;
			}
			if (el.offsetTop > height)
			{
				return false;
			}
			last = el;
		});
		if ((!children.length) || (!last))
		{
			// There are no children, or only inapplicable children
			return {
				location: ElementAddress(start),
				offset: height - start.offsetTop,
				absoluteTop: height,
				documentHeight: document.offsetHeight
			};
		}
		return search(last, height);
	}
	return search(document.body, height);
};


function PixelForPosition(position)
{
	/* Inverse of elementFinder.elementByPixel */
	if (position.location == "body")
	{
		return position.offset;
	}
	var el;
	try
	{
		el = FindElementAddress(position.location);
	} catch (e)
	{
		if (e instanceof CannotFind && position.absoluteTop)
		{
			// We don't trust absoluteTop to be quite right locally, so we adjust
			// for the total document height differences:
			var percent = position.absoluteTop / position.documentHeight;
			return document.offsetHeight * percent;
		}
		throw e;
	}
	var top = el.offsetTop;
	// FIXME: maybe here we should test for sanity, like if an element is
	// hidden.  We can use position.absoluteTop to get a sense of where the
	// element roughly should be.  If the sanity check failed we'd use
	// absoluteTop
	return top + position.offset;
};



const cursorTemplate = `
<div class="Aταλάντη-cursor Aταλάντη Aταλάντη-ignorable">
<!-- Note: images/cursor.svg is a copy of this (for editing): -->
<!-- crossbrowser svg dropshadow http://demosthenes.info/blog/600/Creating-a-True-CrossBrowser-Drop-Shadow- -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="15px" height="22.838px" viewBox="96.344 146.692 15 22.838" enable-background="new 96.344 146.692 15 22.838"
	 xml:space="preserve">
<path fill="#231F20" d="m 98.984,146.692 c 1.61561,1.19132 1.66967,3.36108 2.30096,5.10001 0.28043,0.7813 0.59089,1.8632 1.53689,2.01178 0.72322,-0.33708 1.54083,-0.50377 2.32914,-0.18547 0.73775,0.24911 1.5217,0.4209 2.29234,0.29422 1.53022,0.34165 2.4145,1.89027 2.79483,3.29915 0.49387,2.09092 -0.19861,4.19867 -0.72905,6.20916 0.55113,0.76664 2.42981,1.20534 1.23551,2.37094 -1.41795,2.42962 -4.41354,4.00979 -7.21564,3.29534 -1.25841,-0.12361 -2.03236,-1.19354 -1.94693,-2.40271 -0.37389,-1.39176 -1.735424,-2.09767 -2.677405,-3.06552 -1.381978,-1.20656 -2.747836,-2.84897 -2.532353,-4.80881 -0.06582,-1.07202 1.069236,-2.82053 2.140687,-1.62992 0.286101,0.42388 1.224397,0.80852 0.669128,-0.0282 -0.986107,-2.38799 -2.398539,-4.66734 -2.755432,-7.26523 -0.208873,-1.18484 0.327997,-2.51056 1.496125,-2.97364 0.333172,-0.14664 0.697247,-0.22261 1.0612,-0.22112 z"/>
</svg>

<div class="Aταλάντη-cursor-container">
  <div class="Aταλάντη-cursor-name"></div>
  <span style="display:none" class="Aταλάντη-cursor-typing" id="Aταλάντη-cursor-typebox">
	<span class="Aταλάντη-typing-ellipse-one">&#9679;</span><span class="Aταλάντη-typing-ellipse-two">&#9679;</span><span class="Aταλάντη-typing-ellipse-three">&#9679;</span>
  </span>

  <!--
  <div class="Aταλάντη-cursor-menu">
  <button class="Aταλάντη-cursor-menu-button-Goto">Goto</button>
  <button class="Aταλάντη-cursor-menu-button-Info">Info</button>
  </div>
  -->

  <!-- Displayed when the cursor is below the screen: -->
  <span class="Aταλάντη-cursor-down">

  </span>
  <!-- Displayed when the cursor is above the screen: -->
  <span class="Aταλάντη-cursor-up">

  </span>
</div>
</div>
`;

const clickTemplate = `
<div class="Aταλάντη-click Aταλάντη">
</div>
`;
var FOREGROUND_COLORS = ["#111", "#eee"];
var CURSOR_HEIGHT = 50;
var CURSOR_ANGLE = (35 / 180) * Math.PI;
var CURSOR_WIDTH = Math.ceil(Math.sin(CURSOR_ANGLE) * CURSOR_HEIGHT);
// Number of milliseconds after page load in which a scroll-update
// related hello-back message will be processed:
var SCROLL_UPDATE_CUTOFF = 2000;
/*
session.hub.on("cursor-update", function (msg)
{
	if (msg.sameUrl)
	{
		Cursor.getClient(msg.clientId).updatePosition(msg);
	} else
	{
		// FIXME: This should be caught even before the cursor-update message,
		// when the peer goes to another URL
		Cursor.getClient(msg.clientId).hideOtherUrl();
	}
});
*/


function User2Peer(u)
{
	const hue = Math.abs(hashFnv32a(u.id)) % 360;
	const sat = Aθεος.Aφαία.GetRandomInt(80, 100);
	const lit = Aθεος.Aφαία.GetRandomInt(40, 60);

	return {
		...u
		, color: 'hsl(' + hue + "," + sat + "%," + lit + "%)"
		, textcolor: 'hsl(' + ((hue + 180) % 360) + "," + sat + "%," + lit + "%)"
	};
}

const KEEPALIVE_PERIOD_MS = (5 * 1000);

// FIXME: should check for a peer leaving and remove the cursor object
export class Cursor
{
	static FromChild(element)
	{
		const e = elementClosest(element, ".Aταλάντη-cursor");
		if (e)
			return e.getAttribute("data-client-id");
	}

	static get Container()
	{
		return document.querySelector(".Aταλάντη-Container") || document.body;
	}

	constructor(clientId) 
	{
		this.clientId = clientId;
		this.element = createElementFromHTML(cursorTemplate);
		this.elementClass = "Aταλάντη-scrolled-normal";
		this.element.classList.add(this.elementClass);
		this.element.setAttribute("data-client-id", clientId);
		//		this.updatePeer(peers.getPeer(clientId));
		this.updatePeer(User2Peer(world.coven.User(clientId)));

		this.lastTop = this.lastLeft = null;

		Cursor.Container.appendChild(this.element);
		//this.element.animateCursorEntry();
		this.keydownTimeout = null;
		this.clearKeydown = this.clearKeydown.bind(this);
		this.atOtherUrl = false;

		this.Keepalive();
	}

	scrollTo()
	{
		console.debug("scrollTo", 	this.lastTop, this.lastLeft);
		//document.querySelector(".interactContainer").scrollTo(this.lastLeft, this.lastTop);

		const container = this.element.parentElement;

		const r = container.getBoundingClientRect();
		
		container.scrollTo(this.lastLeft - r.width/2, this.lastTop - r.height/2);
	}

	Keepalive()
	{
		this.lasttick = Date.now();
	}

	TickTock()
	{
		if ((Date.now() - this.lasttick) > KEEPALIVE_PERIOD_MS * 1.2)
			this.element.classList.add("Aταλάντη-notalive");
		else
			this.element.classList.remove("Aταλάντη-notalive");

	}
	// How long after receiving a setKeydown call that we should show the
	// user typing.  This should be more than MIN_KEYDOWN_TIME:
	//    KEYDOWN_WAIT_TIME: 2000,

	updatePeer(peer)
	{
		// FIXME: can I use peer.setElement()?
		this.element.style.color = peer.color;

		var name = this.element.querySelector(".Aταλάντη-cursor-name");
		var nameContainer = this.element.querySelector(".Aταλάντη-cursor-container");
		console.assert(name);
		name.innerText = peer.name;

		nameContainer.style.backgroundColor = peer.color;
		//nameContainer.style.color= tinycolor.mostReadable(peer.color, FOREGROUND_COLORS)
		nameContainer.style.color = peer.textcolor;

		var path = this.element.querySelector("svg path");
		path.setAttribute("fill", peer.color);
		path.setAttribute("stroke", peer.textcolor);

		this.peer = peer;
		/*
		// FIXME: should I just remove the element?
		if (peer.status != "live")
		{
			//this.element.hide();
			this.element.querySelector("svg").animate({
				opacity: 0
			}, 350);
			this.element.querySelector(".Aταλάντη-cursor-container").animate({
				width: 34,
				height: 20,
				padding: 12,
				margin: 0
			}, 200).animate({
				width: 0,
				height: 0,
				padding: 0,
				opacity: 0
			}, 200);
		} else
		{
			//this.element.show();
			this.element.animate({
				opacity: 0.3
			}).animate({
				opacity: 1
			});
		}
		*/
	}

	setClass(name)
	{
		if (!this.element.classList.contains(name))
		{
			this.element.classList.remove(this.elementClass);
			this.element.classList.add(name);
			this.elementClass = name;
		}
	}

	updatePosition(pos)
	{
		var top, left;
		if (this.atOtherUrl)
		{
			this.element.show();
			this.atOtherUrl = false;
		}
		if (pos.fullpath)
		{
			//var target = FindElement(pos.element);
			const target = FindElementAddress(pos.fullpath);
			//console.assert(haha === target);
			const offset = jqoffset(target);
			top = offset.top + (pos.offsetY * offset.H / pos.H);
			left = offset.left + (pos.offsetX * offset.W / pos.W);
		}
		else
		{
			// No anchor, just an absolute position
			top = pos.top;
			left = pos.left;
		}
		const container = this.element.parentElement;
		top += container.scrollTop;
		left += container.scrollLeft;


		// These are saved for use by .refresh():
		this.lastTop = top;
		this.lastLeft = left;
		this.setPosition(top, left);
	}

	hideOtherUrl()
	{
		if (this.atOtherUrl)
		{
			return;
		}
		this.atOtherUrl = true;
		// FIXME: should show away status better:
		this.element.hide();
	}

	setPosition(top, left) 
	{
		const container = this.element.parentElement;
		const r = container.getBoundingClientRect();

		const wTop = container.scrollTop;// window.scrollY;		
		const height = container.clientHeight;// document.documentElement.clientHeight;
		
		//console.debug(top, left, wTop, height, r, container);

		top -= r.top ;
		left -= r.left;


		const rC = this.element.getBoundingClientRect();

		const x0 = container.scrollLeft + rC.width;
		const y0 = container.scrollTop+ rC.height;
		const x1 = x0 + container.clientWidth  - 2*rC.width;
		const y1 = y0 + container.clientHeight - 2*rC.height;

		const cx = (x0 + x1)/2;
		const cy = (y0+y1)/2;

		const intersectionTop = get_line_intersection(x0, y0, x1, y0, left, top, cx, cy);
		const intersectionBottom = get_line_intersection(x0, y1, x1, y1, left, top, cx, cy);
		const intersectionLeft = get_line_intersection(x0, y0, x0, y1, left, top, cx, cy);
		const intersectionRight = get_line_intersection(x1, y0, x1, y1, left, top, cx, cy);

		//console.debug("intersection:", intersectionLeft, intersectionTop, intersectionRight, intersectionBottom);
		const inter = intersectionLeft|| intersectionTop|| intersectionRight|| intersectionBottom;

		if (inter)
		{
			left = inter[0];
			top = inter[1];

			const angle = -Math.atan2(cx-left, cy-top);
			//console.debug("angle:", angle);
			
			this.element.style.transform = "rotate("+angle+"rad)";
			this.element.querySelector(".Aταλάντη-cursor-container").style.transform = "rotate("+ -angle+"rad)";
			this.setClass("Aταλάντη-scrolled-outofrange");
		}
		else
		{
			this.element.style.transform = null;
			this.element.querySelector(".Aταλάντη-cursor-container").style.transform = null;
			this.setClass("Aταλάντη-scrolled-normal");
		}
/*
	
		if (top < wTop)
		{
			// FIXME: this is a totally arbitrary number, but is meant to be big enough
			// to keep the cursor name from being off the top of the screen.
			top = 25;
			this.setClass("Aταλάντη-scrolled-above");
		} else if (top > wTop + height - CURSOR_HEIGHT)
		{
			top = height - CURSOR_HEIGHT - 5;
			this.setClass("Aταλάντη-scrolled-below");
		} else
		{
			this.setClass("Aταλάντη-scrolled-normal");
		}
*/
		
		this.element.style.top = top + 'px';
		this.element.style.left = left + 'px';
	}

	refresh()
	{
		if (this.lastTop !== null)
		{
			this.setPosition(this.lastTop, this.lastLeft);
		}
	}

	setKeydown()
	{
		if (this.keydownTimeout)
		{
			clearTimeout(this.keydownTimeout);
		} else
		{
			this.element.find(".Aταλάντη-cursor-typing").show().animateKeyboard();
		}
		this.keydownTimeout = setTimeout(this.clearKeydown, this.KEYDOWN_WAIT_TIME);
	}

	clearKeydown()
	{
		this.keydownTimeout = null;
		this.element.find(".Aταλάντη-cursor-typing").hide().stopKeyboardAnimation();
	}

	_destroy()
	{
		this.element.remove();
		this.element = null;
	}
};

Cursor._cursors = {};

//cursor.getClient = 
Cursor.getClient = function (clientId)
{
	const user = world.coven.User(clientId);
	if (user)
	{
		var c = Cursor._cursors[clientId];
		if (!c)
		{
			c = Cursor._cursors[clientId] = new Cursor(clientId);
		}
		return c;
	}
};

Cursor.forEach = function (callback, context)
{
	context = context || null;
	for (var a in Cursor._cursors)
	{
		if (Cursor._cursors.hasOwnProperty(a))
		{
			callback.call(context, Cursor._cursors[a], a);
		}
	}
};

Cursor.destroy = function (clientId)
{
	Cursor._cursors[clientId]._destroy();
	delete Cursor._cursors[clientId];
};

var world;

Promise.all([Aθεος.Αφροδίτη.UserWorldCreated(), Aθεος.Aφαία.OnReady()]).then(([w]) =>
{
	world = w;

	if (!world.Server)
		return;

	var lastTime = 0;
	var MIN_TIME = 100;
	var lastPosX = -1;
	var lastPosY = -1;
	var lastMessage = null;

	const patch_MouseMove = world.Server.PatchVolatile(function (envelope, msg)
	{

		//console.debug(envelope, msg);
		if (envelope)
		{
			const cursor = Cursor.getClient(envelope.sender);
			if (cursor)
				cursor.updatePosition(msg);
		}
	});

	const patch_Keepalive = world.Server.PatchVolatile(function (envelope, msg)
	{
		if (envelope)
		{
			const cursor = Cursor.getClient(envelope.sender);
			if (cursor)
				cursor.Keepalive(msg);
		}
	});

	setInterval(function ()
	{
		patch_Keepalive();
		Cursor.forEach(cursor =>
		{
			if (cursor)
				cursor.TickTock();
		});
	}, KEEPALIVE_PERIOD_MS);


	const SCROLL_UPDATE_INTERVAL = 200;
	const patch_Scroll = world.Server.PatchVolatile(function (envelope, l, t)
	{
		if (envelope)
		{
			const cursor = Cursor.getClient(envelope.sender);
			console.debug("remtoe scroll", l, t);
			if (cursor)
				;//cursor.Keepalive(msg);
		}
	});

	Cursor.Container.addEventListener("scroll", _.debounce(event=>{
		const t = event.target;
		console.debug("scroll", t.scrollLeft, t.scrollTop, t);

		Cursor.forEach((c) =>{
			c.refresh();
		  });

		//patch_Scroll(t.scrollLeft, t.scrollTop);
	}, SCROLL_UPDATE_INTERVAL));


	document.body.addEventListener("mousemove", function (event)
	{
		const MINIMUM_MOVEMENT_THRESHOLD = 0;

		var now = Date.now();
		if (now - lastTime < MIN_TIME)
		{
			return;
		}
		lastTime = now;
		var pageX = event.pageX;
		var pageY = event.pageY;
		if (Math.abs(lastPosX - pageX) < MINIMUM_MOVEMENT_THRESHOLD && Math.abs(lastPosY - pageY) < MINIMUM_MOVEMENT_THRESHOLD)
		{
			// Not a substantial enough change
			return;
		}
		lastPosX = pageX;
		lastPosY = pageY;
		var target = event.target;
		if (IgnoreElement(target))
		{
			target = null;
		}

		if ((!target) || target == document.documentElement || target == document.body)
		{
			lastMessage = {
				top: pageY,
				left: pageX
			};
			patch_MouseMove(lastMessage);
			return;
		}

		const offset = jqoffset(target);

		var offsetX = pageX - offset.left;
		var offsetY = pageY - offset.top;
		lastMessage = {
			fullpath: ElementAddress(target),
			offsetX: Math.floor(offsetX),
			offsetY: Math.floor(offsetY),
			W: offset.W,
			H: offset.H
		};
		patch_MouseMove(lastMessage);
	});

	const patch_Click = world.Server.PatchVolatile(function (envelope, pos)
	{

		console.debug(envelope, pos);
		if (envelope)
		{

			// When the click is calculated isn't always the same as how the
			// last cursor update was calculated, so we force the cursor to
			// the last location during a click:
			const cursor = Cursor.getClient(envelope.sender);
			if (cursor)
			{
				cursor.updatePosition(pos);

				//var target = FindElement(pos.element);
				const target = FindElementAddress(pos.fullpath);
				//console.assert(haha === target);

				var offset = jqoffset(target);
				var top = offset.top + (pos.offsetY * offset.H / pos.H);
				var left = offset.left + (pos.offsetX * offset.W / pos.W);
				displayClick({
					top: top,
					left: left,
					W: offset.W,
					H: offset.H
				}, cursor.peer.color);
			}
		}
	}
	);

	document.addEventListener("click", documentClick, true);

	function documentClick(event)
	{
		// FIXME: this might just be my imagination, but somehow I just
		// really don't want to do anything at this stage of the event
		// handling (since I'm catching every click), and I'll just do
		// something real soon:
		setTimeout(function ()
		{
			try
			{
				var element = event.target;
				if (element == document.documentElement)
				{
					// For some reason clicking on <body> gives the <html> element here
					element = document.body;
				}
				if (IgnoreElement(element))
				{
					//console.debug("ignore click", element);
					const cursor =Cursor.getClient( Cursor.FromChild(element));
					if (cursor)
					{
						console.debug("curse her", cursor);	
						cursor.scrollTo();
					}

					return;
				}

				var offset = jqoffset(element);
				var offsetX = event.pageX - offset.left;
				var offsetY = event.pageY - offset.top;

				patch_Click({
					//element: location,
					fullpath: ElementAddress(element),
					offsetX: offsetX,
					offsetY: offsetY,
					W: offset.W,
					H: offset.H
				});
			}
			catch(err)
			{
				
			}

		});
	}

	var CLICK_TRANSITION_TIME = 3000;

	function displayClick(pos, color)
	{
		// FIXME: should we hide the local click if no one else is going to see it?
		// That means tracking who might be able to see our screen.
		const element = createElementFromHTML(clickTemplate);
		document.body.appendChild(element);

		element.style.top = pos.top + "px";
		element.style.left = pos.left + "px";
		element.style.borderColor = color;

		function removeelement()
		{
			if (element.parentElement)
				element.parentElement.removeChild(element);
		}

		setTimeout(function ()
		{
			element.classList.add("Aταλάντη-clicking");
			element.addEventListener("transitionend", removeelement);
		}, 50);


		setTimeout(removeelement, CLICK_TRANSITION_TIME);
	}
});

