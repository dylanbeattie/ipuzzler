export class Clue {
    constructor(ipuzClueData) {
        this.number = parseInt(ipuzClueData.number);
        this.text = ipuzClueData.clue;
        this.enumeration = ipuzClueData.enumeration;
        this.cells = [];
    }
}

export class Cell {
    constructor(ipuzCellData) {
        this.style = "";
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
        if (direction == "across" && /left/.test(this.style)) return(true);
        if (direction == "down" && /top/.test(this.style)) return(true);
        return(false);
    }
 }

export class Puzzle {
    constructor() {
        this.clues = {};
        this.cells = [];
    }
    setValue(x,y,value) {
        this.cells[y][x].value = value;
    }
}