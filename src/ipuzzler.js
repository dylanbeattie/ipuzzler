import { Puzzle, Clue } from './puzzle.js';
import { Parser } from './parser.js';
import { Renderer } from './renderer.js';

export class IPuzzler extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.addEventListener("click", this.handleClick);
    }

    getJson(url, success, failure) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                if (success) success(this.response);
            } else {
                if (failure) failure(this);
            }
        };
        request.onerror = () => console.log(`Error occurring during getJson('${url}')`);
        request.send();
    }

    load(url) {
        this.getJson(url, json => this.init(json));
    }

    init(json) {
        const ipuz = JSON.parse(json);
        this.puzzle = Parser.parse(ipuz);
        this.renderer = new Renderer(this.shadow);
        this.renderer.render(this.puzzle);
    }

    connectedCallback() {
        let url = this.getAttribute("src");
        if (url) this.load(url);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'url': this.load(newValue); break;
        }
    }

    handleClick(event) {
        let input = event.composedPath()[0];
        let x = input.getAttribute("data-x");
        let y = input.getAttribute("data-y");
        this.puzzle.setValue(x, y, input.value);
        this.renderer.update(this.puzzle);
    }

    static get observedAttributes() {
        return ['url'];
    }

}

customElements.define("ipuzzler-puzzle", IPuzzler);