const fs = require('fs');
const { test, expect } = require('@jest/globals');
import { Parser } from './parser.js';

function readPuzzle(filename) {
    let json = fs.readFileSync(`${__dirname}/fixtures/${filename}`);
    let ipuz = JSON.parse(json);
    let puzzle = Parser.parse(ipuz);
    return (puzzle);
}

describe('parsing 3x3 puzzle', () => {
    let puzzle = readPuzzle('3x3.ipuz');
    test('parses cells correctly', () => {
        expect(puzzle.cells.length).toBe(3);
        puzzle.cells.forEach(row => expect(row.length).toBe(3));
    });

    test('reads Across clues', () => {
        expect(puzzle.clues.across.length).toBe(2);
        expect(puzzle.clues.across[0].text).toBe("Leatherworking tool");
        expect(puzzle.clues.across[1].text).toBe("Church bench");
    });

    test('reads Down clues', () => {
        expect(puzzle.clues.down.length).toBe(2);
        expect(puzzle.clues.down[0].text).toBe("Unit of current");
        expect(puzzle.clues.down[1].text).toBe("Rules");
    });
});

