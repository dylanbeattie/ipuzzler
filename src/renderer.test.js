const fs = require('fs');
const { test, expect } = require('@jest/globals');
import { Parser } from './parser.js';
import { Renderer } from './renderer.js';

describe('rendering puzzle to shadow DOM', () => {
    let ipuz = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/3x3.ipuz`));
    var root = document.createElement('div');
    var puzzle = Parser.parse(ipuz);
    var renderer = new Renderer(root);
    renderer.render(puzzle);
    
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
        let gridTemplate = `repeat(${ipuz.dimensions.height}, 1fr) / repeat(${ipuz.dimensions.width}, 1fr)`;
        let grid = root.querySelector("div.puzzle-grid");
        expect(grid.style.gridTemplate).toBe(gridTemplate);
    })

    test('includes spans for puzzle cells', () => {
        let spans = root.querySelectorAll("div.puzzle-grid span");
        expect(spans.length).toBe(puzzle.cells.flat().length);
    });

    test('includes styles for puzzle cells', () => {
        let cells = puzzle.cells.flat();
        let spans = root.querySelectorAll("div.puzzle-grid span");
        cells.forEach((cell, index) => {
            let input = spans[index].querySelectorAll("input");
            expect(input.length).toBe(cell.hasInput ? 1 : 0);
        });
    });
    test('includes clue numbers', () => {
        let cells = puzzle.cells.flat();
        let spans = root.querySelectorAll("div.puzzle-grid span");
        cells.forEach((cell, index) => {
            let clueNumber = spans[index].querySelectorAll("label");
            expect(clueNumber.length).toBe(cell.number ? 1 : 0);
        });
    })
})

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
// function html(tagName, attributes) {
//     const element = document.createElement(tagName);
//     for(const [key,value] of Object.entries(attributes)) element.setAttribute(key,value);
//     return(element);
// }

// test('test event handlers', () => {
//     let json = fs.readFileSync(`${__dirname}/fixtures/3x3.ipuz`);
//     let ipuzzler = new IPuzzler();
//     ipuzzler.init(json);
//     let updated = null;
//     // Override the DOM-based renderer with a really simple mock
//     ipuzzler.renderer.update = puzzle =>  updated = puzzle;

//     let input = html('input', { 'data-x': 1, 'data-y': 2, 'value' : 'V' });
//     let event = { composedPath: () => [ input ] };

//     ipuzzler.handleClick(event);
//     expect(updated).not.toBeNull();
//     expect(updated.cells[2][1].value).toBe("V");
// });
