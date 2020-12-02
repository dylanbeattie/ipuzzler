export class Clue {
    constructor(number, text, enumeration) {
        this.number = number;
        this.text = text;
        this.enumeration = enumeration;
    }
}

export class Cell { }

export class Puzzle {
    constructor() {
        this.clues = {};
        this.cells = [];
    }
    setValue(x,y,value) {
        this.cells[y][x].value = value;
    }
}