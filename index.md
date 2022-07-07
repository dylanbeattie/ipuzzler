---
layout: default
title: iPuzzler
---
*iPuzzler* is a tool for publishing crossword puzzles on the web. It takes puzzles published in the [iPuz format](http://www.ipuz.org) and renders them as playable puzzle grids that you can embed in any web page.
## Demo
<ipuzzler-puzzle id="ipuzzler-demo" src="puzzles/homepage.ipuz">
Looks like iPuzzler doesn't work on your web browser. Sorry!
</ipuzzler-puzzle>

## Example Usage

```html
<html>
  <head>
    <title>iPuzzler Demo</title>
    <script type="module" src="js/ipuzzler-{{site.version}}.js"></script>
  </head>
  <body>
    <ipuzzler-puzzle src="puzzle.ipuz"></ipuzzler-puzzle>
  </body>
</html>
```
## Getting Started

iPuzzler is distributed as a single standalone JavaScript module. It requires no libraries, frameworks or external CSS.

1. [Download ipuzzler.js](ipuzzler/ipuzzler-{{site.version}}.js) - the current release is {{ site.version }}.
1. Save it somewhere in your website. These instructions assume you've saved it into `/js/`.
1. Add `<script type="module" src="/js/ipuzzler-{{site.version}}.js"></script>` to the `<head>` of your page.
1. Publish your crossword puzzle in [iPuz format](http://www.ipuz.org/)
1. Add `<ipuzzler-puzzle src="my-puzzle.ipuz"></ipuzzler-puzzle>` to your page.

That's it.

## Example Puzzles

I created iPuzzler after I created a special crossword to commemorate the US 2020 election, and then discovered there was no way to publish it online. That puzzle is a *little* bit special - same grid, same clues, but it has two valid solutions, and at the time of publishing, we didn't know yet which one was correct:

* Dylan Beattie's Election 2020 Crossword: [TRUMP version](puzzle?ipuz=puzzles/dylanbeattie-2020-us-election-special-trump-version.ipuz) / [BIDEN version](puzzle?ipuz=puzzles/dylanbeattie-2020-us-election-special-biden-version.ipuz)

(The [solution and explanation](https://dylanbeattie.net/miscellany/us-election-2020-crossword-solution) is available online)

* [CityJS 2021 Crossword Puzzle](puzzle?ipuz=puzzles/cityjs-2021-puzzle.ipuz) - a puzzle I created to accompany a talk about iPuzzler presented at CityJS online in March 2021.

[Crossword Compiler](https://www.crossword-compiler.com/) ships with several sample puzzles, that have exported in iPuz format to demonstrate iPuzzler:

* [Cryptic Demo](puzzle?ipuz=puzzles/ccw-cryptic-demo.ipuz)
* [Barred Demo](puzzle?ipuz=puzzles/ccw-barred-demo.ipuz)
* [American-style Demo](puzzle?ipuz=puzzles/ccw-american-demo.ipuz)

A couple of newspaper puzzles I've converted to iPuz format:

* [The Guardian Cryptic no 28283](puzzle?ipuz=puzzles/guardian-cryptic-28283-boatman.ipuz), set by Boatman
* [The Guardian Prize no 22089](puzzle?ipuz=puzzles/guardian-prize-22089-araucaria-20001223.ipuz), set by Araucaria
