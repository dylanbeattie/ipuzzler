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

test('test event handlers', () => {
    let json = fs.readFileSync(`${__dirname}/fixtures/3x3.ipuz`);
    let ipuzzler = new IPuzzler();
    ipuzzler.init(json);
    let updates = 0;
    let updated = null;
    ipuzzler.renderer.update = puzzle => {
        updated = puzzle;
    }

    let input = document.createElement('input');
    input.setAttribute('data-x', 1);
    input.setAttribute('data-y', 2);
    let event = { composedPath: () => [ input ] };

    ipuzzler.handleClick(event);
    expect(updated).not.toBeNull();
    expect(updated.cells[2][1].value).toBe("Y");
});
