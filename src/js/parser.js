import { Puzzle } from './puzzle.js';
import { Clue } from "./clue";
import { Cell } from "./cell";

export class Parser {
    static parse(ipuzData, uri, submitUrl) {

        let cells = ipuzData.puzzle.map((ipuzCells, row) => ipuzCells.map((ipuzCell, col) => new Cell(ipuzCell, row, col)));

        let hasSolution = Parser.attachSolutions(cells, ipuzData.solution);

        let clueKeys = Object.keys(ipuzData.clues);

        // Internationalized puzzles will have JSON keys like { "clues" : "Across:Orizzontali" : [] } }
        let acrossKey = clueKeys.find(key => /^across/i.test(key));
        let downKey = clueKeys.find(key => /^down/i.test(key));

        let acrossData = ipuzData.clues[acrossKey];
        let downData = ipuzData.clues[downKey];

        let cluesFromAcross = (Array.isArray(acrossData) ? acrossData : []);
        cluesFromAcross = cluesFromAcross.map(c => new Clue(c, "across").toClueList()).flat();

        let cluesFromDown = (Array.isArray(downData) ? downData : []);
        cluesFromDown = cluesFromDown.map(c => new Clue(c, "down").toClueList()).flat();

        const clues = { across: [], down: [] };
        cluesFromAcross.concat(cluesFromDown).forEach(clue => {
            let cell = Parser.findCellForClue(cells, clue);
            if (cell) {
                clue.position = cell.position;
                clue.cells = Parser.findCellList(cells, clue.position, clue.direction);
                clue.cells.forEach(cell => cell.clues[clue.direction] = clue);
                clues[clue.direction][clue.number] = clue;
            }
        });
        clues.across.heading = (acrossKey.split(":")[1] ?? "Across");
        clues.down.heading = (downKey.split(":")[1] ?? "Down");

        return new Puzzle(cells, clues, uri, hasSolution, submitUrl);
    }

    static attachSolutions(cells, solution) {
        if (!solution) return false;
        cells.forEach((line, row) => line.forEach((cell, col) => {
            if (solution[row] && solution[row][col]) {
                let value = (solution[row][col].value || solution[row][col]);
                if (value.toUpperCase && /[A-Z]/i.test(value)) cell.solution = value.toUpperCase();
            }
        }));
        return true;
    }

    static findCellForClue(cells, clue) {
        return cells.flat().find(cell => cell.number == clue.number);
    }

    static findCellList(cells, position, direction, previousCell) {
        if (!position.isInside(cells)) return [];
        var cell = cells[position.row][position.col];
        cell.previous[direction] = previousCell;
        if (cell.isEndOfRange(direction)) return [];
        if (previousCell) previousCell.next[direction] = cell;
        return ([cell].concat(Parser.findCellList(cells, position.increment(direction), direction, cell)));
    };
}