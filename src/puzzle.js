export class Puzzle {
    constructor(cells, clues) {
        this.cells = cells;
        this.cells.forEach(cell => cell.puzzle = this);
        this.clues = clues;
        this.focusedCell = null;
        this.direction = 'across';
    }
    /** Returns all the clues for this puzzle in a single array. Across, then down. Array is zero-based and array indexes do not match clue numbers. */
    get allClues() {
        return this.clues.across.concat(this.clues.down).filter(clue => clue);
    }

    switchDirection() {
        return (this.direction == 'across' ? this.direction = 'down' : this.direction = 'across');
    }

    get width() { return this.cells[0].length; }
    get height() { return this.cells.length }

    setFocus(row,col) {
        let cell = this.cells[row][col]
        if (this.focusedCell == cell) {
            if (cell.isBirectional) this.switchDirection();
        } else {
            this.focusedCell = cell;
            if (! cell.clues[this.direction]) this.switchDirection();
        }
        this.focusedClue = cell.clues[this.direction];
        this.cells.flat().forEach(cell => cell.clearHighlight());
        this.focusedClue.addHighlight();
    }

    setFocusToCell(cell) {
        if (cell && cell.hasInput) {
            this.focusedCell = cell;
            this.focusedClue = (cell.clues[this.direction] || cell.clues[this.switchDirection()]);
            this.cells.flat().forEach(cell => cell.clearHighlight());
            this.focusedClue.addHighlight();
        }
    }

    getCell(row, col) {
        if (row < 0 || row >= this.cells.length) return null;
        if (col < 0 || col >= this.cells[row].length) return null;
        return (this.cells[row][col]);
    }

    moveFocus(direction) {
        let nextCell;
        let pos = this.focusedCell?.position;
        if (!pos) return;
        switch (direction) {
            case "up": nextCell = this.getCell(pos.row - 1, pos.col);break;
            case "down": nextCell = this.getCell(pos.row + 1, pos.col);break;
            case "left": nextCell = this.getCell(pos.row, pos.col - 1);break;
            case "right": nextCell = this.getCell(pos.row, pos.col + 1);break;
        }
        this.setFocusToCell(nextCell);
    }
}