# ipuzzler
A JavaScript client and game grid for ipuz format crossword puzzles.

**ipuz** is "the free, open, extensible standard format for all types of what have traditionally been called 'pencil and paper' puzzles."

The ipuz format is documented at [http://www.ipuz.org/](http://www.ipuz.org/)

### Goals

I use [Crossword Compiler for Windows](https://www.crossword-compiler.com/) to create crossword puzzles.

I'd like to be able to publish these online so folks can do my puzzles in a web browser - just like on [the Guardian website](https://www.theguardian.com/crosswords/series/cryptic).

As of November 2020, I couldn't find a nice existing way to achieve this. Crossword Compiler's web export feature requires Java support, which means it's unnecessarily complicated on browsers and doesn't work at all on iOS devices. However, it does have (experimental!) support for exporting puzzles in ipuz format. I figured it might be fun to create a JavaScript parser/renderer for the ipuz format, so I could export puzzles from Crossword Compiler in .ipuz format and host them on the web.







