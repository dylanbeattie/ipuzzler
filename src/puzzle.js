export class Puzzle {
    constructor(cells, clues) {
        this.cells = cells;
        this.clues = clues;
        this.focusedCell = null;
        this.direction = 'across';
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
}