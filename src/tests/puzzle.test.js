import {Parser} from "../parser";
const fs = require('fs');
const { test, expect } = require('@jest/globals');

function readPuzzle(filename) {
    let json = fs.readFileSync(`${__dirname}/fixtures/${filename}`, "utf8");
    let ipuz = JSON.parse(json);
    let puzzle = Parser.parse(ipuz);
    return (puzzle);
}


describe('switch puzzle direction works', () => {
    test('when no direction is set', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        expect(puzzle.direction).toBe("across");
        puzzle.switchDirection();
        expect(puzzle.direction).toBe("down");
        puzzle.switchDirection();
        expect(puzzle.direction).toBe("across");
    });
});

describe('puzzle exposes direction based on cells', () => {
    test('for 3x3 puzzle', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        expect(puzzle.width).toBe(3);
        expect(puzzle.height).toBe(3);
    });

    test('for 3x5 puzzle', () => {
        let puzzle = readPuzzle('3x5-cryptic.ipuz');
        expect(puzzle.width).toBe(3);
        expect(puzzle.height).toBe(5);
    });
    test('for 5x3 puzzle', () => {
        let puzzle = readPuzzle('5x3-cryptic.ipuz');
        expect(puzzle.width).toBe(5);
        expect(puzzle.height).toBe(3);
    });
})

describe('when setting puzzle cell focus', () => {
    test('focused cell takes focus', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setFocus(0,0);
        expect(puzzle.focusedCell.position.row).toBe(0);
        expect(puzzle.focusedCell.position.col).toBe(0);
    });
    test('focused clue matches focused cell', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setFocus(0,0);
        expect(puzzle.focusedClue.number).toBe(1);
        expect(puzzle.focusedClue.direction).toBe("across");
    });
    test('focused clue matches focused cell', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.switchDirection();
        puzzle.setFocus(0,0);
        expect(puzzle.focusedClue.number).toBe(1);
        expect(puzzle.focusedClue.direction).toBe("down");
    })
    test('switches direction when focused cell is bidirectional', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setFocus(0,0);
        expect(puzzle.focusedClue.direction).toBe("across");
        puzzle.setFocus(0,0);
        expect(puzzle.focusedClue.direction).toBe("down");
    });
})


