export class Puzzle {
    constructor(cells, clues) {
        this.cells = cells;
        this.cells.forEach(cell => cell.puzzle = this);
        this.clues = clues;
        this.focusedCell = null;
        this.direction = 'across';
    }

    isClueBirectional(number) {
        return(this.clues.across[number] && this.clues.down[number]);
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

    setFocus(row, col) {
        this.setFocusToCell(this.cells[row][col]);
    }

    focusClue(clueNumber, clueDirection) {
        let clue = this.clues[clueDirection][clueNumber];
        this.setFocusToClue(clue);
    }

    setCellValue(value) {
        if (this.focusedCell) {
            this.focusedCell.setValue(value);
            this.advanceFocus(this.direction);
        }
    }
    setFocusToClue(clue) {
        this.direction = clue.direction;
        this.setFocusToCell(clue.cells[0]);
    }

    setFocusToCell(cell) {
        if (cell && cell.hasInput) {
            if (this.focusedCell == cell) {
                if (cell.isBirectional) this.switchDirection();
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

    getCell(row, col) {
        if (row < 0 || row >= this.cells.length) return null;
        if (col < 0 || col >= this.cells[row].length) return null;
        return (this.cells[row][col]);
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

    moveFocus(direction) {
        let nextCell;
        let pos = this.focusedCell?.position;
        if (!pos) return;
        switch (direction) {
            case "up": nextCell = this.getCell(pos.row - 1, pos.col); break;
            case "down": nextCell = this.getCell(pos.row + 1, pos.col); break;
            case "left": nextCell = this.getCell(pos.row, pos.col - 1); break;
            case "right": nextCell = this.getCell(pos.row, pos.col + 1); break;
        }
        this.setFocusToCell(nextCell);
    }
}