export class Renderer {
    constructor(shadowDom) {
        this.dom = shadowDom;
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
    createClueEnumerationSpan(clue) {
        let span = this.html('span');
        span.innerText = `(${clue.enumeration.trim().replace(/ /g, ",")})`;
        return(span);
    }

    createClueList(clues, id, title) {
        let section = this.html('section', { 'class': 'puzzle-clue-list', 'id': id });
        let heading = this.html('h2');
        heading.innerHTML = title;
        section.appendChild(heading);

        let list = this.html('ol');
        clues.forEach(clue => {
            let item = this.html('li', { id: clue.elementId});
            let link = this.html('a');
            link.innerText = clue.text;
            let label = this.html('label');
            label.innerText = clue.number;
            link.insertBefore(label, link.firstChild);
            if (clue.enumeration) link.appendChild(this.createClueEnumerationSpan(clue));
            item.appendChild(link);
            list.appendChild(item);
        });
        section.appendChild(list);
        return section;
    }

    render(puzzle) {
        const div = this.html('div', { 'class' : 'ipuzzler' });

        const css = this.html('link', { 'type': 'text/css', 'href': 'css/ipuzzler.css', 'rel': 'stylesheet' });
        div.appendChild(css);

        const grid = this.html('div', { 'class': 'puzzle-grid' });
        grid.style.gridTemplate = `repeat(${puzzle.height}, 1fr) / repeat(${puzzle.width}, 1fr)`;
        this.spans = puzzle.cells.map((cells, row) => cells.map((cell, col) => {
            let span = this.createCellSpan(cell, row, col);
            grid.appendChild(span);
            return span;
        }));
        div.appendChild(grid);

        div.appendChild(this.createClueList(puzzle.clues.across, 'across-clue-list', "Across"));

        div.appendChild(this.createClueList(puzzle.clues.down, 'down-clue-list', "Down"));

        this.dom.appendChild(div);
    }

} 
