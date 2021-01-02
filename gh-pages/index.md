---
layout: default
title: iPuzzler
---
## Live Demo
<ipuzzler-puzzle src="puzzles/homepage.ipuz">
Looks likeiPuzzler doesn't work on your web browser. Sorry!
</ipuzzler-puzzle>
## Demo Source
```html
<html>
  <head>
    <title>iPuzzler Demo</title>
    <script type="module" src="js/ipuzzler.js"></script>
  </head>
  <body>
    <ipuzzler-puzzle src="my-puzzle.ipuz"></ipuzzler-puzzle>
  </body>
</html>
```
## Getting Started

1. Download [js/ipuzzler.js](js/ipuzzler.js) and [css/ipuzzler.css](css/ipuzzler.css)
1. Add `<script type="module" src="js/ipuzzler.js"></script>` to the `<head>` of your page.
1. Publish your crossword puzzle in [iPuz format](http://www.ipuz.org/)
1. Add `<ipuzzler-puzzle src="my-puzzle.ipuz"></ipuzzler-puzzle>` to your page.

That's it.

## Examples

<dl>
<dt><a href="puzzle?ipuz=puzzles/guardian-cryptic-28283-boatman.ipuz">The Guardian cryptic 28283, set by Boatman</a></dt>
<dd>A 15x15 cryptic puzzle of the sort found in British newspapers</dd>
<dt><a href="puzzle?ipuz=puzzles/guardian-prize-22089-araucaria-20001223.ipuz">The Guardian prize crossword no 28283, set by Araucaria</a></dt>
<dd>A 21x21 cryptic puzzle from The Guardian</dd>

<dt><a href="puzzle?ipuz=puzzles/new-york-times-20060427.ipuz">The <em>New York Times</em>, 27 April 2006</a></dt>
<dd>An American-style puzzle</dd>
</dl>

## More