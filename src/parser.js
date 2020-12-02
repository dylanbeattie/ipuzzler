import { Puzzle, Cell, Clue } from './puzzle.js';

export class Parser {
    static parse(ipuzData) {
        let puzzle = new Puzzle();
        puzzle.clues = {
            across: ipuzData.clues.Across.map(c => new Clue(c.number, c.clue, c.enumerations)),
            down: ipuzData.clues.Down.map(c => new Clue(c.number, c.clue, c.enumerations))
        };
        puzzle.cells = ipuzData.puzzle.map((row, y) => row.map((cell, x) => new Cell()));
        return(puzzle);
    }
}