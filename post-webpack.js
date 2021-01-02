var fs = require('fs');

let VERSION = process.argv[2];

const jsFile = `dist/js/ipuzzler-${VERSION}.js`;
const UTF8 = 'utf8';
console.log(`Inlining CSS into ${jsFile}`);
fs.readFile(jsFile, UTF8, (err, js) => {
    if (err) return (console.log(err));
    fs.readFile(`dist/css/ipuzzler.css`, UTF8, (err, css) => {
        if (err) return (console.log(err));
        let modified = js.replace("\"/*_REPLACED_WITH_STYLES_BY_WEBPACK_BUILD_*/\"", "`" + css + "`");        
        fs.writeFile(jsFile, modified, UTF8, err => {
            if (err) return (console.log(err));
            console.log(`Copying ${jsFile} to gh-pages/ipuzzler/ipuzzler-${VERSION}.js`);
            fs.copyFile(jsFile, `gh-pages/ipuzzler/ipuzzler-${VERSION}.js`, err => {
                if (err) return (console.log(err));
            });
        });
    });
});