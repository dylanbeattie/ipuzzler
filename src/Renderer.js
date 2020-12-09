export class Renderer {
    constructor(container) {
        this.container = container;
        this.spans = [];
        this.clues = {};
    }
    html(tagName, attributes) {
        const element = document.createElement(tagName);
        for(const [key, value] of Object.entries(attributes || {})) element.setAttribute(key, value);
        return element;
    }

    update(puzzle) {
        this.spans.forEach((row, y) => row.forEach((span, x) => {
            span.input.value = puzzle.cells[y][x].value;
        }));
    }
    createCellSpan(cell, row, col) {
        let span = this.html('span');
        if (cell.style) span.className = cell.style;
        if (cell.number) {
            let label = this.html('label');
            label.innerHTML = cell.number;
            span.appendChild(label);
        }
        if (cell.hasInput) span.appendChild(this.html('input'));
        if (cell.number) {


        }
        return(span);
    }

    render(puzzle) {
        
        let css = this.html('link', { 'type': 'text/css', 'href': 'css/ipuzzler.css', 'rel': 'stylesheet'});
        this.container.appendChild(css);
        let grid = this.html('div', { 'class' : 'puzzle-grid' });
        grid.style.gridTemplate = `repeat(${puzzle.height}, 1fr) / repeat(${puzzle.width}, 1fr)`;
        this.container.appendChild(grid);
        let spans = puzzle.cells.map((cells, row) => cells.map((cell, col) => {
            let span = this.createCellSpan(cell, row, col);
            grid.appendChild(span);
            return span;
        }));
        // this.spans = puzzle.cells.map((row, y) => row.map((cell, x) => {
        //     let span = document.createElement('span');
        //     let input = document.createElement('input');
        //     input.setAttribute("data-x", x);
        //     input.setAttribute("data-y", y);
        //     span.input = input;
        //     span.appendChild(input);
        //     grid.appendChild(span);
        //     return (span);
        // }));
        // let acrossList = document.createElement('ul');

        // this.clues.across = puzzle.clues.across.map(clue => {
        //     let li = document.createElement('li');
        //     li.innerHTML = clue.text;
        //     acrossList.appendChild(li);
        //     return (li);
        // });

        // let downList = document.createElement('ul');
        // this.clues.down = puzzle.clues.down.map(clue => {
        //     let li = document.createElement('li');
        //     li.innerHTML = clue.text;
        //     downList.appendChild(li);
        //     return (li);
        // });

        // this.container.appendChild(grid);
        // this.container.appendChild(acrossList);
        // this.container.appendChild(downList);
        // this.update(puzzle);
    }

}
