const CopyWebpackPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const fs = require('fs');

let PACKAGE = require('./package.json');
let VERSION = PACKAGE.version;

let config = {
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
    },
    // The bundled source code files will result in a bundle.js file in the /dist/js folder.
    output: {
        publicPath: '',
        path: `${__dirname}/dist`,
        filename: `js/ipuzzler-${VERSION}.js`
    },
    // The /gh-pages folder will be picked up by a GitHub Actions step
    // and published to the gh-pages branch, which feeds into the GitHub
    // Pages site for the project.
    devServer: {
        contentBase: './gh-pages'
    },
    plugins: [
        new WebpackShellPluginNext({
            // after webpack completes, we need to:
            onBuildEnd: {
                scripts: [`node post-webpack.js ${VERSION}`]
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/tests/fixtures/*.ipuz', to: '../gh-pages/puzzles/[name].[ext]', toType: 'template' }
            ]
        }),
        new ReplaceInFileWebpackPlugin([{
            dir: 'gh-pages',
            files: ['_config.yml'],
            rules: [
                { search: /version: .*/, replace: `version: ${VERSION}` },
                { search: /build_date: .*/, replace: `build_date: "${new Date().toUTCString()}"` }
            ]
        }])
    ]
}

module.exports = (env, argv) => {
    if (argv.mode != 'production') config.devtool = 'source-map';
    return config;
}