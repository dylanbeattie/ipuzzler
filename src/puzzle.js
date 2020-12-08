export class Clue {
    constructor(ipuzClueData, direction) {
        this.direction = direction;
        this.number = parseInt(ipuzClueData.number);
        this.text = ipuzClueData.clue;
        this.enumeration = ipuzClueData.enumeration;
        this.cells = [];
    }
}

export class Position {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    isInside(grid) {
        if (this.row < 0 || this.row >= grid.length) return(false);
        if (this.col < 0 || this.col >= grid[this.row].length) return(false);
        return(true);
    }
    increment(direction) {
        switch(direction) { 
            case 'down': return new Position(this.row + 1, this.col);
            case 'across': return new Position(this.row, this.col + 1);
        }
    }
}

export class Cell {
    constructor(ipuzCellData, row, col) {
        this.style = "";
        this.position = new Position(row, col);
        this.previous = {};
        this.next = {};
        this.clues = [];
        if (typeof(ipuzCellData.cell) === "number") {
            this.number = ipuzCellData.cell;
        } else if (typeof(ipuzCellData) === "number") {
            this.number = ipuzCellData;
        } else {
            this.number = NaN;
        }
        if (ipuzCellData.style) {
            switch(ipuzCellData.style.barred) {
                case "T": this.style = "barred-top"; break;
                case "L": this.style = "barred-left"; break;
                case "TL": this.style = "barred-top-left"; break;
            }
        } else if (ipuzCellData == "#") {
            this.style = "block";
        }
    }
    isEndOfRange(direction) {
        if (this.style == "block") return(true);
        if (direction == "across" && this.previous.across && /left/.test(this.style)) return(true);
        if (direction == "down" && this.previous.down && /top/.test(this.style)) return(true);
        return(false);
    }
 }

export class Puzzle {
    constructor(cells, clues) {
        this.cells = cells;
        this.clues = clues;
    }
    setValue(x,y,value) {
        this.cells[y][x].value = value;
    }

}