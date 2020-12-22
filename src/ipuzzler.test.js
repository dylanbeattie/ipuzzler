const fs = require('fs');
const { test, expect } = require('@jest/globals');
import { IPuzzler } from './ipuzzler.js';

// test('hello world', () => {
//     let instance = new IPuzzler();
//     let result = instance.hello('World');
//     expect(result).toBe("Hello World");
// });
// import { Renderer } from './renderer.js';
// const mockedRender = jest.fn();
// jest.mock('./renderer.js', () => {
//     return jest.fn().mockImplementation(() => {
//         return { 
//             render: mockedRender,
//             update: mockedRender
//          }
//     });
// });
function html(tagName, attributes) {
    const element = document.createElement(tagName);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    return (element);
}

describe('test event handlers', () => {
    let json = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/3x3.ipuz`));
    let ipuzzler = new IPuzzler();
    ipuzzler.init(json);
    let updated = null;
    // Override the DOM-based renderer with a really simple mock
    ipuzzler.renderer.update = puzzle => updated = puzzle;

    test('mousedown sets cell focus', () => {

        let input = html('input', { 'data-row': 1, 'data-col': 2 });
        let event = { composedPath: () => [input], preventDefault: () => { } };

        expect(ipuzzler.puzzle.focusedCell).toBeNull();
        ipuzzler.mousedown(event);
        expect(updated).not.toBeNull();
        expect(updated.focusedCell).not.toBeNull();
    });

    test('mousedown highlights row', () => {

        // We pick a cell that only associates with an Across clue
        let input = html('input', { 'data-row': 0, 'data-col': 1 });
        let event = { composedPath: () => [input], preventDefault: () => { } };

        ipuzzler.mousedown(event);
        let cells = ipuzzler.puzzle.cells;
        let expected = [
            [true, true, true],
            [false, false, false],
            [false, false, false]
        ]
        expected.forEach((line, row) => line.forEach((bool, col) => expect(cells[row][col].isActive).toBe(bool)));
    });
});
