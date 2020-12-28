const fs = require('fs');
const { test, expect } = require('@jest/globals');
import { executionAsyncId } from 'async_hooks';
import { Parser } from '../parser.js';
import { Renderer } from '../renderer.js';

function readPuzzle(filename) {
    let ipuz = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/${filename}`));
    return Parser.parse(ipuz);
}

describe('rendering puzzle to shadow DOM', () => {
    var puzzle = readPuzzle('3x3.ipuz');
    var root = document.createElement('div');
    var renderer = new Renderer(root);
    renderer.render(puzzle);

    test('initialises spans array', () => expect(renderer.spans.length).toBe(3));

    test('includes stylesheet link', () => {
        let style = root.querySelector("link");
        expect(style.getAttribute("type")).toBe("text/css");
        expect(style.getAttribute("rel")).toBe("stylesheet");
        expect(style.getAttribute("href")).toBe("css/ipuzzler.css");
    });

    test('includes div.puzzle-grid', () => {
        let grids = root.querySelectorAll("div.puzzle-grid");
        expect(grids.length).toBe(1);
    });

    test('sets grid template based on puzzle dimensions', () => {
        let gridTemplate = `repeat(${puzzle.height}, 1fr) / repeat(${puzzle.width}, 1fr)`;
        let grid = root.querySelector("div.puzzle-grid");
        expect(grid.style.gridTemplate).toBe(gridTemplate);
    })

    test('includes spans for puzzle cells', () => {
        let spans = root.querySelectorAll("div.puzzle-grid span");
        expect(spans.length).toBe(puzzle.cells.flat().length);
    });

    test('includes inputs for puzzle cells', () => {
        let cells = puzzle.cells.flat();
        let spans = root.querySelectorAll("div.puzzle-grid span");
        cells.forEach((cell, index) => {
            let input = spans[index].querySelectorAll("input");
            expect(input.length).toBe(cell.hasInput ? 1 : 0);
        });
    });

    test('includes data-row and data-col attributes on puzzle cell inputs', () => {
        puzzle.cells.forEach((cells, row) => cells.forEach((cell, col) => {
            let span = root.querySelectorAll("div.puzzle-grid span")[(row * puzzle.cells[0].length) + col];
            let input = span.querySelector("input");
            if (input) {
                expect(parseInt(input.getAttribute("data-row"))).toBe(row);
                expect(parseInt(input.getAttribute("data-col"))).toBe(col);
            }
        }));
    });

    test('includes clue numbers', () => {
        let cells = puzzle.cells.flat();
        let spans = root.querySelectorAll("div.puzzle-grid span");
        cells.forEach((cell, index) => {
            let clueNumber = spans[index].querySelectorAll("label");
            expect(clueNumber.length).toBe(cell.number ? 1 : 0);
        });
    });

    test('renders clue lists', () => {
        let lists = root.querySelectorAll("section.puzzle-clue-list");
        expect(lists.length).toBe(2);
    });

    test('renders Across clues', () => {
        let section = root.querySelector("section.puzzle-clue-list#across-clue-list");
        expect(section).not.toBeNull();
    });

    test('renders Down clues', () => {
        let section = root.querySelector("section.puzzle-clue-list#down-clue-list");
        expect(section).not.toBeNull();
    });

    test('renders Across clue list title', () => {
        let heading = root.querySelector("section.puzzle-clue-list#across-clue-list h2");
        expect(heading.innerHTML).toBe("Across");
    });

    test('renders Across clue list items', () => {
        let listItems = root.querySelectorAll("section.puzzle-clue-list#across-clue-list ol li");
        expect(listItems.length).toBe(2);
    });
});

describe('rendering clue lists to shadow DOM', () => {
    function renderClueListItems(filename) {
        const puzzle = readPuzzle(filename);
        const root = document.createElement('div');
        const renderer = new Renderer(root);
        renderer.render(puzzle);
        let listItems = root.querySelectorAll("section.puzzle-clue-list ol li");
        return (listItems);
    }

    describe('renders clue numbers correctly', () => {
        test.each([
            ['3x3.ipuz', [1, 3, 1, 2]],
            ['5x5-linked-clues.ipuz', [1, 4, 5, 1, 2, 3]]
        ])("for puzzle '%p', numbers %p", (filename, numbers) => {
            let listItems = renderClueListItems(filename);
            numbers.forEach((value, index) => expect(listItems[index].querySelector("label").innerText).toBe(value));
        });
    });

    describe('renders clue text correctly', () => {
        const cases = [
            ['3x3.ipuz', ["Leatherworking tool", "Church bench", "Unit of current", "Rules"]],
            ['5x5-linked-clues.ipuz', [
                "See 5", "See 2 down", 'Test clue for &quot;token clean attic&quot;',
                "See 2", 'Test clue for &quot;trick slice asset&quot;', "See 5 across"
            ]]
        ];
        test.each(cases)("for puzzle '%p', clues %p", (filename, clues) => {
            let listItems = renderClueListItems(filename);
            clues.forEach((value, index) => expect(listItems[index].innerText).toContain(value));
        });
    });
    describe('renders clue list item IDs correctly', () => {
        const cases = fs.readdirSync(`${__dirname}/fixtures/`, { withFileTypes: true})
        .filter((entry) => entry.isFile() && /\.ipuz$/i.test(entry.name))
        .map(entry => entry.name);

        test.each(cases)("for puzzle '%p'", (filename) => {
            const puzzle = readPuzzle(filename);
            const root = document.createElement('div');
            const renderer = new Renderer(root);
            renderer.render(puzzle);
            let listItems = root.querySelectorAll("section.puzzle-clue-list ol li");
            puzzle.allClues.forEach((clue, index) => expect(listItems[index].id).toBe(clue.elementId));        
        });
    });

    describe('renders clue enumerations correctly', () => {
        const cases = [
            ['3x3.ipuz', ["3", "3", "3", "3"]],
            ['5x5-linked-clues.ipuz', [null, null, "5,5,5", null, "5,5,5", null]]
        ];

        test.each(cases)("for puzzle '%p'", (filename, clues) => {
            let listItems = renderClueListItems(filename);
            clues.forEach((value, index) => {
                var span = listItems[index].querySelector("span");
                if (value == null) {
                    expect(span).toBeNull()
                } else {
                    expect(span.innerText).toBe(`(${value})`);
                }
            });
        });
    });
});