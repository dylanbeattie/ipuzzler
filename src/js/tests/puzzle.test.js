import { executionAsyncId } from "async_hooks";
import { Parser } from "../parser";
import { Puzzle } from "../puzzle";
import fs from 'fs';
import { describe, test, expect, beforeEach } from 'vitest';

function readPuzzle(filename) {
    let json = fs.readFileSync(`${__dirname}/fixtures/${filename}`, "utf8");
    let ipuz = JSON.parse(json);
    let puzzle = Parser.parse(ipuz);
    return (puzzle);
}
describe('puzzle load/save state from cookies', () => {
    describe('puzzle creates cookie name correctly', () => {
        const cases = [
            ['3x3.ipuz', '3x3-ipuz'],
            ['https://example.com/puzzles/some_cryptic_puzzle.ipuz', 'https-example-com-puzzles-some-cryptic-puzzle-ipuz']
        ];
        test.each(cases)("when puzzle is %p", (uri, key) => {
            var puzzle = new Puzzle([], {}, uri);
            expect(puzzle.cookieName).toBe(key);
        });
    });
    describe('puzzle creates cookie value correctly', () => {
        test('for empty grid', () => {
            let puzzle = readPuzzle('3x3.ipuz');
            let cookie = puzzle.getState();
            expect(cookie).toBe("_________");
        });

        test('for full grid', () => {
            let puzzle = readPuzzle('3x3.ipuz');
            let values = [ ["A", "B", "C"], ["D", null, "E"], ["F", "G", "H"] ];
            values.forEach((line, row) => line.forEach((value, col) => {
                if (value) {
                    puzzle.setFocus(row, col);
                    puzzle.setCellValue(value);
                }
            }));
            let cookie = puzzle.getState();
            expect(cookie).toBe("ABCD_EFGH");
        });

        test('for semi-full grid', () => {
            let puzzle = readPuzzle('3x3.ipuz');
            let values = [ ["A", "b", null], ["d", null, "e"], [null, null, "h"] ];
            values.forEach((line, row) => line.forEach((value, col) => {
                if (value) {
                    puzzle.setFocus(row, col);
                    puzzle.setCellValue(value);
                }
            }));
            let cookie = puzzle.getState();
            expect(cookie).toBe("AB_D_E__H");
        });
    });

    describe('puzzle restores state from cookie value', () => {
        const cases = [
            "ABCD_FGHI",
            "_________",
            "A_CD_EF_H"
        ];
        test.each(cases)("when cookie is %p", cookie => {
            let puzzle = readPuzzle('3x3.ipuz');
            puzzle.setState(cookie);
            puzzle.cells.flat().forEach((cell, index) => {
                expect(cell.value).toBe(cookie[index] == "_" ? "" : cookie[index]);
            });
        });
    });
});

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

describe("pressing a key sets the cell value", () => {
    test('a', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setFocus(0, 0);
        expect(puzzle.cells[0][0].value).toBe("");
        puzzle.setCellValue("a");
        expect(puzzle.cells[0][0].value).toBe("A");
    });
});

describe('pressing Home key', () => {
    describe('on across clue', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        const cases = [0, 1, 2];
        test.each(cases)("when focus is (0,%p)", col => {
            puzzle.setFocus(0, col);
            puzzle.home();
            expect(puzzle.focusedCell.position.col).toBe(0);
        });
    });
    describe('on down clue', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.direction = "down";
        const cases = [0, 1, 2];
        test.each(cases)("when focus is (%p,0)", row => {
            puzzle.setFocus(row, 0);
            puzzle.home();
            expect(puzzle.focusedCell.position.row).toBe(0);
        });
    });
});

describe('pressing End key', () => {
    describe('on across clue', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        const cases = [0, 1, 2];
        test.each(cases)("when focus is (0,%p)", col => {
            puzzle.setFocus(0, col);
            puzzle.end();
            expect(puzzle.focusedCell.position.col).toBe(2);
        });
    });
    describe('on down clue', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.direction = "down";
        const cases = [0, 1, 2];
        test.each(cases)("when focus is (%p,0)", row => {
            puzzle.setFocus(row, 0);
            puzzle.end();
            expect(puzzle.focusedCell.position.row).toBe(2);
        });
    });
});


describe('pressing backspace', () => {
    describe('on across clue', () => {
        let puzzle;
        beforeEach(() => {
            puzzle = readPuzzle('3x3.ipuz');
            puzzle.setFocus(0, 0);
            puzzle.setCellValue("a");
            puzzle.setCellValue("b");
            puzzle.setCellValue("c");
        });
        test('moves focus to previous cell', () => {
            expect(puzzle.focusedCell.position.row).toBe(0);
            expect(puzzle.focusedCell.position.col).toBe(2);
            puzzle.backspace();
            expect(puzzle.focusedCell.position.row).toBe(0);
            expect(puzzle.focusedCell.position.col).toBe(1);
            puzzle.backspace();
            expect(puzzle.focusedCell.position.row).toBe(0);
            expect(puzzle.focusedCell.position.col).toBe(0);
            puzzle.backspace();
            expect(puzzle.focusedCell.position.row).toBe(0);
            expect(puzzle.focusedCell.position.col).toBe(0);
        });
        test('clears cell value', () => {
            expect(puzzle.cells[0][2].value).toBe("C");
            puzzle.backspace();
            expect(puzzle.cells[0][2].value).toBe("");
            puzzle.backspace();
            expect(puzzle.cells[0][1].value).toBe("");
            puzzle.backspace();
            expect(puzzle.cells[0][0].value).toBe("");
        });
    });
    describe('on down clue', () => {
        let puzzle;
        beforeEach(() => {
            puzzle = readPuzzle('3x3.ipuz');
            puzzle.setFocus(0, 0);
            puzzle.direction = "down";
            puzzle.setCellValue("a");
            puzzle.setCellValue("b");
            puzzle.setCellValue("c");
        });
        test('moves focus to previous cell', () => {
            expect(puzzle.focusedCell.position.row).toBe(2);
            expect(puzzle.focusedCell.position.col).toBe(0);
            puzzle.backspace();
            expect(puzzle.focusedCell.position.row).toBe(1);
            expect(puzzle.focusedCell.position.col).toBe(0);
            puzzle.backspace();
            expect(puzzle.focusedCell.position.row).toBe(0);
            expect(puzzle.focusedCell.position.col).toBe(0);
            puzzle.backspace();
            expect(puzzle.focusedCell.position.row).toBe(0);
            expect(puzzle.focusedCell.position.col).toBe(0);
        });
        test('clears cell value', () => {
            expect(puzzle.cells[2][0].value).toBe("C");
            puzzle.backspace();
            expect(puzzle.cells[2][0].value).toBe("");
            puzzle.backspace();
            expect(puzzle.cells[1][0].value).toBe("");
            puzzle.backspace();
            expect(puzzle.cells[0][0].value).toBe("");
        });
    });
})
test('clearing focus works', () => {
    let puzzle = readPuzzle('3x3.ipuz');
    expect(puzzle.cells[0][0].value).toBe("");
    puzzle.setFocus(0, 0);
    expect(puzzle.focusedCell).not.toBeNull();
    puzzle.clearFocus();
    expect(puzzle.focusedCell).toBeNull();
});

describe('pressing a letter key moves focus to next cell', () => {
    test('across', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        expect(puzzle.cells[0][0].value).toBe("");
        puzzle.setFocus(0, 0);
        puzzle.setCellValue("a");
        expect(puzzle.focusedCell.position.row).toBe(0);
        expect(puzzle.focusedCell.position.col).toBe(1);
    });

    test('down', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.direction = 'down';
        expect(puzzle.cells[0][0].value).toBe("");
        puzzle.setFocus(0, 0);
        puzzle.setCellValue("a");
        expect(puzzle.focusedCell.position.row).toBe(1);
        expect(puzzle.focusedCell.position.col).toBe(0);
    });

    test('when it is the last element of a linked clue', () => {
        let puzzle = readPuzzle('5x5-linked-clues.ipuz');
        puzzle.setFocus(0, 2);
        puzzle.direction = "down";
        "abcde".split("").forEach(value => puzzle.setCellValue(value));
        expect(puzzle.focusedCell.position.row).toBe(2);
        expect(puzzle.focusedCell.position.col).toBe(0);
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

/* 3x3.ipuz:
 * AWL
 * M#A
 * PEW
 */
describe('check across clue sets incorrect cells to blank', () => {
    const cases = [
        ["AWL___PEW", "AWL___PEW"],
        ["ARC___PEW", "A_____PEW"],
        ["ARC___XXX", "A_____XXX"],
        ["ARC___XYZ", "A_____XYZ"],
        ["ALL______", "A_L______"]
    ]
    test.each(cases)("%p", (supplied, expected) => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setState(supplied);
        puzzle.setFocus(0,0);
        puzzle.direction = "across";
        puzzle.checkClue();
        expect(puzzle.getState()).toBe(expected);
    });
});

describe('check down clue sets incorrect cells to blank', () => {
    const cases = [
        ["AWLM_APEW", "AWLM_APEW"],
        ["ARCL__PEW", "ARC___PEW"],
        ["ARCM__XXX", "ARCM___XX"],
        ["BRCA__DYZ", "_RC____YZ"]
    ];
    test.each(cases)("%p", (supplied, expected) => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setState(supplied);
        puzzle.direction = "down";
        puzzle.setFocus(0,0);
        puzzle.checkClue();
        expect(puzzle.getState()).toBe(expected);
    });
});

describe('check grid sets incorrect cells to blank', () => {
    const cases = [
        ["AWL___PEW", "AWL___PEW"],
        ["AWLM_APEW", "AWLM_APEW"],
        ["ARC___PEW", "A_____PEW"],
        ["XXXXXXXXX", "_________"]
    ];
    test.each(cases)("%p", (supplied, expected) => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setState(supplied);
        puzzle.setFocus(0,0);
        puzzle.direction = "across";
        puzzle.checkGrid();
        expect(puzzle.getState()).toBe(expected);
    });
});

describe('clear across clue clears clue', () => {
    const cases = [
        ["AWL___PEW", "______PEW"],
        ["ABCM_APEW", "___M_APEW"],
        ["BIGB_DCAT", "___B_DCAT"]
    ];
    test.each(cases)("%p", (supplied, expected) => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setState(supplied);
        puzzle.setFocus(0,0);
        puzzle.direction = "across";
        puzzle.clearClue();
        expect(puzzle.getState()).toBe(expected);
    });
});


describe('clear down clue clears clue', () => {
    const cases = [
        ["AWL___PEW", "_WL____EW"],
        ["_BCM_APEW", "_BC__A_EW"],
        ["BIGB_DCAT", "_IG__D_AT"]
    ];
    test.each(cases)("%p", (supplied, expected) => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setState(supplied);
        puzzle.direction = "down";
        puzzle.setFocus(0,0);
        puzzle.clearClue();
        expect(puzzle.getState()).toBe(expected);
    });
});

describe('clear grid clears grid', () => {
    const cases = [
        "AWLM_APEW",
        "ABCDEFGHI",
        "_________"
    ];
    test.each(cases)("%p", (supplied) => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setState(supplied);
        puzzle.clearGrid();
        expect(puzzle.getState()).toBe("_________");
    });
});

describe('cheat across clue reveals solution', () => {
    const cases = [
        ["______PEW", "AWL___PEW"],
        ["BOBM_APEW", "AWLM_APEW"],
        ["_________", "AWL______"]
    ];
    test.each(cases)("%p", (supplied, expected) => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setState(supplied);
        puzzle.setFocus(0,0);
        puzzle.direction = "across";
        puzzle.cheatClue();
        expect(puzzle.getState()).toBe(expected);
    });
});


describe('clear down clue clears clue', () => {
    const cases = [
        ["_________", "A__M__P__"],
        ["X__Y__Z__", "A__M__P__"],
        ["OWLO_AFEW", "AWLM_APEW"]
    ];
    test.each(cases)("%p", (supplied, expected) => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setState(supplied);
        puzzle.direction = "down";
        puzzle.setFocus(0,0);
        puzzle.cheatClue();
        expect(puzzle.getState()).toBe(expected);
    });
});

describe('cheat grid reveals all solutions', () => {
    const cases = [
        ["_________", "AWLM_APEW"],
        ["X__Y__Z__", "AWLM_APEW"],
        ["BIGBADCAT", "AWLM_APEW"]
    ];
    test.each(cases)("%p", (supplied, expected) => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setState(supplied);
        puzzle.cheatGrid();
        expect(puzzle.getState()).toBe(expected);
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
    });

    test('switches direction when focused cell is bidirectional and toggleDirection is true', () => {
        let puzzle = readPuzzle('3x3.ipuz');
        puzzle.setFocus(0, 0);
        expect(puzzle.focusedClue.direction).toBe("across");
        puzzle.setFocus(0, 0);
        expect(puzzle.focusedClue.direction).toBe("across");
        puzzle.setFocus(0, 0, true);
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


