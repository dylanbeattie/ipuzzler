import { Puzzle } from './puzzle.js';
import { Parser } from './parser.js';
import { Renderer } from './renderer.js';
import { Clue } from "./clue";

export class IPuzzler extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.addEventListener("keydown", this.keydown);
        window.addEventListener("resize", this.resize.bind(this));
    }

    load(url) {
        fetch(url).then(response => response.json()).then(json => this.init(json, url));
    }

    init(json, url) {
        this.puzzle = Parser.parse(json, url);
        this.renderer = new Renderer(this.shadow);
        this.renderer.render(this.puzzle);
        this.renderer.inputs.forEach(input => {
            input.addEventListener("focus", this.inputFocus.bind(this));
            input.addEventListener("mousedown", this.inputMouseDown.bind(this));
        });
        this.renderer.clueListItems.forEach(li => li.addEventListener("click", this.clueListItemClick.bind(this)));
        this.renderer.buttons.forEach(button => button.addEventListener("click", this.buttonClick.bind(this)));
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

    inputMouseDown(event) {
        let target = event.composedPath()[0];
        let row = target.getAttribute("data-row");
        let col = target.getAttribute("data-col");
        this.puzzle.setFocus(row, col, true);
        this.renderer.update(this.puzzle);
    }

    inputFocus(event) {
        let target = event.composedPath()[0];
        let row = target.getAttribute("data-row");
        let col = target.getAttribute("data-col");
        this.puzzle.setFocus(row, col);
        this.renderer.update(this.puzzle);
    }

    clueListItemClick(event) {
        let li = event.target.closest("li");
        let clueNumber = parseInt(li.getAttribute("data-clue-number"));
        let clueDirection = li.getAttribute("data-clue-direction");
        this.puzzle.focusClue(clueNumber, clueDirection);
        this.renderer.update(this.puzzle);
    }

    buttonClick(event) {
        let button = event.composedPath()[0];
        switch (button.id) {
            case 'check-clue-button': this.puzzle.checkClue(); break;
            case 'clear-clue-button': this.puzzle.clearClue(); break;
            case 'cheat-clue-button': this.puzzle.cheatClue(); break;
            case 'check-grid-button': this.puzzle.checkGrid(); break;
            case 'clear-grid-button': this.puzzle.clearGrid(); break;
            case 'cheat-grid-button': if (confirm('Are you sure you want to reveal all solutions?')) this.puzzle.cheatGrid(); break;
        }
        this.renderer.update(this.puzzle);
    }

    keydown(event) {
        if (event.ctrlKey || event.altKey || event.metaKey) return;
        let code = event.code;
        switch (code) {
            case "ArrowUp": this.puzzle.direction = "down"; this.puzzle.moveFocus("up"); break;
            case "ArrowDown": this.puzzle.direction = "down"; this.puzzle.moveFocus("down"); break;
            case "ArrowLeft": this.puzzle.direction = "across"; this.puzzle.moveFocus("left"); break;
            case "ArrowRight": this.puzzle.direction = "across"; this.puzzle.moveFocus("right"); break;
            case "Home": this.puzzle.home(); break;
            case "End": this.puzzle.end(); break;
            case "Backspace": this.puzzle.backspace(); break;
            case "Delete": this.puzzle.setCellValue(""); break;
            case "Escape": this.puzzle.clearFocus(); break;
        }
        if (/^[a-z]$/i.test(event.key)) {
            this.puzzle.setCellValue(event.key);
            event.preventDefault();
        }
        this.renderer.update(this.puzzle);
    }

    // mousedown(event) {
    //     event.preventDefault();
    //     let target = event.composedPath()[0];
    //     switch (target.tagName) {
    //         case 'INPUT':
    //             let row = target.getAttribute("data-row");
    //             let col = target.getAttribute("data-col");
    //             this.puzzle.setFocus(row, col);
    //             break;
    //     }
    //     this.renderer.update(this.puzzle);
    //     return (false);
    // }

    static get observedAttributes() {
        return ['url'];
    }

}

customElements.define("ipuzzler-puzzle", IPuzzler);