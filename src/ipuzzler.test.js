const { test, expect } = require('@jest/globals');

import { IPuzzler } from './ipuzzler.js';

test('hello world', () => {
    let instance = new IPuzzler();
    let result = instance.hello('World');
    expect(result).toBe("Hello World");
});