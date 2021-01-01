export class Renderer {
    constructor(shadowDom) {
        this.dom = shadowDom;
        this.spans = [];
        this.inputs = [];
        this.labels = [];
        this.clueListItems = [];
        this.buttons = [];
        this.grid = null;
        this.aboveClueBar = null;
        this.belowClueBar = null;
    }

    html(tagName, attributes, innerText) {
        const element = document.createElement(tagName);
        for (const [key, value] of Object.entries(attributes || {})) element.setAttribute(key, value);
        if (innerText) element.innerText = innerText;
        return element;
    }

    update(puzzle) {
        this.spans.forEach((line, row) => line.forEach((span, col) => {
            let cell = puzzle.cells[row][col];
            if (cell == puzzle.focusedCell) {
                span.input.focus();
            } else if (span && span.input) {
                span.input.blur();
            }
            if (span.input) span.input.value = cell.value;
            if (cell.isActive) {
                span.classList.add("highlighted");
            } else {
                span.classList.remove("highlighted");
            }
        }));
        this.clueListItems.forEach(item => {
            if (item.clue.isActive) {
                if (item.clue.root) {
                    item.classList.add("halflighted");
                } else {
                    item.classList.add("highlighted");
                }
            } else {
                item.classList.remove("highlighted");
                item.classList.remove("halflighted");
            }
        });
        if (puzzle.focusedClue) {
            this.drawClue(puzzle.focusedClue, this.aboveClueBar, true);
            this.drawClue(puzzle.focusedClue, this.belowClueBar, true);
        } else {
            this.aboveClueBar.innerHTML = '';
            this.belowClueBar.innerHTML = '';
        }

        this.savePuzzleStateToCookie(puzzle);
    }

    savePuzzleStateToCookie(puzzle) {
        var cookieValue = puzzle.getState();
        var cookieDate = new Date(2100, 1, 1);
        document.cookie = puzzle.cookieName + "=" + cookieValue + ";expires=" + cookieDate.toUTCString() + ";path=/";
    }

    loadPuzzleStateFromCookie(puzzle) {
        var cookies = decodeURIComponent(document.cookie).split(/; */);
        var cookie = cookies.map(c => c.split('=')).find(pair => pair[0] == puzzle.cookieName);
        if (cookie && cookie.length > 1) puzzle.setState(cookie[1]);
    }


    createCellSpan(cell, row, col) {
        let span = this.html('span');
        if (cell.style) span.className = cell.style;
        if (cell.number) {
            let label = this.html('label');
            label.innerHTML = cell.number;
            span.appendChild(label);
            this.labels.push(label);
        }
        if (cell.hasInput) {
            let input = this.html('input', { "data-row": row, "data-col": col, "value": cell.value });
            span.appendChild(input);
            span.input = input;
            this.inputs.push(input);
        }
        return (span);
    }

    recalculateFontSizes(gridSize, puzzle) {
        var inputFontSize = (Math.ceil(gridSize / (1.8 * puzzle.width)));
        // for sizes just under 16, we bump the size to 16px to prevent zooming on iOS when input is focused.
        if (inputFontSize > 10 && inputFontSize < 16) inputFontSize = 16;
        this.inputs.forEach(input => input.style.fontSize = inputFontSize + "px");
        var labelFontSize = (Math.ceil(gridSize / (4 * puzzle.width)));
        this.labels.forEach(label => label.style.fontSize = labelFontSize + "px");
        let windowWidth = Math.min(window.innerWidth, document.body.scrollWidth, document.body.clientWidth);
        let width, height;
        if (windowWidth > 768) {
            let cellSize = Math.min(420 / puzzle.width);
            if (cellSize < 24) cellSize = 24;
            if (cellSize > 32) cellSize = 32;
            width = (puzzle.width * cellSize);
            height = (puzzle.height * cellSize);
        } else {
            width = (windowWidth - 10);
            height = (Math.floor((puzzle.height / puzzle.width) * width));
        }
        this.grid.style.width = width + "px";
        this.aboveClueBar.style.width = width + "px";
        this.belowClueBar.style.width = width + "px";
        this.grid.style.height = height + "px";
    }

    createClueEnumerationSpan(clue) {
        let span = this.html('span');
        span.innerText = `(${clue.enumeration.trim().replace(/ /g, ",")})`;
        return (span);
    }

    createClueList(puzzle, direction) {
        let clues = puzzle.clues[direction.toLowerCase()];
        let id = `${direction.toLowerCase()}-clue-list`;
        let section = this.html('section', { 'class': 'puzzle-clue-list', 'id': id });
        let heading = this.html('h2');
        heading.innerHTML = clues.heading;
        section.appendChild(heading);

        let list = this.html('ol');
        clues.forEach(clue => {
            let item = this.html('li', { id: clue.elementId, 'data-clue-number': clue.number, 'data-clue-direction': clue.direction });
            this.drawClue(clue, item);
            item.clue = clue;
            this.clueListItems.push(item);
            list.appendChild(item);
        });
        section.appendChild(list);
        return section;
    }
    drawClue(clue, container, showDirection) {
        container.innerText = clue.text;
        let label = this.html('label');
        label.innerText = clue.label + (showDirection ? `${clue.direction[0]}` : '');
        container.insertBefore(label, container.firstChild);
        if (clue.enumeration) container.appendChild(this.createClueEnumerationSpan(clue));
    }

    drawButtons() {
        const checkClueButton = this.html('button', { 'id': 'check-clue-button' }, "Check clue");
        const clearClueButton = this.html('button', { 'id': 'clear-clue-button' }, "Clear clue");
        const cheatClueButton = this.html('button', { 'id': 'cheat-clue-button' }, "Cheat clue");
        const clueButtonContainer = this.html('div', { 'id': 'clue-buttons' });
        clueButtonContainer.appendChild(checkClueButton);
        clueButtonContainer.appendChild(clearClueButton);
        clueButtonContainer.appendChild(cheatClueButton);

        const checkGridButton = this.html('button', { 'id': 'check-grid-button' }, "Check grid");
        const clearGridButton = this.html('button', { 'id': 'clear-grid-button' }, "Clear grid");
        const cheatGridButton = this.html('button', { 'id': 'cheat-grid-button' }, "Cheat grid");
        const gridButtonContainer = this.html('div', { 'id': 'grid-buttons' });
        gridButtonContainer.appendChild(checkGridButton);
        gridButtonContainer.appendChild(clearGridButton);
        gridButtonContainer.appendChild(cheatGridButton);

        this.buttons.push(checkClueButton);
        this.buttons.push(clearClueButton);
        this.buttons.push(cheatClueButton);
        this.buttons.push(checkGridButton);
        this.buttons.push(clearGridButton);
        this.buttons.push(cheatGridButton);

        const buttonBar = this.html('div', { 'id': 'buttons' });
        buttonBar.appendChild(clueButtonContainer);
        buttonBar.appendChild(gridButtonContainer);
        return buttonBar;
    }

    render(puzzle) {

        this.loadPuzzleStateFromCookie(puzzle);

        const div = this.html('div', { 'class': 'ipuzzler' });
        this.dom.appendChild(div);

        const css = this.html('link', { 'type': 'text/css', 'href': 'css/ipuzzler.css', 'rel': 'stylesheet' });
        div.appendChild(css);

        this.grid = this.html('div', { 'class': 'puzzle-grid' });
        this.grid.style.gridTemplate = `repeat(${puzzle.height}, 1fr) / repeat(${puzzle.width}, 1fr)`;

        let puzzleGridWrapper = this.html('div');
        this.aboveClueBar = this.html('div', { 'class': 'clue-bar', 'id': 'above-clue-bar' });
        this.belowClueBar = this.html('div', { 'class': 'clue-bar', 'id': 'below-clue-bar' });

        puzzleGridWrapper.appendChild(this.aboveClueBar);
        puzzleGridWrapper.appendChild(this.grid);
        puzzleGridWrapper.appendChild(this.belowClueBar);
        puzzleGridWrapper.appendChild(this.drawButtons());

        div.appendChild(puzzleGridWrapper);

        this.spans = puzzle.cells.map((cells, row) => cells.map((cell, col) => {
            let span = this.createCellSpan(cell, row, col);
            this.grid.appendChild(span);
            return span;
        }));

        div.appendChild(this.createClueList(puzzle, "Across"));
        div.appendChild(this.createClueList(puzzle, "Down"));
    }

    resize(puzzle) {
        let gridSize = Math.min(this.grid.offsetWidth, this.grid.offsetHeight);
        this.recalculateFontSizes(gridSize, puzzle);
    }
} 
