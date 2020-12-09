export class Clue {
    constructor(ipuzClueData, direction) {
        this.direction = direction;
        this.number = parseInt(ipuzClueData.number);
        this.text = ipuzClueData.clue;
        this.enumeration = ipuzClueData.enumeration;
        this.cells = [];
        this.continuations = [];
        if (ipuzClueData.continued && ipuzClueData.continued.map) {
            this.continuations = ipuzClueData.continued.map(c => { 
                let continuation = new Clue(c, c.direction.toLowerCase());
                continuation.text = `See ${ipuzClueData.number}`;                
                if (continuation.direction != this.direction) continuation.text += " " + this.direction;
                continuation.root = this; 
            return continuation });
            this.next = this.continuations[0];
            for (var i = 0; i < this.continuations.length - 1; i++) this.continuations[i].next = this.continuations[i + 1];
        }
    }

    toClueList() {
        return [this].concat(this.continuations);
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
        if (ipuzCellData === null) {
            this.style = "blank";
        } else {
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
                    case "TL": this.style = "barred-top barred-left"; break;
                }
            } else if (ipuzCellData == "#") {
                this.style = "block";
            }
        }
    }
    get hasInput() {
        return ! /bl(an|oc)k/.test(this.style);
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

    get width() { return this.cells[0].length; }
    get height() { return this.cells.length }

    setValue(x,y,value) {
        this.cells[y][x].value = value;
    }

}