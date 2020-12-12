import { Puzzle, Clue } from './puzzle.js';
import { Parser } from './parser.js';
import { Renderer } from './renderer.js';

export class IPuzzler extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.addEventListener("mousedown", this.handleMouseDown);
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

    handleMouseDown(event) {
        event.preventDefault();
        let target = event.composedPath()[0];
        switch (target.tagName) {
            case 'INPUT':
                let row = target.getAttribute("data-row");
                let col = target.getAttribute("data-col");
                this.puzzle.setFocus(row, col);
                break;
        }
        this.renderer.update(this.puzzle);
        return (false);
    }

    static get observedAttributes() {
        return ['url'];
    }

}

customElements.define("ipuzzler-puzzle", IPuzzler);