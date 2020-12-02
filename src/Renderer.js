export class Renderer {
    constructor(container) {
        this.container = container;
        this.spans = [];
        this.clues = {};
    }

    update(puzzle) {
        this.spans.forEach((row, y) => row.forEach((span, x) => {
            span.input.value = puzzle.cells[y][x].value;
        }));
    }

    render(puzzle) {
        let grid = document.createElement('div');
        this.spans = puzzle.cells.map((row, y) => row.map((cell, x) => {
            let span = document.createElement('span');
            let input = document.createElement('input');
            input.setAttribute("data-x", x);
            input.setAttribute("data-y", y);
            span.input = input;
            span.appendChild(input);
            grid.appendChild(span);
            return (span);
        }));
        let acrossList = document.createElement('ul');

        this.clues.across = puzzle.clues.across.map(clue => {
            let li = document.createElement('li');
            li.innerHTML = clue.text;
            acrossList.appendChild(li);
            return (li);
        });

        let downList = document.createElement('ul');
        this.clues.down = puzzle.clues.down.map(clue => {
            let li = document.createElement('li');
            li.innerHTML = clue.text;
            downList.appendChild(li);
            return (li);
        });

        this.container.appendChild(grid);
        this.container.appendChild(acrossList);
        this.container.appendChild(downList);
        this.update(puzzle);
    }

}
