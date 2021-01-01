---
title: iPuzzler
description: Like a hat.
---
<script type="module" src="js/ipuzzler.js"></script>
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
<dt><a href="puzzle.md?src=puzzles/15x15-cryptic-example">British cryptic</a></dt>
<dd>A 15x15 cryptic puzzle of the sort found in British newspapers</dd>
<dt><a href="puzzle.,d?src=puzzles/15x15-american-example">American</a></dt>
<dd>An American-style puzzle</dd>
</dl>

## More