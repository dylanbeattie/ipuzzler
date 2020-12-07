const fs = require('fs');
const { test, expect } = require('@jest/globals');
import { Parser } from './parser.js';
import { Cell } from './puzzle.js';

function readPuzzle(filename) {
    let json = fs.readFileSync(`${__dirname}/fixtures/${filename}`);
    let ipuz = JSON.parse(json);
    let puzzle = Parser.parse(ipuz);
    return (puzzle);
}

describe('parsing 3x3 barred puzzle', () => {
    let puzzle = readPuzzle('3x3-barred.ipuz');
    test('parses barred cells correctly', () => {
        let expected = [
            ["", "", ""],
            ["", "barred-left", "barred-top-left"],
            ["barred-top", "", ""]
        ];
        puzzle.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                expect(cell.style).toEqual(expected[y][x]);
            });
        });
    });

    test('parses numbers correctly', () => {
        let expected = [
            [1, 2, 0],
            [0, 0, 3],
            [4, 0, 0]
        ];
        puzzle.cells.forEach((row, y) => row.forEach((cell, x) => expect(cell.number).toEqual(expected[y][x])))
    });
})

describe('parsing 3x3 puzzle', () => {
    let puzzle = readPuzzle('3x3.ipuz');

    test('parses numbers correctly', () => {
        let expected = [
            [1, 0, 2],
            [0, NaN, 0],
            [3, 0, 0]
        ];
        puzzle.cells.forEach((row, y) => row.forEach((cell, x) => expect(cell.number).toEqual(expected[y][x])))
    });

    test('parses blocks correctly', () => {
        let expected = [
            ["", "", ""],
            ["", "block", ""],
            ["", "", ""]
        ];
        puzzle.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                expect(cell.style).toEqual(expected[y][x]);
            });
        });
    });

    test('parses cells correctly', () => {
        expect(puzzle.cells.length).toBe(3);
        puzzle.cells.forEach(row => expect(row.length).toBe(3));
    });

    test('reads Across clues', () => {
        expect(puzzle.clues.across.filter(c => c).length).toBe(2);
        expect(puzzle.clues.across[1].text).toBe("Leatherworking tool");
        expect(puzzle.clues.across[3].text).toBe("Church bench");
    });

    test('reads Down clues', () => {
        expect(puzzle.clues.down.filter(c => c).length).toBe(2);
        expect(puzzle.clues.down[1].text).toBe("Unit of current");
        expect(puzzle.clues.down[2].text).toBe("Rules");
    });
});

describe('cell indicates end of a range', () => {
    test('when it is a block', () => {
        let cell = new Cell('#');
        expect(cell.isEndOfRange('across')).toBe(true);
        expect(cell.isEndOfRange('down')).toBe(true);
    });

    test('when it is a top and left barred cell', () => {
        let cell = new Cell({ "style" : { "barred" : "TL" }, "cell": 0 });
        expect(cell.isEndOfRange('across')).toBe(true);
        expect(cell.isEndOfRange('down')).toBe(true);
    });

    test('when it is a top barred cell', () => {
        let cell = new Cell({ "style" : { "barred" : "T" }, "cell": 0 });
        expect(cell.isEndOfRange('across')).toBe(false);
        expect(cell.isEndOfRange('down')).toBe(true);
    });
    
    test('when it is a left barred cell', () => {
        let cell = new Cell({ "style" : { "barred" : "L" }, "cell": 0 });
        expect(cell.isEndOfRange('across')).toBe(true);
        expect(cell.isEndOfRange('down')).toBe(false);
    });
});

describe('parsing clue/cell relationships', () => {
    let puzzle = readPuzzle('5x5-cell-ranges.ipuz');
    
    function range(clueNumber, direction, row, col, length) {
        return () => {
            let clue = puzzle.clues[direction][clueNumber];
            expect(clue.cells.length).toBe(length);
            for(let i = 0; i < length; i++) {
                expect(clue.cells[i].row).toBe(row + (direction == 'across' ? 0 : i));
                expect(clue.cells[i].col).toBe(col + (direction == 'down' ? 0 : i));
            }
        }
    }

    test('1 across', range(1, 'across', 0, 0, 5));
    test('5 across', range(5, 'across', 2, 0, 5));
    test('7 across', range(7, 'across', 3, 1, 3));
    test('8 across', range(8, 'across', 4, 0, 5));

    test('1 down', range(1, 'down', 0, 0, 3));
    test('2 down', range(2, 'down', 0, 2, 5));
    test('3 down', range(1, 'down', 0, 3, 4));
    test('4 down', range(4, 'down', 1, 1, 4));
    test('6 down', range(6, 'down', 4, 2, 3));

});