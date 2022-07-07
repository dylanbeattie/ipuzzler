// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'js/ipuzzler.js'),
            name: 'iPuzzler',
            fileName: (format) => `js/ipuzzler.${format}.js`
        }
    },
    test: {
        environment: 'jsdom'
    }
});