const fs = require('fs');
const { test, expect } = require('@jest/globals');
import { executionAsyncId } from 'async_hooks';
import { render } from 'sass';
import { Parser } from '../parser.js';
import { Renderer } from '../renderer.js';

function readPuzzle(filename) {
    let ipuz = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/${filename}`));
    return Parser.parse(ipuz, filename);
}
function clearCookies() {
    document.cookie.split(";").forEach(value => document.cookie = value.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT");
}

describe('read/write puzzle state from cookie', () => {
    beforeEach(clearCookies);

    test('renderer.render() reads puzzle state from cookie', () => {
        var puzzle = readPuzzle('3x3.ipuz');
        var root = document.createElement('div');
        var renderer = new Renderer(root);
        puzzle.setState = jest.fn(cookie => null);
        document.cookie = "foo=bar";
        document.cookie = "this=that";
        document.cookie = "cat=dog";
        document.cookie = "3x3-ipuz=TEST_COOKIE_VALUE";
        document.cookie = "frank=zappa";
        renderer.render(puzzle);
        expect(puzzle.setState).toHaveBeenCalledWith("TEST_COOKIE_VALUE");
    });

    test('renderer.update() persists puzzle state to cookie', () => {
        var puzzle = readPuzzle('3x3.ipuz');
        var root = document.createElement('div');
        var renderer = new Renderer(root);
        renderer.render(puzzle);
        puzzle.getState = jest.fn(() => "TEST_COOKIE_VALUE");
        renderer.update(puzzle);
        // because document.cookie mimics the behaviour of a real browser,
        // retrieving the value does NOT include the expires and path properties.
        expect(document.cookie).toBe("3x3-ipuz=TEST_COOKIE_VALUE");
    });
});

describe('renders cell values', () => {
    var puzzle = readPuzzle('3x3.ipuz');
    var root = document.createElement('div');
    var renderer = new Renderer(root);
    renderer.render(puzzle);

    test('on first keypress', () => {
        puzzle.setFocus(0, 0);
        puzzle.setCellValue("a");
        renderer.update(puzzle);
        let inputs = root.querySelectorAll("div.puzzle-grid span input");
        expect(inputs[0].value).toBe("A");
    });

    test('on first keypress', () => {
        puzzle.setFocus(0, 0);
        puzzle.setCellValue("b");
        puzzle.setCellValue("c");
        renderer.update(puzzle);
        let inputs = root.querySelectorAll("div.puzzle-grid span input");
        expect(inputs[0].value).toBe("B");
        expect(inputs[1].value).toBe("C");
    });
});

describe('rendering puzzle with localized headings', () => {
    let puzzle;
    let renderer;
    let root;
    beforeEach(() => {
        puzzle = readPuzzle('3x3.ipuz');
        root = document.createElement('div');
        renderer = new Renderer(root);
    });
    test('renders default Across clue list title', () => {
        renderer.render(puzzle);
        let heading = root.querySelector("section.puzzle-clue-list#across-clue-list h2");
        expect(heading.innerHTML).toBe("Across");
    });
    test('renders localised Across clue list title', () => {
        puzzle.clues.across.heading = "Sideways";
        renderer.render(puzzle);
        let heading = root.querySelector("section.puzzle-clue-list#across-clue-list h2");
        expect(heading.innerHTML).toBe("Sideways");
    });
    test('renders default Down clue list title', () => {
        renderer.render(puzzle);
        let heading = root.querySelector("section.puzzle-clue-list#down-clue-list h2");
        expect(heading.innerHTML).toBe("Down");
    });
    test('renders localised Across clue list title', () => {
        puzzle.clues.down.heading = "Verticale";
        renderer.render(puzzle);
        let heading = root.querySelector("section.puzzle-clue-list#down-clue-list h2");
        expect(heading.innerHTML).toBe("Verticale");
    });
});

describe('rendering puzzle to shadow DOM', () => {
    var puzzle = readPuzzle('3x3.ipuz');
    var root = document.createElement('div');
    var renderer = new Renderer(root);
    renderer.render(puzzle);

    test('initialises spans array', () => expect(renderer.spans.length).toBe(3));

    test('includes stylesheet link', () => {
        let style = root.querySelector("style");
        expect(style.innerText).toBe("/*_REPLACED_WITH_STYLES_BY_WEBPACK_BUILD_*/");
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

    test('renders Across clue list items', () => {
        let listItems = root.querySelectorAll("section.puzzle-clue-list#across-clue-list ol li");
        expect(listItems.length).toBe(2);
    });
    describe('renders', () => {
        const cases = [
            ["Check clue", "check-clue-button"],
            ["Clear clue", "clear-clue-button"],
            ["Cheat clue", "cheat-clue-button"],
            ["Check grid", "check-grid-button"],
            ["Clear grid", "clear-grid-button"],
            ["Cheat grid", "cheat-grid-button"],
        ]
        test.each(cases)("'%p' button", (text, id) => {
            let button = root.querySelector(`button#${id}`);
            expect(button.innerText).toBe(text);
        });
    });

    describe('renders clue bars', () => {
        test('above', () => {
            expect(root.querySelector("div#above-clue-bar")).not.toBeNull();
        });
        test('below', () => {
            expect(root.querySelector("div#below-clue-bar")).not.toBeNull();
        });
    })
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

    describe('renders clue text correctly', () => {
        const cases = [
            ['3x3.ipuz', ["Leatherworking tool", "Church bench", "Unit of current", "Rules"]],
            ['5x5-linked-clues.ipuz', [
                "See 5", "See 2 down", 'Test clue for "token clean attic"',
                "See 2", 'Test clue for "trick slice asset"', "See 5 across"
            ]]
        ];
        test.each(cases)("for puzzle '%p', clues %p", (filename, clues) => {
            let listItems = renderClueListItems(filename);
            clues.forEach((value, index) => expect(listItems[index].innerHTML).toContain(value));
        });
    });

    describe('renders clue list item IDs correctly', () => {
        const cases = fs.readdirSync(`${__dirname}/fixtures/`, { withFileTypes: true })
            .filter((entry) => entry.isFile() && /\.ipuz$/i.test(entry.name))
            .map(entry => entry.name);

        test.each(cases)("for puzzle '%p'", (filename) => {
            const puzzle = readPuzzle(filename);
            const root = document.createElement('div');
            const renderer = new Renderer(root);
            renderer.render(puzzle);
            let listItems = root.querySelectorAll("section.puzzle-clue-list ol li");
            puzzle.allClues.forEach((clue, index) => expect(listItems[index].id).toBe(clue.elementId));
            puzzle.allClues.forEach((clue, index) => expect(parseInt(listItems[index].getAttribute('data-clue-number'))).toBe(clue.number));
            puzzle.allClues.forEach((clue, index) => expect(listItems[index].getAttribute('data-clue-direction')).toBe(clue.direction));
        });
    });

    describe('sets CSS font size for input elements', () => {
        const cases = [
            ['3x3.ipuz', 320, "60px"],
            ['15x15-acid-test.ipuz', 320, "16px"],
            ['25x25-cryptic.ipuz', 320, "8px"]
        ]
        test.each(cases)("for puzzle %p, width %p, sets font size %p", (filename, gridSize, fontSize) => {
            const puzzle = readPuzzle(filename);
            const root = document.createElement('div');
            const renderer = new Renderer(root);
            renderer.render(puzzle);
            renderer.grid = { offsetWidth: gridSize, offsetHeight: gridSize, style: {} };
            renderer.resize(puzzle);
            let inputs = root.querySelectorAll("div.puzzle-grid span input");
            inputs.forEach(input => expect(input.style.fontSize).toBe(fontSize));
        });
    });

    describe('sets CSS font size for label elements', () => {
        const cases = [
            ['3x3.ipuz', 320, "27px"],
            ['15x15-acid-test.ipuz', 320, "6px"],
            ['25x25-cryptic.ipuz', 320, "4px"]
        ]
        test.each(cases)("for puzzle %p, width %p, sets font size %p", (filename, gridSize, fontSize) => {
            const puzzle = readPuzzle(filename);
            const root = document.createElement('div');
            const renderer = new Renderer(root);
            renderer.render(puzzle);
            renderer.grid = { offsetWidth: gridSize, offsetHeight: gridSize, style: {} };
            renderer.resize(puzzle);
            let labels = root.querySelectorAll("div.puzzle-grid span label");
            labels.forEach(label => expect(label.style.fontSize).toBe(fontSize));
        });
    })


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

    describe('renders clue labels correctly', () => {
        const cases = [
            ['3x3.ipuz', ["1", "3", "1", "2"]],
            ['5x5-linked-clues.ipuz', ["1", "4", "5,3,1a", "1", "2,4,1d", "3"]]
        ];
        test.each(cases)("for puzzle %p", (filename, expectedLabels) => {
            let listItems = renderClueListItems(filename);
            let renderedLabels = Array.from(listItems).map(item => item.querySelector("label").innerText);
            renderedLabels.forEach((label, index) => expect(label).toBe(expectedLabels[index]));
        });
    });

    describe('applies highlighting to clues', () => {
        const cases = [
            ['3x3.ipuz', 1, 'across', [0]]
        ];
        test.each(cases)("for %p, clue %p %p, highlights clues %p", (filename, clueNumber, clueDirection, indexes) => {
            const puzzle = readPuzzle(filename);
            const root = document.createElement('div');
            const renderer = new Renderer(root);
            renderer.render(puzzle);
            puzzle.clues[clueDirection][clueNumber].addHighlight();
            renderer.update(puzzle);
            let listItems = root.querySelectorAll("section.puzzle-clue-list ol li");
            indexes.forEach(value => expect(listItems[value].className).toContain("highlighted"));
            listItems.forEach((item, index) => {
                if (indexes.indexOf(index) < 0) expect(item.className).not.toContain("highlighted");
            });
        });
    });

    describe('applies half-highlighting to "see X" clues', () => {
        const cases = [
            ['5x5-linked-clues.ipuz', 1, 'across', [2], [0, 5]],
            ['5x5-linked-clues.ipuz', 5, 'across', [2], [0, 5]],
            ['5x5-linked-clues.ipuz', 3, 'down', [2], [0, 5]],

            ['5x5-linked-clues.ipuz', 4, 'across', [4], [1, 3]],
            ['5x5-linked-clues.ipuz', 1, 'down', [4], [1, 3]],
            ['5x5-linked-clues.ipuz', 2, 'down', [4], [1, 3]],


        ];
        test.each(cases)("for %p, clue %p %p, highlights clues %p", (filename, clueNumber, clueDirection, highlights, halflights) => {
            const puzzle = readPuzzle(filename);
            const root = document.createElement('div');
            const renderer = new Renderer(root);
            renderer.render(puzzle);
            puzzle.focusClue(clueNumber, clueDirection);
            renderer.update(puzzle);
            let clueList = root.querySelectorAll("section.puzzle-clue-list ol li");
            highlights.forEach(index => expect(clueList[index].className).toContain("highlighted"));
            halflights.forEach(index => expect(clueList[index].className).toContain("halflighted"));
            clueList.forEach((item, index) => {
                if (highlights.concat(halflights).indexOf(index) < 0) {
                    expect(item.className).not.toContain("highlighted");
                    expect(item.className).not.toContain("halflighted");
                }
            });
        });
    });
});