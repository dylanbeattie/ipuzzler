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
    for(const [key,value] of Object.entries(attributes)) element.setAttribute(key,value);
    return(element);
}

test('test event handlers', () => {
    let json = fs.readFileSync(`${__dirname}/fixtures/3x3.ipuz`);
    let ipuzzler = new IPuzzler();
    ipuzzler.init(json);
    let updated = null;
    // Override the DOM-based renderer with a really simple mock
    ipuzzler.renderer.update = puzzle =>  updated = puzzle;

    let input = html('input', { 'data-row': 1, 'data-col': 2 });
    let event = { composedPath: () => [ input ], preventDefault: () => {} };

    expect(ipuzzler.puzzle.focusedCell).toBeNull();
    ipuzzler.handleMouseDown(event);
    expect(updated).not.toBeNull();
    expect(updated.focusedCell).not.toBeNull();
});
