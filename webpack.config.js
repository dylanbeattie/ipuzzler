const CopyWebpackPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

let PACKAGE = require('./package.json');
let VERSION = PACKAGE.version;

module.exports = {
    // Use the src/index.js file as entry point to bundle it. 
    // If the src/index.js file imports other JavaScript files, bundle them as well.
    entry: [
        './src/ipuzzler.js', './src/ipuzzler.scss'
    ],

    module: {
        rules: [
            // Compile SCSS files to standalone CSS
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: 'file-loader', options: { name: 'css/ipuzzler.css' } },
                    "extract-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            // Include Babel in the build process to transpile shiny JS to old-school JS
            {
                test: /\.(js)$/,
                exclude: [/node_modules/, /\.test\.(js)$/],
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js'],
        // fallback: { "path": false, "fs": false }
    },
    // The bundled source code files shall result in a bundle.js file in the /dist/js folder.
    output: {
        publicPath: '',
        path: `${__dirname}/dist`,
        filename: 'js/ipuzzler.js'
    },
    // The /dist folder will be used to serve our application to the browser.
    devServer: {
        contentBase: './gh-pages'
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/tests/fixtures/*.ipuz', to: '../gh-pages/puzzles/[name].[ext]', toType: 'template' }
            ]
        }),
        new FileManagerPlugin({
            events: {
                onEnd: {
                    archive: [
                        { source: "dist/**/*", destination: `ipuzzler.zip` }
                    ],
                    copy: [
                        { source: 'ipuzzler.zip', destination: `gh-pages/releases/ipuzzler-${VERSION}.zip` },
                        { source: 'dist/js/ipuzzler.js', destination: 'gh-pages/js/' },
                        { source: 'dist/css/ipuzzler.css', destination: 'gh-pages/css/' }
                    ],
                }
            }
        })
        //     move: [
        //       { source: '/path/from', destination: '/path/to' },
        //       { source: '/path/fromfile.txt', destination: '/path/tofile.txt' },
        //     ],
        //     delete: ['/path/to/file.txt', '/path/to/directory/'],
        //     mkdir: ['/path/to/directory/', '/another/directory/'],
        //     archive: [
        //       { source: '/path/from', destination: '/path/to.zip' },
        //       { source: '/path/**/*.js', destination: '/path/to.zip' },
        //       { source: '/path/fromfile.txt', destination: '/path/to.zip' },
        //       { source: '/path/fromfile.txt', destination: '/path/to.zip', format: 'tar' },
        //       {
        //         source: '/path/fromfile.txt',
        //         destination: '/path/to.tar.gz',
        //         format: 'tar',
        //         options: {
        //           gzip: true,
        //           gzipOptions: {
        //             level: 1,
        //           },
        //           globOptions: {
        //             nomount: true,
        //           },
        //         },
        //       },
        //     ],
        //   },
        // },
        //   }),
    ]
};