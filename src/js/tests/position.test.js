import {Position} from "../position";

import fs from 'fs';
import { describe, test, expect } from 'vitest';
import {Cell} from "../cell";

describe('incrementing position', () => {
    let position = new Position(0, 0);
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