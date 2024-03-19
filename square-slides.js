!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("d3")):"function"==typeof define&&define.amd?define(["d3"],t):"object"==typeof exports?exports.Pele=t(require("d3")):e.Pele=t(e.d3)}(self,(function(e){return function(){"use strict";var t={893:function(t){t.exports=e}},i={};function n(e){var r=i[e];if(void 0!==r)return r.exports;var o=i[e]={exports:{}};return t[e](o,o.exports,n),o.exports}n.d=function(e,t){for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};return function(){function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t(e)}function i(e){var i=function(e,i){if("object"!=t(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,"string");if("object"!=t(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==t(i)?i:i+""}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,i(r.key),r)}}n.r(r),n.d(r,{SquareSlides:function(){return s}}),n(893);var a={slideactive:"slideactive",activated:"activated",fullscreen:"fullscreen",responsive_image_container:"responsive_image_container",pele_dragover:"pele_dragover",DRAGON_DROP_MIME_TYPE:"application/x-pele-move-slideshow"},s=function(){return e=function e(t){var i=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var n=this;function r(){var e=this.eList.children.length,t=this.eList.getBoundingClientRect(),i=Math.ceil(Math.sqrt(e*t.height/t.width)),n=Math.ceil(i*t.width/t.height);Array.from(this.eList.children).forEach((function(e){e.setAttribute("data-pele-square-size-column-count",n)}))}this.eList=document.getElementById(t.ID),this.eList.addEventListener("dragover",(function(e){e.preventDefault()}),!1),this.eList.addEventListener("drop",(function(e){var t=e.dataTransfer.getData("text/html")||e.dataTransfer.getData("text/uri-list")||e.dataTransfer.getData("text/*");t&&(console.debug("text/drop",t),n.DoAdd(t),e.preventDefault(),e.stopPropagation())})),new MutationObserver((function(e){console.debug(e),r.call(i)})).observe(this.eList,{attributes:!1,childList:!0,characterData:!1}),window.addEventListener("resize",r.bind(this))},t=[{key:"DoNext",value:function(){this.Action("DoNext")}},{key:"DoPrevious",value:function(){this.Action("DoPrevious")}},{key:"DoAdd",value:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];this.Action.apply(this,["DoAdd"].concat(t))}},{key:"DoSome",value:function(){this.Action("DoSome")}},{key:"DoDelete",value:function(){this.Action("DoDelete")}},{key:"Action",value:function(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),n=1;n<t;n++)i[n-1]=arguments[n];switch(e){case"MoveRow":D.apply(this,i);break;case"DoNext":u.apply(this,i);break;case"DoPrevious":f.apply(this,i);break;case"DoSome":p.apply(this,i);break;case"DoDelete":h.apply(this,i);break;case"DoSelect":g.apply(this,i);break;case"DoFullScreen":v.apply(this,i);break;case"DoSmallScreen":m.apply(this,i);break;case"DoAdd":l.apply(this,i)}}}],t&&o(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,t}();function c(e,t){var i;switch(e){case"img":(i=document.createElement("div")).classList.add(a.responsive_image_container),i.style.backgroundImage='url("'.concat(t,'")');break;case"iframe":(i=document.createElement("iframe")).setAttribute("src",t);break;default:(i=document.createElement("div")).innerHTML=t}return i}function l(e){var t=this,i=document.createElement("article");i.setAttribute("draggable",!0),this.eContent=c.apply(this,function(e){var t,i=e;try{var n=(new DOMParser).parseFromString(e,"text/html").body.firstElementChild;if(n){var r=n.tagName.toLowerCase();switch(r){case"img":case"iframe":i=n.getAttribute("src"),t=r;break;case"a":i=n.getAttribute("href"),t="iframe"}}if(!t){new URL(e);var o=e.split("#").shift().split("?").shift().split("/").pop().split(".").pop();t=o&&"jpg.jpeg.png.svg.gif.bmp.ico".indexOf(o.toLowerCase())>=0?"img":"iframe"}}catch(e){t=null}return[t,i]}(e)),i.appendChild(this.eContent);var n=document.createElement("button");n.innerHTML="×",n.style.backgroundColor="green",i.appendChild(n),n.addEventListener("click",(function(e){console.debug("clicked deselect button"),e.stopPropagation(),t.Action("DoSmallScreen",d(i))}));var r=document.createElement("div");return i.appendChild(r),function(e){e.classList.add("deactive_overlay");var t=this;e.addEventListener("click",(function(e){console.debug("clicked overlay"),e.stopPropagation(),t.Action("DoSelect",d(i))})),e.addEventListener("dblclick",(function(e){console.debug("DOUBLE clicked while active"),e.stopPropagation(),t.Action("DoFullScreen",d(i))}))}.call(this,r),i.addEventListener("click",(function(e){console.debug("clicked while active",e.target),t.DoNext()})),i.addEventListener("dragstart",(function(e){i.classList.contains(a.fullscreen)?e.preventDefault():(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData(a.DRAGON_DROP_MIME_TYPE,d(i)))})),i.addEventListener("dragover",(function(e){e.dataTransfer.types.includes(a.DRAGON_DROP_MIME_TYPE)&&(i.classList.add(a.pele_dragover),e.preventDefault())})),i.addEventListener("dragleave",(function(e){i.classList.remove(a.pele_dragover)})),i.addEventListener("drop",(function(e){i.classList.remove(a.pele_dragover);var n=e.dataTransfer.getData(a.DRAGON_DROP_MIME_TYPE);if(void 0!==n){var r=d(i);n!=r&&(console.debug("move successful",n,r),t.Action("MoveRow",n,r)),e.preventDefault()}})),i.addEventListener("dragend",(function(e){})),this.eList.appendChild(i),i}function d(t){return(i=t.parentNode.children,function(t){if(Array.isArray(t))return e(t)}(i)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(i)||function(t,i){if(t){if("string"==typeof t)return e(t,i);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(t,i):void 0}}(i)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).indexOf(t);var i}function u(){var e=this.selecteditem?this.selecteditem.nextElementSibling:this.eList.firstElementChild;b.call(this,e)}function f(){var e=this.selecteditem?this.selecteditem.previousElementSibling:this.eList.lastElementChild;b.call(this,e)}function p(){if(this.selecteditem){var e=d(this.selecteditem);this.selecteditem.classList.contains(a.fullscreen)?m.call(this,e):v.call(this,e)}}function h(){this.selecteditem&&(u.call(this),this.selecteditem&&this.selecteditem.parentElement.removeChild(this.selecteditem))}function v(e){L.call(this,this.eList.children[e])}function m(e){E.call(this,this.eList.children[e])}function y(e){e&&(e.classList.remove(a.activated),e.classList.remove(a.fullscreen),this.selecteditem=null)}function b(e){if(e!=this.selecteditem&&e){var t=this.selecteditem&&this.selecteditem.classList.contains(a.fullscreen);y.call(this,this.selecteditem),e.classList.add(a.activated),t&&e.classList.add(a.fullscreen),this.selecteditem=e}}function g(e){b.call(this,this.eList.children[e])}function L(e){e&&(e.classList.add(a.fullscreen),document.body.classList.add(a.slideactive))}function D(e,t){var i=this.eList.children[e],n=this.eList.children[t];i&&n&&this.eList.insertBefore(i,n)}function E(e){e&&(document.body.classList.remove(a.slideactive),e.classList.remove(a.fullscreen))}}(),r}()}));