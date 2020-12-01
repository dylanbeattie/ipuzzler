class Cell {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.style = "";
    }
    toHtmlElement() {
        let span = document.createElement('span');
        let input = document.createElement('input');
        if (this.hasFocus) input.setAttribute("autofocus", "true");
        input.setAttribute("data-x", this.x);
        input.setAttribute("data-y", this.y);
        span.appendChild(input);
        return(span);
    }
    setValue(value) {
        this.value = value;
    }
}

class Renderer {
    constructor() {
        this.cells = [];
        this.clues = {};
    }

    update(model) {
        this.spans.forEach((row, y) => row.forEach((span, x) => {
            span.input.value = model.cells[y][x].value;
        }));
    }

    render(container, model) {
        let grid = document.createElement('div');
        this.spans = model.cells.map((row, y) => row.map((cell, x) => {
            let span = document.createElement('span');
            let input = document.createElement('input');
            input.setAttribute("data-x", x);
            input.setAttribute("data-y", y);
            span.input = input;
            span.appendChild(input);
            grid.appendChild(span);
            return(span);
        }));
        let acrossList = document.createElement('ul');
        
        this.clues.across = model.clues.across.map(clue => {
            let li = document.createElement('li');
            li.innerHTML = clue;
            acrossList.appendChild(li);
            return(li);
        });

        let downList = document.createElement('ul');
        this.clues.down = model.clues.down.map(clue => {
            let li = document.createElement('li');
            li.innerHTML = clue;
            downList.appendChild(li);
            return(li);
        });

        container.appendChild(grid);
        container.appendChild(acrossList);
        container.appendChild(downList);
        this.update(model);
    }

}

class PuzzleModel {
    parseCells(data) {
        return data.map((row, y) => row.map((cell, x) => new Cell(x, y, cell)));
    }
    constructor() {
        console.log("constructoring!");
        this.cells = this.parseCells(
            [
                ["A", "B", "C", "D", "E"],
                ["F", "G", "H", "I", "J"],
                ["K", "L", "M", "N", "O"],
                ["P", "Q", "R", "S", "T"],
                ["U", "V", "W", "X", "Y"]
            ]
        );
        this.clues = {
            across: [ "Fnord", "Beagle", "Bigger dog", "Horse with legs", "Water in a can" ],
            down: [ "Apes", "Pigs", "Spacement", "Hugh", "Pugh", "Barney McGrew" ]
        }
    }
    setValue(x,y,value) {
        console.table(this.cells);
        this.cells[y][x].setValue(value);
    }

    setFocus(x,y) {
        console.log(x, y);
        console.table(this.cells);
        this.cells.flat().forEach(cell => cell.hasFocus = false);
        this.cells[y][x].hasFocus = true;
    }
    render(element) {
        element.innerHTML = "";
        this.cells.forEach(row => row.forEach(cell =>  element.appendChild(cell.toHtmlElement())));
    }
}

export class IPuzzler extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' });
        this.span = document.createElement('span');
        this.span.innerHTML = "ipuzzler is YAY working.";
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'css/ipuzzler.css');
        shadow.appendChild(link);
        shadow.appendChild(this.span);
        this.addEventListener("click", this.handleClick);
        this.model = new PuzzleModel();
        this.renderer = new Renderer();
        this.renderer.render(shadow, this.model);
        puzzle = this;
    }
    render(target) {
        this.model.render(this.span, target);
    }

    handleClick(event) {
        console.log(event);
        console.log(this);
        let path = event.composedPath();
        let input = path[0];
        let x = input.getAttribute("data-x");
        let y = input.getAttribute("data-y");
        console.log(x,y);
        this.model.setValue(x,y,"COCK");
        this.renderer.update(this.model);
    }
 
    hello(message) {
        return `Hello ${message}`;
    }
}

customElements.define("ipuzzler-puzzle", IPuzzler);