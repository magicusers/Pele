!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=26)}([function(e,t){function n(t){return e.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},n(t)}e.exports=n},function(e,t){e.exports=function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}},function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t){function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}e.exports=function(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),e}},function(e,t,n){var r=n(10);function o(t,n,i){return"undefined"!=typeof Reflect&&Reflect.get?e.exports=o=Reflect.get:e.exports=o=function(e,t,n){var o=r(e,t);if(o){var i=Object.getOwnPropertyDescriptor(o,t);return i.get?i.get.call(n):i.value}},o(t,n,i||t)}e.exports=o},function(e,t,n){var r=n(11),o=n(1);e.exports=function(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?o(e):t}},function(e,t,n){var r=n(12);e.exports=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&r(e,t)}},function(e,t){e.exports=void 0},,,function(e,t,n){var r=n(0);e.exports=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=r(e)););return e}},function(e,t){function n(t){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?e.exports=n=function(e){return typeof e}:e.exports=n=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(t)}e.exports=n},function(e,t){function n(t,r){return e.exports=n=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},n(t,r)}e.exports=n},function(e,t,n){"use strict";function r(e){var t,n=e;try{var r=(new DOMParser).parseFromString(e,"text/html").body.firstElementChild;if(r){var o=r.tagName.toLowerCase();switch(o){case"img":case"iframe":n=r.getAttribute("src"),t=o;break;case"a":n=r.getAttribute("href"),t="iframe"}}if(!t){new URL(e);var i=e.split("#").shift().split("?").shift().split("/").pop().split(".").pop();t=i&&"jpg.jpeg.png.svg.gif.bmp.ico".indexOf(i.toLowerCase())>=0?"img":"iframe"}}catch(e){t=null}return[t,n]}n.d(t,"a",(function(){return r}))},,,,,,,,,function(e,t,n){},,,,function(e,t,n){"use strict";n.r(t);var r=n(1),o=n.n(r),i=n(4),a=n.n(i),c=n(2),u=n.n(c),l=n(3),s=n.n(l),f=n(5),p=n.n(f),d=n(0),v=n.n(d),y=n(6),m=n.n(y),h=(n(22),n(7),n(13));function b(e,t){var n=Element.prototype;return(n.matches||n.matchesSelector||n.webkitMatchesSelector||n.mozMatchesSelector||n.msMatchesSelector||n.oMatchesSelector).call(e,t)}var g=function(e){function t(){return u()(this,t),p()(this,v()(t).call(this,{ReloadDocumentOnReset:!0}))}return m()(t,e),s()(t,[{key:"OnInit",value:function(){var e=0,t=function(t){function n(e){var t;return u()(this,n),(t=p()(this,v()(n).call(this,e))).patched_Action=gameserver.PatchRaw(function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];this.original_Action.apply(this,n.concat([e]))}.bind(o()(t))),t}return m()(n,t),s()(n,[{key:"Action",value:function(){this.patched_Action&&this.patched_Action.apply(this,arguments)}},{key:"original_Action",value:function(){a()(v()(n.prototype),"Action",this).apply(this,arguments)}},{key:"DoAddText",value:function(t){var n=function(t){var n=++e,r=n,o=document.createElement("div"),i='<div class="item" data-id="'+n+'" data-title="'+r+'"><div class="item-content"><div class="card"><div class="card-content">'+y.apply(this,Object(h.a)(t))+'</div><div class="pele_deactive_overlay"></div><div class="card-id">'+n+'</div><div class="card-remove"></div></div></div></div>';return o.innerHTML=i,o.firstChild}(t);this.DoAddElement(n),n._pele_export_data=t}},{key:"ExportData",value:function(e){return[["text/plain",e._pele_export_data]]}},{key:"InDragCancelZone",value:function(e,t){return b(t.target,".card-remove, .card-remove i")||a()(v()(n.prototype),"InDragCancelZone",this).call(this,e,t)}},{key:"OnClick",value:function(e){b(e.target,".card-remove, .card-remove i")?this.RemoveItem(e.target):a()(v()(n.prototype),"OnClick",this).call(this,e)}},{key:"CreateDragShadow",value:function(e){var t=a()(v()(n.prototype),"CreateDragShadow",this).call(this,e),r=t.querySelector("iframe");return r&&r.parentElement.removeChild(r),t}}]),n}(Pele.MuuriSlideShow);this.dgBanner.Show("Webshow");var n=new t({ID:"coolslides"});window.DoNext=function(){return n.DoNext()},window.DoPrevious=function(){return n.DoPrevious()},window.DoSome=function(){return n.DoSome()},window.DoDelete=function(){return n.DoDelete()},document.addEventListener("paste",(function(e){var t=(e.clipboardData||window.clipboardData).getData("text");t&&(console.debug("pasty",t),n.DoAdd(t),e.preventDefault(),e.stopPropagation())}));var r,i,c,l,f,d=(r=["ed","ED"],i=function(e){console.debug("Invoked:",e),n.EnterEditMode()},l=[],f=Date.now(),c=c||1e3,function(e){var t=Date.now();t-f>c&&(l=[]),f=t,l.push(e);var n=l.join("");r.includes(n)&&(i(n),l=[])});function y(e,t){switch(e){case"img":return"<div class='pele-responsive_image_container' style='background-image:url(".concat(t,")'></div>");case"iframe":return"<iframe allow='camera;microphone' src='".concat(t,"'></iframe>")}return"<iframe srcdoc='".concat(t,"'></iframe>")}document.addEventListener("keydown",(function(e){switch(console.debug("key",e.code,e.keyCode,e.key),e.key){case"Escape":n.SlideUnzoom(),n.ExitEditMode();break;case"ArrowLeft":n.SlidePrevious();break;case"ArrowRight":n.SlideNext();break;case"ArrowUp":case"ArrowDown":break;case"Enter":n.SlideZoom();break;default:d(e.key)}}))}}]),t}(Aθεος.Αφροδίτη.SharedWorldControl);window.gameserver=new g}]);
//# sourceMappingURL=index.js.map