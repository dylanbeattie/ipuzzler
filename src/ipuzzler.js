import { Puzzle } from './puzzle.js';
import { Parser } from './parser.js';
import { Renderer } from './renderer.js';
import { Clue } from "./clue";

export class IPuzzler extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        ["mousedown", "keydown", "click"].forEach(event => this.addEventListener(event, this[event]));
        window.addEventListener("resize", this.resize.bind(this));
    }

    load(url) {
        fetch(url).then(response => response.json()).then(json => this.init(json));
    }

    init(json) {
        this.puzzle = Parser.parse(json);
        this.renderer = new Renderer(this.shadow);
        this.renderer.render(this.puzzle);
        this.resize();
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

    resize(event) {
        if (this.renderer && typeof (this.renderer.resize) == 'function') this.renderer.resize(this.puzzle);
    }

    click(event) {
        event.preventDefault();
        let target = event.composedPath()[0];
        let listItem = target.closest("li");
        if (listItem != null) {
            let clueNumber = parseInt(listItem.getAttribute("data-clue-number"));
            let clueDirection = listItem.getAttribute("data-clue-direction");
            this.puzzle.focusClue(clueNumber, clueDirection);
            this.renderer.update(this.puzzle);
        }
    }

    keydown(event) {
        event.preventDefault();
        // let target = event.composedPath()[0];
        let code = event.code;
        switch (code) {
            case "ArrowUp": this.puzzle.direction = "down"; this.puzzle.moveFocus("up"); break;
            case "ArrowDown": this.puzzle.direction = "down"; this.puzzle.moveFocus("down"); break;
            case "ArrowLeft": this.puzzle.direction = "across"; this.puzzle.moveFocus("left"); break;
            case "ArrowRight": this.puzzle.direction = "across"; this.puzzle.moveFocus("right"); break;
        }
        if (/^[a-z]$/i.test(event.key)) this.puzzle.setCellValue(event.key);
        this.renderer.update(this.puzzle);
    }

    mousedown(event) {
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