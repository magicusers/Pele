!function(){"use strict";function t(e){return t=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},t(e)}function e(){return e="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,n,o){var r=function(e,n){for(;!Object.prototype.hasOwnProperty.call(e,n)&&null!==(e=t(e)););return e}(e,n);if(r){var i=Object.getOwnPropertyDescriptor(r,n);return i.get?i.get.call(arguments.length<3?e:o):i.value}},e.apply(this,arguments)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function r(t){var e=function(t,e){if("object"!=o(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,"string");if("object"!=o(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==o(e)?e:e+""}function i(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,r(o.key),o)}}function u(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function c(t,e){return c=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},c(t,e)}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&c(t,e)}function f(e,n,r){return n=t(n),function(t,e){if(e&&("object"===o(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}(e,l()?Reflect.construct(n,r||[],t(e).constructor):n.apply(e,r))}function l(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(l=function(){return!!t})()}_;var p=function(o){function r(){return n(this,r),f(this,r,[{ReloadDocumentOnReset:!0}])}return a(r,Aθεος.Αφροδίτη.SharedWorldControl),u(r,[{key:"OnInit",value:function(){var o=function(o){function r(t){var e;return n(this,r),(e=f(this,r,[t])).patched_Action=gameserver.Patch(function(){this.original_Action.apply(this,arguments)}.bind(e)),document.getElementById(t.ID),e}return a(r,Pele.SquareSlides),u(r,[{key:"Action",value:function(){this.patched_Action&&this.patched_Action.apply(this,arguments)}},{key:"original_Action",value:function(){e(t(r.prototype),"Action",this).apply(this,arguments)}}])}();this.dgBanner.Show("Webshow");var r=new o({ID:"coolslides"});window.DoNext=function(){return r.DoNext()},window.DoPrevious=function(){return r.DoPrevious()},window.DoSome=function(){return r.DoSome()},window.DoDelete=function(){return r.DoDelete()},document.addEventListener("paste",(function(t){var e=(t.clipboardData||window.clipboardData).getData("text");e&&(console.debug("pasty",e),r.DoAdd(e),t.preventDefault(),t.stopPropagation())}))}}])}();window.gameserver=new p}();