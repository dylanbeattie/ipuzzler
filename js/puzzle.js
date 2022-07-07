export class Puzzle {
    constructor(cells, clues, uri, hasSolution, submitUrl) {
        this.uri = uri || "";
        this.cells = cells;
        this.allCells.forEach(cell => cell.puzzle = this);
        this.clues = clues;
        this.focusedCell = null;
        this.direction = 'across';
        this.acrossHeading = "Across";
        this.downHeading = "Down";
        this.hasSolution = hasSolution;
        this.submitUrl = submitUrl ?? "";
        console.log("SUBMIT" + this.submitUrl);
    }

    isClueBirectional(number) {
        return (this.clues.across[number] && this.clues.down[number]);
    }

    /** Returns all the clues for this puzzle in a single array. Across, then down. Array is zero-based and array indexes do not match clue numbers. */
    get allClues() {
        return this.clues.across.concat(this.clues.down).filter(clue => clue);
    }

    get allCells() {
        return this.cells.flat();
    }

    switchDirection() {
        return (this.direction == 'across' ? this.direction = 'down' : this.direction = 'across');
    }

    get width() { return this.cells[0].length; }
    get height() { return this.cells.length }
    get cookieName() { return this.uri.replace(/[^a-z0-9]+/ig, '-'); }

    getState() {
        return (this.cells.map(row => row.map(cell => (cell.value || "_")).join("")).join(""));
    }

    setState(cookie) {
        let values = cookie.split("");
        let inputs = this.cells.flat();
        values.forEach((value, index) => inputs[index].setValue(value != "_" ? value : ""));
    }

    setFocus(row, col, toggleDirection) {
        this.setFocusToCell(this.cells[row][col], toggleDirection);
    }

    focusClue(clueNumber, clueDirection) {
        let clue = this.clues[clueDirection][clueNumber];
        this.setFocusToClue(clue);
    }

    setCellValue(value) {
        if (this.focusedCell) {
            this.focusedCell.setValue(value);
            if (value) this.advanceFocus(this.direction);
        }
    }
    setFocusToClue(clue) {
        this.direction = clue.direction;
        this.setFocusToCell(clue.cells[0]);
    }

    setFocusToCell(cell, toggleDirection) {
        if (cell && cell.hasInput) {
            if (this.focusedCell == cell) {
                if (cell.isBirectional && toggleDirection) this.switchDirection();
            } else {
                this.focusedCell = cell;
                if (!cell.clues[this.direction]) this.switchDirection();
            }
            this.focusedCell = cell;
            this.focusedClue = cell.clues[this.direction];
            this.cells.flat().forEach(cell => cell.clearHighlight());
            this.allClues.forEach(clue => clue.clearHighlight());
            this.focusedClue.addHighlight();
        }
    }

    getCell(position) {
        if (position.isInside(this.cells)) return (this.cells[position.row][position.col]);
        return null;
    }

    advanceFocus(direction) {
        let clue = this.focusedCell.clues[direction];
        let index = clue.cells.indexOf(this.focusedCell) + 1;
        if (index < clue.cells.length) {
            this.setFocusToCell(clue.cells[index])
        } else if (clue.next) {
            this.setFocusToClue(clue.next);
        }
    }

    retreatFocus(direction) {
        let clue = this.focusedCell.clues[direction];
        if (clue) {
            let index = clue.cells.indexOf(this.focusedCell) - 1;
            if (index >= 0) this.setFocusToCell(clue.cells[index]);
        }
    }

    home() {
        this.setFocusToCell(this.focusedClue.cells[0]);
    }

    end() {
        this.setFocusToCell(this.focusedClue.cells[this.focusedClue.cells.length - 1]);
    }

    backspace() {
        this.setCellValue("");
        this.retreatFocus(this.direction);
    }

    clearFocus() {
        this.focusedCell = null;
        this.focusedClue = null;
        this.cells.flat().forEach(cell => cell.clearHighlight());
        this.allClues.forEach(clue => clue.clearHighlight());
    }

    moveFocus(direction) {
        let position = this.focusedCell?.position;
        if (!position) return;
        let nextCell = this.getCell(position.increment(direction));
        this.setFocusToCell(nextCell);
    }

    checkClue() { if (this.focusedClue) this.focusedClue.check(); }
    clearClue() { if (this.focusedClue) this.focusedClue.clear(); }
    cheatClue() { if (this.focusedClue) this.focusedClue.cheat(); }
    checkGrid() { this.allCells.forEach(cell => cell.check()); }
    clearGrid() { this.allCells.forEach(cell => cell.clear()); }
    cheatGrid() { this.allCells.forEach(cell => cell.cheat()); }

    submitGrid(form) {
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookie = decodedCookie.split(/; */).map(token => token.split('=')).find(pair => pair[0] == this.cookieName);
        if (cookie && cookie.length > 1) {
            // validate that entered all boxes
            if (this.allCells.some(e => e.style === "" && e.value === "")) {
                alert("You are missing some answers");
            }
            else {
                form.elements["answers"].value = cookie[1];
                form.submit();
            }
        }
    }
}