export class Puzzle {
    constructor(cells, clues) {
        this.cells = cells;
        this.clues = clues;
        this.focusedCell = null;
        this.direction = 'across';
    }
    switchDirection() {
        if (this.direction == 'across') return(this.direction = 'down');
        return(this.direction = 'across');
    }

    get width() { return this.cells[0].length; }
    get height() { return this.cells.length }

    setFocus(row,col) {
        let cell = this.cells[row][col]
        this.focusedCell = cell;
        this.focusedClue = (cell.clues[this.direction] || cell.clues[this.switchDirection()]);
        this.cells.flat().forEach(cell => cell.clearHighlight());
        this.focusedClue.addHighlight();
    }
}