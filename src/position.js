export class Position {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    isInside(grid) {
        if (this.row < 0 || this.row >= grid.length) return (false);
        if (this.col < 0 || this.col >= grid[this.row].length) return (false);
        return (true);
    }

    increment(direction) {
        switch (direction) {
            case 'down':
                return new Position(this.row + 1, this.col);
            case 'across':
                return new Position(this.row, this.col + 1);
        }
    }
}