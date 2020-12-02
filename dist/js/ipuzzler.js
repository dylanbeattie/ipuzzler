!function(){var t={506:function(t){t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},575:function(t){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},100:function(t,e,n){var r=n(489),o=n(67);function u(e,n,i){return o()?t.exports=u=Reflect.construct:t.exports=u=function(t,e,n){var o=[null];o.push.apply(o,e);var u=new(Function.bind.apply(t,o));return n&&r(u,n.prototype),u},u.apply(null,arguments)}t.exports=u},913:function(t){function e(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}t.exports=function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}},754:function(t){function e(n){return t.exports=e=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},e(n)}t.exports=e},205:function(t,e,n){var r=n(489);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}},430:function(t){t.exports=function(t){return-1!==Function.toString.call(t).indexOf("[native code]")}},67:function(t){t.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}},585:function(t,e,n){var r=n(8),o=n(506);t.exports=function(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?o(t):e}},489:function(t){function e(n,r){return t.exports=e=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},e(n,r)}t.exports=e},8:function(t){function e(n){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=e=function(t){return typeof t}:t.exports=e=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(n)}t.exports=e},957:function(t,e,n){var r=n(754),o=n(489),u=n(430),i=n(100);function c(e){var n="function"==typeof Map?new Map:void 0;return t.exports=c=function(t){if(null===t||!u(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(t))return n.get(t);n.set(t,e)}function e(){return i(t,arguments,r(this).constructor)}return e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),o(e,t)},c(e)}t.exports=c}},e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={exports:{}};return t[r](o,o.exports,n),o.exports}n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,{a:e}),e},n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",function(){"use strict";var t=n(575),e=n.n(t),r=n(913),o=n.n(r),u=n(205),i=n.n(u),c=n(585),s=n.n(c),a=n(754),f=n.n(a),l=n(957),p=n.n(l),h=function t(n,r,o){e()(this,t),this.number=n,this.text=r,this.enumeration=o},d=function t(){e()(this,t)},y=function(){function t(){e()(this,t),this.clues={},this.cells=[]}return o()(t,[{key:"setValue",value:function(t,e,n){this.cells[e][t].value=n}}]),t}(),v=function(){function t(){e()(this,t)}return o()(t,null,[{key:"parse",value:function(t){var e=new y;return e.clues={across:t.clues.Across.map((function(t){return new h(t.number,t.clue,t.enumerations)})),down:t.clues.Down.map((function(t){return new h(t.number,t.clue,t.enumerations)}))},e.cells=t.puzzle.map((function(t,e){return t.map((function(t,e){return new d}))})),e}}]),t}(),m=function(){function t(n){e()(this,t),this.container=n,this.spans=[],this.clues={}}return o()(t,[{key:"update",value:function(t){this.spans.forEach((function(e,n){return e.forEach((function(e,r){e.input.value=t.cells[n][r].value}))}))}},{key:"render",value:function(t){var e=document.createElement("div");this.spans=t.cells.map((function(t,n){return t.map((function(t,r){var o=document.createElement("span"),u=document.createElement("input");return u.setAttribute("data-x",r),u.setAttribute("data-y",n),o.input=u,o.appendChild(u),e.appendChild(o),o}))}));var n=document.createElement("ul");this.clues.across=t.clues.across.map((function(t){var e=document.createElement("li");return e.innerHTML=t.text,n.appendChild(e),e}));var r=document.createElement("ul");this.clues.down=t.clues.down.map((function(t){var e=document.createElement("li");return e.innerHTML=t.text,r.appendChild(e),e})),this.container.appendChild(e),this.container.appendChild(n),this.container.appendChild(r),this.update(t)}}]),t}();var b=function(t){i()(c,t);var n,r,u=(n=c,r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,e=f()(n);if(r){var o=f()(this).constructor;t=Reflect.construct(e,arguments,o)}else t=e.apply(this,arguments);return s()(this,t)});function c(){var t;return e()(this,c),(t=u.call(this)).shadow=t.attachShadow({mode:"open"}),t.addEventListener("click",t.handleClick),t}return o()(c,[{key:"getJson",value:function(t,e,n){var r=new XMLHttpRequest;r.open("GET",t,!0),r.onload=function(){this.status>=200&&this.status<400?e&&e(this.response):n&&n(this)},r.onerror=function(){return console.log("Error occurring during getJson('".concat(t,"')"))},r.send()}},{key:"init",value:function(t){var e=JSON.parse(t);this.puzzle=v.parse(e),this.renderer=new m(this.shadow),this.renderer.render(this.puzzle)}},{key:"connectedCallback",value:function(){var t=this,e=this.getAttribute("src");this.getJson(e,(function(e){return t.init(e)}))}},{key:"handleClick",value:function(t){var e=t.composedPath()[0],n=e.getAttribute("data-x"),r=e.getAttribute("data-y");this.puzzle.setValue(n,r,"X"),this.renderer.update(this.puzzle)}}]),c}(p()(HTMLElement));customElements.define("ipuzzler-puzzle",b)}(),function(){"use strict";n.p}()}();
//# sourceMappingURL=ipuzzler.js.map