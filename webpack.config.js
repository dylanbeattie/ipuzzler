module.exports = {
    // Use the src/index.js file as entry point to bundle it. 
    // If the src/index.js file imports other JavaScript files, bundle them as well.
    entry: ['./src/ipuzzler.js', './src/ipuzzler.scss'],
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    },
    devtool: 'source-map',
    module: {
        rules: [
            // Compile SCSS files to standalone CSS
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: 'file-loader', options: { name: 'ipuzzler.css' } },
                    "extract-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            // Include Babel in the build process to transpile shiny JS to old-school JS
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    // The bundled source code files shall result in a bundle.js file in the /dist/js folder.
    output: {
        path: `${__dirname}/dist/`,
        filename: 'ipuzzler.js'
    },
    // The /dist folder will be used to serve our application to the browser.
    devServer: {
        contentBase: './dist'
    }
};