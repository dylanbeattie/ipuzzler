const fs = require('fs');
const { test, expect } = require('@jest/globals');
import { Cell, Position } from './puzzle.js';

describe('incrementing position', () => {
    let position = new Position(0,0);
    test('horizontally', () => {
        let incremented = position.increment('across');
        expect(incremented).not.toEqual(position);
        expect(incremented.row).toBe(0);
        expect(incremented.col).toBe(1);
    });

    test('vertically', () => {
        let incremented = position.increment('down');
        expect(incremented).not.toEqual(position);
        expect(incremented.row).toBe(1);
        expect(incremented.col).toBe(0);
    });
});

describe('insideness tests', () => {
    test('empty grid', () => {
        let cells = [];
        expect(new Position(0,0).isInside(cells)).toBe(false);
        expect(new Position(1,0).isInside(cells)).toBe(false);
        expect(new Position(0,1).isInside(cells)).toBe(false);
        expect(new Position(1,1).isInside(cells)).toBe(false);
    });

    test('1x1 grid', () => {
        let cells = [ 
            [ 1 ]
        ];
        expect(new Position(-1,-1).isInside(cells)).toBe(false);
        expect(new Position(-1,0).isInside(cells)).toBe(false);
        expect(new Position(0,-1).isInside(cells)).toBe(false);
        expect(new Position(0,0).isInside(cells)).toBe(true);
        expect(new Position(1,0).isInside(cells)).toBe(false);
        expect(new Position(0,1).isInside(cells)).toBe(false);
        expect(new Position(1,1).isInside(cells)).toBe(false);
    });

    test('2x2 grid', () => {
        let cells = [ 
            [ 1, 2 ],
            [ 3, 4 ]
        ];
        expect(new Position(-1,-1).isInside(cells)).toBe(false);
        expect(new Position(-1,0).isInside(cells)).toBe(false);
        expect(new Position(0,-1).isInside(cells)).toBe(false);

        expect(new Position(0,0).isInside(cells)).toBe(true);
        expect(new Position(1,0).isInside(cells)).toBe(true);
        expect(new Position(0,1).isInside(cells)).toBe(true);
        expect(new Position(1,1).isInside(cells)).toBe(true);

        expect(new Position(1,2).isInside(cells)).toBe(false);
        expect(new Position(2,1).isInside(cells)).toBe(false);
        expect(new Position(1,2).isInside(cells)).toBe(false);
        
    });
});