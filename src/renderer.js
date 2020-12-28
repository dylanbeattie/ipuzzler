export class Renderer {
    constructor(container) {
        this.container = container;
        this.spans = [];
        this.clues = {};
    }
    html(tagName, attributes) {
        const element = document.createElement(tagName);
        for (const [key, value] of Object.entries(attributes || {})) element.setAttribute(key, value);
        return element;
    }

    update(puzzle) {
        this.spans.forEach((line, row) => line.forEach((span, col) => {
            let cell = puzzle.cells[row][col];
            if (cell == puzzle.focusedCell) span.input.focus();
            if (cell.isActive) {
                span.classList.add("highlighted");
            } else {
                span.classList.remove("highlighted");
            }
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
        if (cell.hasInput) {
            let input = this.html('input', { "data-row": row, "data-col": col });
            span.appendChild(input);
            span.input = input;
        }
        return (span);
    }
    createClueList(clues, id, title) {
        let section = this.html('section', { 'class': 'puzzle-clue-list', 'id': id });
        let heading = this.html('h2');
        heading.innerHTML = title;
        section.appendChild(heading);

        let list = this.html('ol');
        clues.forEach(clue => {
            let item = this.html('li', { id: clue.elementId});
            item.innerText = clue.text;
            let label = this.html('label');
            label.innerText = clue.number;
            item.insertBefore(label, item.firstChild);
            if (clue.enumeration) {
                let span = this.html('span');
                span.innerText = `(${clue.enumeration.trim().replace(/ /g, ",")})`;
                item.appendChild(span);
            }
            list.appendChild(item);
        });
        section.appendChild(list);
        return section;
    }

    render(puzzle) {

        const css = this.html('link', { 'type': 'text/css', 'href': 'css/ipuzzler.css', 'rel': 'stylesheet' });
        this.container.appendChild(css);

        const grid = this.html('div', { 'class': 'puzzle-grid' });
        grid.style.gridTemplate = `repeat(${puzzle.height}, 1fr) / repeat(${puzzle.width}, 1fr)`;
        this.spans = puzzle.cells.map((cells, row) => cells.map((cell, col) => {
            let span = this.createCellSpan(cell, row, col);
            grid.appendChild(span);
            return span;
        }));
        this.container.appendChild(grid);

        const acrossClueList = this.createClueList(puzzle.clues.across, 'across-clue-list', "Across");
        this.container.appendChild(acrossClueList);

        const downClueList = this.createClueList(puzzle.clues.down, 'down-clue-list', "Down");
        this.container.appendChild(downClueList);

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
