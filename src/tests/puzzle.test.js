import { Parser } from "../parser";
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

describe('puzzle renders with correct dimensions', () => {
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
});

describe('when focusing a cell with linked clues', () => {
    /*************
     * A T T I C *
     * S # R # L *
     * S L I C E *
     * E # C # A *
     * T O K E N *
     *************
     * 
     * Across:
     * 1 See 5
     * 4 See 2 Down
     * 5/3/1a Test clue for "token clean attic"
     * 
     * Down:
     * 1 See 2
     * 2/4/1d Test clue for "trick slice asset"
     * 3 See 5 across
     */

    let puzzle = readPuzzle('5x5-linked-clues.ipuz');
    test('when focusing cell linked with root clue', () => {
        let expected = [
            1, 1, 1, 1, 1,
            0, 0, 0, 0, 1,
            0, 0, 0, 0, 1,
            0, 0, 0, 0, 1,
            1, 1, 1, 1, 1
        ];
        puzzle.setFocus(0, 1); // T in ATTIC
        puzzle.cells.flat().forEach((cell, index) => expect(cell.isActive).toBe(!!expected[index]));
    });

    test('when focusing cell linked with root clue', () => {
        let expected = [
            1, 0, 1, 0, 0,
            1, 0, 1, 0, 0,
            1, 1, 1, 1, 1,
            1, 0, 1, 0, 0,
            1, 0, 1, 0, 0
        ];
        puzzle.setFocus(1, 0); // S in ASSET
        puzzle.cells.flat().forEach((cell, index) => expect(cell.isActive).toBe(!!expected[index]));
    });

});

describe('when setting puzzle cell focus', () => {
    test('focused cell takes focus', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setFocus(0, 0);
        expect(puzzle.focusedCell.position.row).toBe(0);
        expect(puzzle.focusedCell.position.col).toBe(0);
    });
    test('focused clue matches focused cell', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setFocus(0, 0);
        expect(puzzle.focusedClue.number).toBe(1);
        expect(puzzle.focusedClue.direction).toBe("across");
    });
    test('focused clue matches focused cell', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.switchDirection();
        puzzle.setFocus(0, 0);
        expect(puzzle.focusedClue.number).toBe(1);
        expect(puzzle.focusedClue.direction).toBe("down");
    })
    test('switches direction when focused cell is bidirectional', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setFocus(0, 0);
        expect(puzzle.focusedClue.direction).toBe("across");
        puzzle.setFocus(0, 0);
        expect(puzzle.focusedClue.direction).toBe("down");
    });

    describe('clue is highlighted for associated cell', () => {
        let cases = [
            ['3x3.ipuz', 1, 'across'],
            ['3x3.ipuz', 3, 'across'],
            ['3x3.ipuz', 1, 'down'],
            ['3x3.ipuz', 2, 'down'],
        ];
        test.each(cases)("for %p, clue %p %p", (filename, clueNumber, clueDirection) => {
            let puzzle = readPuzzle(filename);
            puzzle.focusClue(clueNumber, clueDirection);
            expect(puzzle.focusedClue.number).toBe(clueNumber);
            expect(puzzle.focusedClue.direction).toBe(clueDirection);
        });
    });

    describe('first cell of clue is highlighted even when clues are linked', () => {
        let cases = [
            ['5x5-linked-clues.ipuz', 1, 'across', { row: 0, col: 0 }],
            ['5x5-linked-clues.ipuz', 4, 'across', { row: 2, col: 0 }],
            ['5x5-linked-clues.ipuz', 5, 'across', { row: 4, col: 0 }],

            ['5x5-linked-clues.ipuz', 2, 'down', { row: 0, col: 2 }],
            ['5x5-linked-clues.ipuz', 3, 'down', { row: 0, col: 4 }],
            ['5x5-linked-clues.ipuz', 1, 'down', { row: 0, col: 0 }],
        ];

        test.each(cases)("for %p, clue %p %p", (filename, clueNumber, clueDirection, cell) => {
            let puzzle = readPuzzle(filename);
            puzzle.focusClue(clueNumber, clueDirection);
            expect(puzzle.focusedCell.position.row).toBe(cell.row);
            expect(puzzle.focusedCell.position.col).toBe(cell.col);
        });
    });
})


