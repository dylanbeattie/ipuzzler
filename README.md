# ipuzzler

A JavaScript client and game grid for ipuz format crossword puzzles.

![Demo of iPuzzler](./ipuzzler.gif)

## Usage

iPuzzler is distributed as a single JS file; CSS is inlined into the JS file so there's no external CSS file to use.

See the [iPuzzler website](https://dylanbeattie.github.io/ipuzzler/) for instructions on how to use it to host puzzles on your own websites and pages.

## Development

Here's how to get a local setup running:

1. Clone the repo: `git clone https://github.com/dylanbeattie/ipuzzler.git`.
2. Switch into it: `cd ipuzzler`.
3. Install dependencies: `npm install`.
4. Start a dev server: `npm run dev`.
5. Open the site in web browser: `http://localhost:3000/`.

iPuzzler uses [vite](https://vitejs.dev), which means it has hot module replacement at dev time; edit any of the project files and your browser will automatically reload to show your changes.

## Customising iPuzzler

Want to ship a customised version of iPuzzler with different CSS or something? No problem.

1. Clone the repo, and edit whatever you need
    * The CSS for the component is built using [SASS](https://sass-lang.com), and is in `js/ipuzzler.scss`
    * CSS is imported into the `renderer.js` module by Vite when you run or build the project.
1. Run `npm run build`
1. Look in `dist/js/` - you should find two files:
    * `ipuzzler-0.0.0.js` - an ECMAScript module version of your customised iPuzzler
    * `ipuzzler-0.0.0.umd.js` - a [UMD](https://github.com/umdjs/umd) version of your customised iPuzzler

> The version number comes from an environment variable called `VITE_IPUZZLER_BUILD_VERSION`
> 
> For local development, it's set to 0.0.0 via a `.env` file. For production builds, the GitHub Actions script uses the git tag associated with the release that's being built.


## Running Tests

iPuzzler uses [vitest](https://vitest.dev). To run all the project tests:

```
$ npm run test

> ipuzzler@0.1.21 test
> vitest

 DEV  v0.17.1 D:/projects/github/dylanbeattie/ipuzzler

 ✓ js/tests/parser.test.js (60)
 ✓ js/tests/puzzle.test.js (80)
 ✓ js/tests/ipuzzler.test.js (109) 863ms
 ✓ js/tests/renderer.test.js (68) 1090ms
 ✓ js/tests/cell.test.js (10)
 ✓ js/tests/position.test.js (2)

Test Files  6 passed (6)
     Tests  329 passed (329)
      Time  3.09s (in thread 2.28s, 135.17%)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

### Publishing a new release

iPuzzler itself is built using nodeJS modules and vite, but the [iPuzzler site](https://dylanbeattie.github.io/ipuzzler) is built with Jekyll and hosted on GitHub Pages. A GitHub Actions script will update the `gh-pages` branch when a new release is published, which in turn will publish a new version of the site.

There's a nodeJS script `publish.js` which will copy the latest release of the component into the `gh-pages` folder, and update the version and build date in the associated `_config.yml` file.

To publish a new release:

1. `git add` and `git commit` all the changes
1. `npm version patch` -- will update the version stored in `package.json` to the next patch version. This will also create a Git tag with the new version number, in the format `v0.1.2`.
1. `git push && git push --tags` to push the code and associated tags to GitHub.

The GitHub actions script in `.github/workflows/release.yml` will:

1. Build the project, run all the tests, and update the Jekyll `_config.yml` with the version number pulled from the Git tag.
1. Create the actual GitHub release and publish it at [https://github.com/dylanbeattie/ipuzzler/releases](https://github.com/dylanbeattie/ipuzzler/releases)
1. Push the updated `gh-pages` code to the `gh-pages` branch -- this will trigger the GitHub Pages build and deploy a new version of [https://dylanbeattie.github.io/ipuzzler](https://dylanbeattie.github.io/ipuzzler) 

## License

iPuzzler is released under the [MIT license](LICENSE). 

You are free to use it, hack it, modify it, ship it, you can even sell it -- but don't pretend you wrote it. 

## About iPuz

**ipuz** is "the free, open, extensible standard format for all types of what have traditionally been called 'pencil and paper' puzzles."

The ipuz format is documented at [http://www.ipuz.org/](http://www.ipuz.org/)
