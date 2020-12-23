!function(){var t={228:function(t){t.exports=function(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}},858:function(t){t.exports=function(t){if(Array.isArray(t))return t}},506:function(t){t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},575:function(t){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},100:function(t,e,n){var r=n(489),i=n(67);function o(e,n,s){return i()?t.exports=o=Reflect.construct:t.exports=o=function(t,e,n){var i=[null];i.push.apply(i,e);var o=new(Function.bind.apply(t,i));return n&&r(o,n.prototype),o},o.apply(null,arguments)}t.exports=o},913:function(t){function e(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}t.exports=function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}},754:function(t){function e(n){return t.exports=e=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},e(n)}t.exports=e},205:function(t,e,n){var r=n(489);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}},430:function(t){t.exports=function(t){return-1!==Function.toString.call(t).indexOf("[native code]")}},67:function(t){t.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}},884:function(t){t.exports=function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,i=!1,o=void 0;try{for(var s,u=t[Symbol.iterator]();!(r=(s=u.next()).done)&&(n.push(s.value),!e||n.length!==e);r=!0);}catch(t){i=!0,o=t}finally{try{r||null==u.return||u.return()}finally{if(i)throw o}}return n}}},521:function(t){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},585:function(t,e,n){var r=n(8),i=n(506);t.exports=function(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?i(t):e}},489:function(t){function e(n,r){return t.exports=e=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},e(n,r)}t.exports=e},38:function(t,e,n){var r=n(858),i=n(884),o=n(379),s=n(521);t.exports=function(t,e){return r(t)||i(t,e)||o(t,e)||s()}},8:function(t){function e(n){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=e=function(t){return typeof t}:t.exports=e=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(n)}t.exports=e},379:function(t,e,n){var r=n(228);t.exports=function(t,e){if(t){if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}},957:function(t,e,n){var r=n(754),i=n(489),o=n(430),s=n(100);function u(e){var n="function"==typeof Map?new Map:void 0;return t.exports=u=function(t){if(null===t||!o(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(t))return n.get(t);n.set(t,e)}function e(){return s(t,arguments,r(this).constructor)}return e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),i(e,t)},u(e)}t.exports=u}},e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={exports:{}};return t[r](i,i.exports,n),i.exports}n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,{a:e}),e},n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",function(){"use strict";var t=n(575),e=n.n(t),r=n(913),i=n.n(r),o=n(205),s=n.n(o),u=n(585),c=n.n(u),l=n(754),a=n.n(l),f=n(957),h=n.n(f),p=function(){function t(n,r){var i=this;e()(this,t),this.cells=n,this.cells.forEach((function(t){return t.puzzle=i})),this.clues=r,this.focusedCell=null,this.direction="across"}return i()(t,[{key:"switchDirection",value:function(){return"across"==this.direction?this.direction="down":this.direction="across"}},{key:"setFocus",value:function(t,e){var n=this.cells[t][e];this.focusedCell==n?n.isBirectional&&this.switchDirection():(this.focusedCell=n,n.clues[this.direction]||this.switchDirection()),this.focusedClue=n.clues[this.direction],this.cells.flat().forEach((function(t){return t.clearHighlight()})),this.focusedClue.addHighlight()}},{key:"setFocusToCell",value:function(t){t&&t.hasInput&&(this.focusedCell=t,this.focusedClue=t.clues[this.direction]||t.clues[this.switchDirection()],this.cells.flat().forEach((function(t){return t.clearHighlight()})),this.focusedClue.addHighlight())}},{key:"getCell",value:function(t,e){return t<0||t>=this.cells.length||e<0||e>=this.cells[t].length?null:this.cells[t][e]}},{key:"moveFocus",value:function(t){var e,n,r=null===(e=this.focusedCell)||void 0===e?void 0:e.position;if(r){switch(t){case"up":n=this.getCell(r.row-1,r.col);break;case"down":n=this.getCell(r.row+1,r.col);break;case"left":n=this.getCell(r.row,r.col-1);break;case"right":n=this.getCell(r.row,r.col+1)}this.setFocusToCell(n)}}},{key:"width",get:function(){return this.cells[0].length}},{key:"height",get:function(){return this.cells.length}}]),t}(),d=function(){function t(n,r){var i=this;if(e()(this,t),this.direction=r,this.number=parseInt(n.number),this.text=n.clue,this.enumeration=n.enumeration,this.cells=[],this.continuations=[],n.continued&&n.continued.map){this.continuations=n.continued.map((function(e){var r=new t(e,e.direction.toLowerCase());return r.text="See ".concat(n.number),r.direction!=i.direction&&(r.text+=" "+i.direction),r.root=i,r})),this.next=this.continuations[0];for(var o=0;o<this.continuations.length-1;o++)this.continuations[o].next=this.continuations[o+1]}}return i()(t,[{key:"addHighlight",value:function(){this.cells.forEach((function(t){return t.addHighlight()}))}},{key:"toClueList",value:function(){return[this].concat(this.continuations)}}]),t}(),y=function(){function t(n,r){e()(this,t),this.row=n,this.col=r}return i()(t,[{key:"isInside",value:function(t){return!(this.row<0||this.row>=t.length||this.col<0||this.col>=t[this.row].length)}},{key:"increment",value:function(e){switch(e){case"down":return new t(this.row+1,this.col);case"across":return new t(this.row,this.col+1)}}}]),t}(),v=function(){function t(n,r,i){if(e()(this,t),this.style="",this.position=new y(r,i),this.previous={},this.next={},this.clues={},null===n)this.style="blank";else if("number"==typeof n.cell?this.number=n.cell:this.number="number"==typeof n?n:NaN,n.style)switch(n.style.barred){case"T":this.style="barred-top";break;case"L":this.style="barred-left";break;case"TL":this.style="barred-top barred-left"}else"#"==n&&(this.style="block")}return i()(t,[{key:"addHighlight",value:function(){this.isActive=!0}},{key:"clearHighlight",value:function(){this.isActive=!1}},{key:"isEndOfRange",value:function(t){return!this.hasInput||!("across"!=t||!this.previous.across||!/left/.test(this.style))||!("down"!=t||!this.previous.down||!/top/.test(this.style))}},{key:"isBirectional",get:function(){return this.clues.across&&this.clues.down}},{key:"hasInput",get:function(){return!/bl(an|oc)k/.test(this.style)}}]),t}(),b=function(){function t(){e()(this,t)}return i()(t,null,[{key:"parse",value:function(e){var n=e.puzzle.map((function(t,e){return t.map((function(t,n){return new v(t,e,n)}))})),r=e.clues.Across.map((function(t){return new d(t,"across").toClueList()})).flat(),i=e.clues.Down.map((function(t){return new d(t,"down").toClueList()})).flat(),o={across:[],down:[]};return r.concat(i).forEach((function(e){var r=t.findCellForClue(n,e);e.position=r.position,e.cells=t.findCellList(n,e.position,e.direction),e.cells.forEach((function(t){return t.clues[e.direction]=e})),o[e.direction][e.number]=e})),new p(n,o)}},{key:"findCellForClue",value:function(t,e){return t.flat().find((function(t){return t.number==e.number}))}},{key:"findCellList",value:function(e,n,r,i){if(!n.isInside(e))return[];var o=e[n.row][n.col];return o.previous[r]=i,o.isEndOfRange(r)?[]:(i&&(i.next[r]=o),[o].concat(t.findCellList(e,n.increment(r),r,o)))}}]),t}(),m=n(38),w=n.n(m),g=function(){function t(n){e()(this,t),this.container=n,this.spans=[],this.clues={}}return i()(t,[{key:"html",value:function(t,e){for(var n=document.createElement(t),r=0,i=Object.entries(e||{});r<i.length;r++){var o=w()(i[r],2),s=o[0],u=o[1];n.setAttribute(s,u)}return n}},{key:"update",value:function(t){this.spans.forEach((function(e,n){return e.forEach((function(e,r){var i=t.cells[n][r];i==t.focusedCell&&e.input.focus(),i.isActive?e.classList.add("highlighted"):e.classList.remove("highlighted")}))}))}},{key:"createCellSpan",value:function(t,e,n){var r=this.html("span");if(t.style&&(r.className=t.style),t.number){var i=this.html("label");i.innerHTML=t.number,r.appendChild(i)}if(t.hasInput){var o=this.html("input",{"data-row":e,"data-col":n});r.appendChild(o),r.input=o}return r}},{key:"createClueListDiv",value:function(t,e){return this.html("div",{class:"puzzle-clue-list"})}},{key:"render",value:function(t){var e=this,n=this.html("link",{type:"text/css",href:"css/ipuzzler.css",rel:"stylesheet"});this.container.appendChild(n);var r=this.html("div",{class:"puzzle-grid"});r.style.gridTemplate="repeat(".concat(t.height,", 1fr) / repeat(").concat(t.width,", 1fr)"),this.spans=t.cells.map((function(t,n){return t.map((function(t,i){var o=e.createCellSpan(t,n,i);return r.appendChild(o),o}))})),this.container.appendChild(r);var i=this.createClueListDiv(t.clues.across);this.container.appendChild(i);var o=this.createClueListDiv(t.clues.down);this.container.appendChild(o)}}]),t}();var k=function(t){s()(u,t);var n,r,o=(n=u,r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,e=a()(n);if(r){var i=a()(this).constructor;t=Reflect.construct(e,arguments,i)}else t=e.apply(this,arguments);return c()(this,t)});function u(){var t;return e()(this,u),(t=o.call(this)).shadow=t.attachShadow({mode:"open"}),["mousedown","keydown"].forEach((function(e){return t.addEventListener(e,t[e])})),t}return i()(u,[{key:"load",value:function(t){var e=this;fetch(t).then((function(t){return t.json()})).then((function(t){return e.init(t)}))}},{key:"init",value:function(t){this.puzzle=b.parse(t),this.renderer=new g(this.shadow),this.renderer.render(this.puzzle)}},{key:"connectedCallback",value:function(){var t=this.getAttribute("src");t&&this.load(t)}},{key:"attributeChangedCallback",value:function(t,e,n){switch(t){case"url":this.load(n)}}},{key:"keydown",value:function(t){switch(t.preventDefault(),t.composedPath()[0],t.code){case"ArrowUp":this.puzzle.moveFocus("up");break;case"ArrowDown":this.puzzle.moveFocus("down");break;case"ArrowLeft":this.puzzle.moveFocus("left");break;case"ArrowRight":this.puzzle.moveFocus("right")}this.renderer.update(this.puzzle)}},{key:"mousedown",value:function(t){t.preventDefault();var e=t.composedPath()[0];switch(e.tagName){case"INPUT":var n=e.getAttribute("data-row"),r=e.getAttribute("data-col");this.puzzle.setFocus(n,r)}return this.renderer.update(this.puzzle),!1}}],[{key:"observedAttributes",get:function(){return["url"]}}]),u}(h()(HTMLElement));customElements.define("ipuzzler-puzzle",k)}(),function(){"use strict";n.p}()}();
//# sourceMappingURL=ipuzzler.js.map