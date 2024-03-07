!function(){"use strict";var e={460:function(e,t,n){function r(e){var t=document.createElement("div");return t.innerHTML=e,t.firstElementChild}function o(e,t){var n=Element.prototype;return(n.matches||n.matchesSelector||n.webkitMatchesSelector||n.mozMatchesSelector||n.msMatchesSelector||n.oMatchesSelector).call(e,t)}function i(e,t){if(window.Element&&!Element.prototype.closest){for(var n=o(e,t);!n&&e&&e!==document;)n=(e=e.parentNode)&&e!==document&&o(e,t);return e&&e!==document?e:null}return e.closest(t)}n.d(t,{SL:function(){return r},YA:function(){return i}})}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t(e)}function r(e){var n=function(e,n){if("object"!=t(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==t(n)?n:String(n)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,r(o.key),o)}}function l(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}var s=n(460);function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){var o,i,l;o=e,i=t,l=n[t],(i=r(i))in o?Object.defineProperty(o,i,{value:l,enumerable:!0,configurable:!0,writable:!0}):o[i]=l})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e){try{return e.classList.contains("Aταλάντη-ignorable")}catch(e){}}function f(e,t){var n=e.getBoundingClientRect();return t=t||e.parentElement,{top:n.top+t.scrollTop-(t.clientTop||0),left:n.left+t.scrollLeft-(t.clientLeft||0),H:n.height,W:n.width}}var h=function(){function e(t,n,r){o(this,e),this.prefix="",this.location=t,this.reason=n,this.context=r}return l(e,[{key:"toString",value:function(){var e;try{e=p(this.context)}catch(t){e=this.context}return"[CannotFind "+this.prefix+"("+this.location+"): "+this.reason+" in "+e+"]"}}]),e}();function d(e,t,n,r,o,i,l,s){var a=n-e,c=r-t,u=l-o,f=s-i,h=(-c*(e-o)+a*(t-i))/(-u*c+a*f),d=(u*(t-i)-f*(e-o))/(-u*c+a*f);if(h>=0&&h<=1&&d>=0&&d<=1)return[e+d*a,t+d*c]}function p(e){if(console.assert(null!==e,"Got null element"),e.id)return"#"+e.id;if("BODY"==e.tagName)return"body";if("HEAD"==e.tagName)return"head";if(e===document)return"document";var t=e.parentNode;if(!t||t==e)throw console.warn("ElementAddress(",e,") has null parent"),new Error("No locatable parent found");for(var n=p(t),r=t.childNodes,o=r.length,i=0,l=0;l<o&&r[l]!=e;l++)if(r[l].nodeType==document.ELEMENT_NODE){if(u(r[l]))continue;i++}return n+","+(i+1)}function m(e){for(;e;){if(u(e))return!0;e=e.parentNode}return!1}function v(e){var t=document,n=e.split(",");switch(n[0]){case"body":t=document.body;break;case"head":t=document.head;break;case"document":t=document;break;default:t=document.getElementById(n[0].substr(1))}if(t){if(1==n.length)return t;for(var r=null,o=1;o<n.length;++o){for(var i=parseInt(n[o],10),l=i,s=t.childNodes,a=0;a<s.length;++a){var c=s[a];if(c.nodeType==document.ELEMENT_NODE){if(u(c))continue;if(0==--l){r=c;break}}}if(!r)throw new h(":nth-child("+i+")","container only has "+(i-l)+" elements",t);t=r}if(r)return r}throw new h(e,"Malformed location",t)}var y=35/180*Math.PI;Math.ceil(50*Math.sin(y));var b,g=function(){function e(t){var n,r,i,l;o(this,e),this.clientId=t,this.element=(0,s.SL)('\n<div class="Aταλάντη-cursor Aταλάντη Aταλάντη-ignorable">\n\x3c!-- Note: images/cursor.svg is a copy of this (for editing): --\x3e\n\x3c!-- crossbrowser svg dropshadow http://demosthenes.info/blog/600/Creating-a-True-CrossBrowser-Drop-Shadow- --\x3e\n<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t width="15px" height="22.838px" viewBox="96.344 146.692 15 22.838" enable-background="new 96.344 146.692 15 22.838"\n\t xml:space="preserve">\n<path fill="#231F20" d="m 98.984,146.692 c 1.61561,1.19132 1.66967,3.36108 2.30096,5.10001 0.28043,0.7813 0.59089,1.8632 1.53689,2.01178 0.72322,-0.33708 1.54083,-0.50377 2.32914,-0.18547 0.73775,0.24911 1.5217,0.4209 2.29234,0.29422 1.53022,0.34165 2.4145,1.89027 2.79483,3.29915 0.49387,2.09092 -0.19861,4.19867 -0.72905,6.20916 0.55113,0.76664 2.42981,1.20534 1.23551,2.37094 -1.41795,2.42962 -4.41354,4.00979 -7.21564,3.29534 -1.25841,-0.12361 -2.03236,-1.19354 -1.94693,-2.40271 -0.37389,-1.39176 -1.735424,-2.09767 -2.677405,-3.06552 -1.381978,-1.20656 -2.747836,-2.84897 -2.532353,-4.80881 -0.06582,-1.07202 1.069236,-2.82053 2.140687,-1.62992 0.286101,0.42388 1.224397,0.80852 0.669128,-0.0282 -0.986107,-2.38799 -2.398539,-4.66734 -2.755432,-7.26523 -0.208873,-1.18484 0.327997,-2.51056 1.496125,-2.97364 0.333172,-0.14664 0.697247,-0.22261 1.0612,-0.22112 z"/>\n</svg>\n\n<div class="Aταλάντη-cursor-container">\n  <div class="Aταλάντη-cursor-name"></div>\n  <span style="display:none" class="Aταλάντη-cursor-typing" id="Aταλάντη-cursor-typebox">\n\t<span class="Aταλάντη-typing-ellipse-one">&#9679;</span><span class="Aταλάντη-typing-ellipse-two">&#9679;</span><span class="Aταλάντη-typing-ellipse-three">&#9679;</span>\n  </span>\n\n  \x3c!--\n  <div class="Aταλάντη-cursor-menu">\n  <button class="Aταλάντη-cursor-menu-button-Goto">Goto</button>\n  <button class="Aταλάντη-cursor-menu-button-Info">Info</button>\n  </div>\n  --\x3e\n\n  \x3c!-- Displayed when the cursor is below the screen: --\x3e\n  <span class="Aταλάντη-cursor-down">\n\n  </span>\n  \x3c!-- Displayed when the cursor is above the screen: --\x3e\n  <span class="Aταλάντη-cursor-up">\n\n  </span>\n</div>\n</div>\n'),this.elementClass="Aταλάντη-scrolled-normal",this.element.classList.add(this.elementClass),this.element.setAttribute("data-client-id",t),this.updatePeer((n=b.coven.User(t),r=Math.abs(function(e,t,n){var r,o,i=2166136261;for(r=0,o=e.length;r<o;r++)i^=e.charCodeAt(r),i+=(i<<1)+(i<<4)+(i<<7)+(i<<8)+(i<<24);return i>>>0}(n.id))%360,i=Aθεος.Aφαία.GetRandomInt(80,100),l=Aθεος.Aφαία.GetRandomInt(40,60),c(c({},n),{},{color:"hsl("+r+","+i+"%,"+l+"%)",textcolor:"hsl("+(r+180)%360+","+i+"%,"+l+"%)"}))),this.lastTop=this.lastLeft=null,e.Container.appendChild(this.element),this.keydownTimeout=null,this.clearKeydown=this.clearKeydown.bind(this),this.atOtherUrl=!1,this.Keepalive()}return l(e,[{key:"scrollTo",value:function(){console.debug("scrollTo",this.lastTop,this.lastLeft);var e=this.element.parentElement,t=e.getBoundingClientRect();e.scrollTo(this.lastLeft-t.width/2,this.lastTop-t.height/2)}},{key:"Keepalive",value:function(){this.lasttick=Date.now()}},{key:"TickTock",value:function(){Date.now()-this.lasttick>6e3?this.element.classList.add("Aταλάντη-notalive"):this.element.classList.remove("Aταλάντη-notalive")}},{key:"updatePeer",value:function(e){this.element.style.color=e.color;var t=this.element.querySelector(".Aταλάντη-cursor-name"),n=this.element.querySelector(".Aταλάντη-cursor-container");console.assert(t),t.innerText=e.name,n.style.backgroundColor=e.color,n.style.color=e.textcolor;var r=this.element.querySelector("svg path");r.setAttribute("fill",e.color),r.setAttribute("stroke",e.textcolor),this.peer=e}},{key:"setClass",value:function(e){this.element.classList.contains(e)||(this.element.classList.remove(this.elementClass),this.element.classList.add(e),this.elementClass=e)}},{key:"updatePosition",value:function(e){var t,n;if(this.atOtherUrl&&(this.element.show(),this.atOtherUrl=!1),e.fullpath){var r=f(v(e.fullpath));t=r.top+e.offsetY*r.H/e.H,n=r.left+e.offsetX*r.W/e.W}else t=e.top,n=e.left;var o=this.element.parentElement;t+=o.scrollTop,n+=o.scrollLeft,this.lastTop=t,this.lastLeft=n,this.setPosition(t,n)}},{key:"hideOtherUrl",value:function(){this.atOtherUrl||(this.atOtherUrl=!0,this.element.hide())}},{key:"setPosition",value:function(e,t){var n=this.element.parentElement,r=n.getBoundingClientRect();n.scrollTop,n.clientHeight,e-=r.top,t-=r.left;var o=this.element.getBoundingClientRect(),i=n.scrollLeft+o.width,l=n.scrollTop+o.height,s=i+n.clientWidth-2*o.width,a=l+n.clientHeight-2*o.height,c=(i+s)/2,u=(l+a)/2,f=d(i,l,s,l,t,e,c,u),h=d(i,a,s,a,t,e,c,u),p=d(i,l,i,a,t,e,c,u),m=d(s,l,s,a,t,e,c,u),v=p||f||m||h;if(v){t=v[0],e=v[1];var y=-Math.atan2(c-t,u-e);this.element.style.transform="rotate("+y+"rad)",this.element.querySelector(".Aταλάντη-cursor-container").style.transform="rotate("+-y+"rad)",this.setClass("Aταλάντη-scrolled-outofrange")}else this.element.style.transform=null,this.element.querySelector(".Aταλάντη-cursor-container").style.transform=null,this.setClass("Aταλάντη-scrolled-normal");this.element.style.top=e+"px",this.element.style.left=t+"px"}},{key:"refresh",value:function(){null!==this.lastTop&&this.setPosition(this.lastTop,this.lastLeft)}},{key:"setKeydown",value:function(){this.keydownTimeout?clearTimeout(this.keydownTimeout):this.element.find(".Aταλάντη-cursor-typing").show().animateKeyboard(),this.keydownTimeout=setTimeout(this.clearKeydown,this.KEYDOWN_WAIT_TIME)}},{key:"clearKeydown",value:function(){this.keydownTimeout=null,this.element.find(".Aταλάντη-cursor-typing").hide().stopKeyboardAnimation()}},{key:"_destroy",value:function(){this.element.remove(),this.element=null}}],[{key:"FromChild",value:function(e){var t=(0,s.YA)(e,".Aταλάντη-cursor");if(t)return t.getAttribute("data-client-id")}},{key:"Container",get:function(){return document.querySelector(".Aταλάντη-Container")||document.body}}]),e}();g._cursors={},g.getClient=function(e){if(b.coven.User(e)){var t=g._cursors[e];return t||(t=g._cursors[e]=new g(e)),t}},g.forEach=function(e,t){for(var n in t=t||null,g._cursors)g._cursors.hasOwnProperty(n)&&e.call(t,g._cursors[n],n)},g.destroy=function(e){g._cursors[e]._destroy(),delete g._cursors[e]},Promise.all([Aθεος.Αφροδίτη.UserWorldCreated(),Aθεος.Aφαία.OnReady()]).then((function(t){var n,r,o=(n=t,r=1,function(e){if(Array.isArray(e))return e}(n)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,i,l,s=[],a=!0,c=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;a=!1}else for(;!(a=(r=i.call(n)).done)&&(s.push(r.value),s.length!==t);a=!0);}catch(e){c=!0,o=e}finally{try{if(!a&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(c)throw o}}return s}}(n,r)||function(t,n){if(t){if("string"==typeof t)return e(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?e(t,n):void 0}}(n,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())[0];if((b=o).Server){var i=0,l=-1,a=-1,c=null,u=b.Server.PatchVolatile((function(e,t){if(e){var n=g.getClient(e.sender);n&&n.updatePosition(t)}})),h=b.Server.PatchVolatile((function(e,t){if(e){var n=g.getClient(e.sender);n&&n.Keepalive(t)}}));setInterval((function(){h(),g.forEach((function(e){e&&e.TickTock()}))}),5e3),b.Server.PatchVolatile((function(e,t,n){e&&(g.getClient(e.sender),console.debug("remtoe scroll",t,n))})),g.Container.addEventListener("scroll",_.debounce((function(e){var t=e.target;console.debug("scroll",t.scrollLeft,t.scrollTop,t),g.forEach((function(e){e.refresh()}))}),200)),document.body.addEventListener("mousemove",(function(e){var t=Date.now();if(!(t-i<100)){i=t;var n=e.pageX,r=e.pageY;if(!(Math.abs(l-n)<0&&Math.abs(a-r)<0)){l=n,a=r;var o=e.target;if(m(o)&&(o=null),o&&o!=document.documentElement&&o!=document.body){var s=f(o),h=n-s.left,d=r-s.top;c={fullpath:p(o),offsetX:Math.floor(h),offsetY:Math.floor(d),W:s.W,H:s.H},u(c)}else u(c={top:r,left:n})}}}));var d=b.Server.PatchVolatile((function(e,t){if(console.debug(e,t),e){var n=g.getClient(e.sender);if(n){n.updatePosition(t);var r=f(v(t.fullpath));!function(e,t){var n=(0,s.SL)('\n<div class="Aταλάντη-click Aταλάντη">\n</div>\n');function r(){n.parentElement&&n.parentElement.removeChild(n)}document.body.appendChild(n),n.style.top=e.top+"px",n.style.left=e.left+"px",n.style.borderColor=t,setTimeout((function(){n.classList.add("Aταλάντη-clicking"),n.addEventListener("transitionend",r)}),50),setTimeout(r,y)}({top:r.top+t.offsetY*r.H/t.H,left:r.left+t.offsetX*r.W/t.W,W:r.W,H:r.H},n.peer.color)}}}));document.addEventListener("click",(function(e){setTimeout((function(){try{var t=e.target;if(t==document.documentElement&&(t=document.body),m(t)){var n=g.getClient(g.FromChild(t));return void(n&&(console.debug("curse her",n),n.scrollTo()))}var r=f(t),o=e.pageX-r.left,i=e.pageY-r.top;d({fullpath:p(t),offsetX:o,offsetY:i,W:r.W,H:r.H})}catch(e){}}))}),!0);var y=3e3}}))}()}();