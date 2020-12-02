export class Clue {
    constructor(number, text, enumeration) {
        this.number = number;
        this.text = text;
        this.enumeration = enumeration;
    }
}

export class Cell {
    constructor() {
        
    }
}

export class Puzzle {
    constructor() {
        this.clues = {};
        this.cells = [];
    }
}