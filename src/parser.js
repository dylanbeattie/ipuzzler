import { Puzzle, Cell, Clue } from './puzzle.js';

export class Parser {
    static parse(ipuzData) {
        let puzzle = new Puzzle();
        puzzle.clues = {
            across: [], 
            down: []
        };
        ipuzData.clues.Across.forEach(c => puzzle.clues.across[c.number] = new Clue(c));
        ipuzData.clues.Down.forEach(c => puzzle.clues.down[c.number] = new Clue(c));
        puzzle.cells = ipuzData.puzzle.map((row, y) => row.map((cell, x) => new Cell(cell)));
        return(puzzle);
    }
}