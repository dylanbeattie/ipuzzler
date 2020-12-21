import { Puzzle, Clue } from './puzzle.js';
import { Parser } from './parser.js';
import { Renderer } from './renderer.js';

export class IPuzzler extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.addEventListener("mousedown", this.mousedown);
    }

    load(url) {
        fetch(url).then(response => response.json()).then(json => this.init(json));
    }

    init(json) {
        this.puzzle = Parser.parse(json);
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

    mousedown(event) {
        console.log(event);
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