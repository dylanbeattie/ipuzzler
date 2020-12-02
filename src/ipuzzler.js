import { Puzzle, Clue } from './puzzle.js';
import { Parser } from './parser.js';
import { Renderer } from './renderer.js';

// class PuzzleModel {
//     parseCells(data) {
//         return data.map((row, y) => row.map((cell, x) => new Cell(x, y, cell)));
//     }
//     constructor() {
//         console.log("constructoring!");
//         this.cells = this.parseCells(
//             [
//                 ["A", "B", "C", "D", "E"],
//                 ["F", "G", "H", "I", "J"],
//                 ["K", "L", "M", "N", "O"],
//                 ["P", "Q", "R", "S", "T"],
//                 ["U", "V", "W", "X", "Y"]
//             ]
//         );
//         this.clues = {
//             across: [ "Fnord", "Beagle", "Bigger dog", "Horse with legs", "Water in a can" ],
//             down: [ "Apes", "Pigs", "Spacement", "Hugh", "Pugh", "Barney McGrew" ]
//         }
//     }
//     setValue(x,y,value) {
//         console.table(this.cells);
//         this.cells[y][x].setValue(value);
//     }

//     setFocus(x,y) {
//         console.log(x, y);
//         console.table(this.cells);
//         this.cells.flat().forEach(cell => cell.hasFocus = false);
//         this.cells[y][x].hasFocus = true;
//     }
//     render(element) {
//         element.innerHTML = "";
//         this.cells.forEach(row => row.forEach(cell =>  element.appendChild(cell.toHtmlElement())));
//     }
// }

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

    init(json) {
        const ipuz = JSON.parse(json);
        this.puzzle = Parser.parse(ipuz);
        this.renderer = new Renderer(this.shadow);
        this.renderer.render(this.puzzle);
    }

    connectedCallback() {
        let url = this.getAttribute("src");
        this.getJson(url, json => this.init(json));
    }

    handleClick(event) {
        let input = event.composedPath()[0];
        let x = input.getAttribute("data-x");
        let y = input.getAttribute("data-y");
        this.puzzle.setValue(x, y, "X");
        this.renderer.update(this.puzzle);
    }
}

customElements.define("ipuzzler-puzzle", IPuzzler);