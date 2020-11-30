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
                exclude: [/node_modules/, /\.test\.(js)$/ ],
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js'],
        fallback: { "path": false, "fs": false }
    },
    // The bundled source code files shall result in a bundle.js file in the /dist/js folder.
    output: {
        publicPath: '',
        path: `${__dirname}/dist`,
        filename: 'js/ipuzzler.js'
    },
    // The /dist folder will be used to serve our application to the browser.
    devServer: {
        contentBase: './dist'
    }
};