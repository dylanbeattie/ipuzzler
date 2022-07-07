require('dotenv').config()
var fs = require('fs');

fs.copyFile(
    `dist/js/ipuzzler-${process.env.VITE_IPUZZLER_BUILD_VERSION}.js`, 
    `gh-pages/js/ipuzzler-${process.env.VITE_IPUZZLER_BUILD_VERSION}.js`,
    err => {
        if (err) return (console.log(err));
    }
);

fs.readFile('gh-pages/_config.yml', 'utf8', (err, text) => {
    if (err) return (console.log(err));
    text = text.replace(/^version\: .*$/mg, `version: ${process.env.VITE_IPUZZLER_BUILD_VERSION}`);
    text = text.replace(/^build_date\: .*$/mg, `build_date: "${new Date().toUTCString()}"`);
    fs.writeFile('gh-pages/_config.yml', text, err => {
        if (err) return console.log(err);
    });
    console.log('Updated gh-pages _config.yml:');
    console.log(`  version: ${process.env.VITE_IPUZZLER_BUILD_VERSION}`);
    console.log(`  build_date: "${new Date().toUTCString()}"`);
});
