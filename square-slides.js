!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("d3")):"function"==typeof define&&define.amd?define(["d3"],t):"object"==typeof exports?exports.Pele=t(require("d3")):e.Pele=t(e.d3)}(window,(function(e){return function(e){var t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i(i.s=14)}([,function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t){function i(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}e.exports=function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}},function(e,t,i){var n=i(6),r=i(7),a=i(8);e.exports=function(e){return n(e)||r(e)||a()}},function(e,t,i){"use strict";function n(e){var t,i=e;try{var n=(new DOMParser).parseFromString(e,"text/html").body.firstElementChild;if(n){var r=n.tagName.toLowerCase();switch(r){case"img":case"iframe":i=n.getAttribute("src"),t=r;break;case"a":i=n.getAttribute("href"),t="iframe"}}if(!t){new URL(e);var a=e.split("#").shift().split("?").shift().split("/").pop().split(".").pop();t=a&&"jpg.jpeg.png.svg.gif.bmp.ico".indexOf(a.toLowerCase())>=0?"img":"iframe"}}catch(e){t=null}return[t,i]}i.r(t),i.d(t,"KookData",(function(){return n}))},,function(e,t){e.exports=function(e){if(Array.isArray(e)){for(var t=0,i=new Array(e.length);t<e.length;t++)i[t]=e[t];return i}}},function(e,t){e.exports=function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}},,,,,,function(e,t,i){"use strict";i.r(t),i.d(t,"SquareSlides",(function(){return u}));var n=i(3),r=i.n(n),a=i(1),s=i.n(a),o=i(2),c=i.n(o),l=(i(15),i(4)),d={slideactive:"slideactive",activated:"activated",fullscreen:"fullscreen",responsive_image_container:"responsive_image_container",pele_dragover:"pele_dragover",DRAGON_DROP_MIME_TYPE:"application/x-pele-move-slideshow"},u=function(){function e(t){var i=this;s()(this,e);var n=this;function r(){var e=this.eList.children.length,t=this.eList.getBoundingClientRect(),i=Math.ceil(Math.sqrt(e*t.height/t.width)),n=Math.ceil(i*t.width/t.height);Array.from(this.eList.children).forEach((function(e){e.setAttribute("data-pele-square-size-column-count",n)}))}this.eList=document.getElementById(t.ID),this.eList.addEventListener("dragover",(function(e){e.preventDefault()}),!1),this.eList.addEventListener("drop",(function(e){var t=e.dataTransfer.getData("text/html")||e.dataTransfer.getData("text/uri-list")||e.dataTransfer.getData("text/*");t&&(console.debug("text/drop",t),n.DoAdd(t),e.preventDefault(),e.stopPropagation())})),new MutationObserver((function(e){console.debug(e),r.call(i)})).observe(this.eList,{attributes:!1,childList:!0,characterData:!1}),window.addEventListener("resize",r.bind(this))}return c()(e,[{key:"DoNext",value:function(){this.Action("DoNext")}},{key:"DoPrevious",value:function(){this.Action("DoPrevious")}},{key:"DoAdd",value:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];this.Action.apply(this,["DoAdd"].concat(t))}},{key:"DoSome",value:function(){this.Action("DoSome")}},{key:"DoDelete",value:function(){this.Action("DoDelete")}},{key:"Action",value:function(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),n=1;n<t;n++)i[n-1]=arguments[n];switch(e){case"MoveRow":_.apply(this,i);break;case"DoNext":v.apply(this,i);break;case"DoPrevious":m.apply(this,i);break;case"DoSome":g.apply(this,i);break;case"DoDelete":b.apply(this,i);break;case"DoSelect":A.apply(this,i);break;case"DoFullScreen":y.apply(this,i);break;case"DoSmallScreen":L.apply(this,i);break;case"DoAdd":h.apply(this,i)}}}]),e}();function f(e,t){var i;switch(e){case"img":(i=document.createElement("div")).classList.add(d.responsive_image_container),i.style.backgroundImage='url("'.concat(t,'")');break;case"iframe":(i=document.createElement("iframe")).setAttribute("src",t);break;default:(i=document.createElement("div")).innerHTML=t}return i}function h(e){var t=this,i=document.createElement("article");i.setAttribute("draggable",!0),this.eContent=f.apply(this,Object(l.KookData)(e)),i.appendChild(this.eContent);var n=document.createElement("button");n.innerHTML="×",n.style.backgroundColor="green",i.appendChild(n),n.addEventListener("click",(function(e){console.debug("clicked deselect button"),e.stopPropagation(),t.Action("DoSmallScreen",p(i))}));var r=document.createElement("div");return i.appendChild(r),function(e){e.classList.add("deactive_overlay");var t=this;e.addEventListener("click",(function(e){console.debug("clicked overlay"),e.stopPropagation(),t.Action("DoSelect",p(i))})),e.addEventListener("dblclick",(function(e){console.debug("DOUBLE clicked while active"),e.stopPropagation(),t.Action("DoFullScreen",p(i))}))}.call(this,r),i.addEventListener("click",(function(e){console.debug("clicked while active",e.target),t.DoNext()})),i.addEventListener("dragstart",(function(e){i.classList.contains(d.fullscreen)?e.preventDefault():(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData(d.DRAGON_DROP_MIME_TYPE,p(i)))})),i.addEventListener("dragover",(function(e){e.dataTransfer.types.includes(d.DRAGON_DROP_MIME_TYPE)&&(i.classList.add(d.pele_dragover),e.preventDefault())})),i.addEventListener("dragleave",(function(e){i.classList.remove(d.pele_dragover)})),i.addEventListener("drop",(function(e){i.classList.remove(d.pele_dragover);var n=e.dataTransfer.getData(d.DRAGON_DROP_MIME_TYPE);if(void 0!==n){var r=p(i);n!=r&&(console.debug("move successful",n,r),t.Action("MoveRow",n,r)),e.preventDefault()}})),i.addEventListener("dragend",(function(e){})),this.eList.appendChild(i),i}function p(e){return r()(e.parentNode.children).indexOf(e)}function v(){var e=this.selecteditem?this.selecteditem.nextElementSibling:this.eList.firstElementChild;E.call(this,e)}function m(){var e=this.selecteditem?this.selecteditem.previousElementSibling:this.eList.lastElementChild;E.call(this,e)}function g(){if(this.selecteditem){var e=p(this.selecteditem);this.selecteditem.classList.contains(d.fullscreen)?L.call(this,e):y.call(this,e)}}function b(){this.selecteditem&&(v.call(this),this.selecteditem&&this.selecteditem.parentElement.removeChild(this.selecteditem))}function y(e){k.call(this,this.eList.children[e])}function L(e){w.call(this,this.eList.children[e])}function D(e){e&&(e.classList.remove(d.activated),e.classList.remove(d.fullscreen),this.selecteditem=null)}function E(e){if(!(e==this.selecteditem)&&e){var t=this.selecteditem&&this.selecteditem.classList.contains(d.fullscreen);D.call(this,this.selecteditem),e.classList.add(d.activated),t&&e.classList.add(d.fullscreen),this.selecteditem=e}}function A(e){E.call(this,this.eList.children[e])}function k(e){e&&(e.classList.add(d.fullscreen),document.body.classList.add(d.slideactive))}function _(e,t){var i=this.eList.children[e],n=this.eList.children[t];i&&n&&this.eList.insertBefore(i,n)}function w(e){e&&(document.body.classList.remove(d.slideactive),e.classList.remove(d.fullscreen))}},function(t,i){t.exports=e}])}));
//# sourceMappingURL=square-slides.js.map