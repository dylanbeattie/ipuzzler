import {Position} from "../position";

const fs = require('fs');
const { test, expect } = require('@jest/globals');
import {Cell} from "../cell";

describe('hasInput tests', () => {
    const cases = [
        ["block", false],
        ["blank", false],
        ["barred-left", true],
        ["barred-top", true],
        ["barred-top barred-left", true],
        [null, true],
        ["", true],
    ];

    test.each(cases)("style %p returns %p for hasInput", (style, expected) => {
        let cell = new Cell(0);
        cell.style = style;
        expect(cell.hasInput).toBe(expected);
    });
});

describe('insideness tests', () => {
    test('empty grid', () => {
        let cells = [];
        expect(new Position(0, 0).isInside(cells)).toBe(false);
        expect(new Position(1, 0).isInside(cells)).toBe(false);
        expect(new Position(0, 1).isInside(cells)).toBe(false);
        expect(new Position(1, 1).isInside(cells)).toBe(false);
    });

    test('1x1 grid', () => {
        let cells = [
            [1]
        ];
        expect(new Position(-1, -1).isInside(cells)).toBe(false);
        expect(new Position(-1, 0).isInside(cells)).toBe(false);
        expect(new Position(0, -1).isInside(cells)).toBe(false);
        expect(new Position(0, 0).isInside(cells)).toBe(true);
        expect(new Position(1, 0).isInside(cells)).toBe(false);
        expect(new Position(0, 1).isInside(cells)).toBe(false);
        expect(new Position(1, 1).isInside(cells)).toBe(false);
    });

    test('2x2 grid', () => {
        let cells = [
            [1, 2],
            [3, 4]
        ];
        expect(new Position(-1, -1).isInside(cells)).toBe(false);
        expect(new Position(-1, 0).isInside(cells)).toBe(false);
        expect(new Position(0, -1).isInside(cells)).toBe(false);

        expect(new Position(0, 0).isInside(cells)).toBe(true);
        expect(new Position(1, 0).isInside(cells)).toBe(true);
        expect(new Position(0, 1).isInside(cells)).toBe(true);
        expect(new Position(1, 1).isInside(cells)).toBe(true);

        expect(new Position(1, 2).isInside(cells)).toBe(false);
        expect(new Position(2, 1).isInside(cells)).toBe(false);
        expect(new Position(1, 2).isInside(cells)).toBe(false);

    });
});