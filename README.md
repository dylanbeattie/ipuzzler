# ipuzzler
A JavaScript client and game grid for ipuz format crossword puzzles.

**ipuz** is "the free, open, extensible standard format for all types of what have traditionally been called 'pencil and paper' puzzles."

The ipuz format is documented at [http://www.ipuz.org/](http://www.ipuz.org/)

### Goals

I use [Crossword Compiler for Windows](https://www.crossword-compiler.com/) to create crossword puzzles.

I'd like to be able to publish these online so folks can do my puzzles in a web browser - just like on [the Guardian website](https://www.theguardian.com/crosswords/series/cryptic).

As of November 2020, I couldn't find a nice existing way to achieve this. Crossword Compiler's web export feature requires Java support, which means it's unnecessarily complicated on browsers and doesn't work at all on iOS devices. However, it does have (experimental!) support for exporting puzzles in ipuz format. I figured it might be fun to create a JavaScript parser/renderer for the ipuz format, so I could export puzzles from Crossword Compiler in .ipuz format and host them on the web.

### Object Model

A crossword puzzle consists of a grid and a collection of clues.

The **grid** is defined as a matrix of **cells**. Every **cell** is either an **input cell** or a **block cell**. **Input cells** can contain a **clue number**.

A line of consecutive input cells is called a **range**. Every **input cell** belongs to one or two **ranges**. (Most cells belong to only one **range**; an **input cell** that is the intersection of a horizontal range and a vertical range belongs to both of those ranges.) Every range is identified by a **number** and a **direction**.

A **clue** is identified by a **number** and a **direction**, which must either "across" or "down". A clue has a **text** - the actual text of the clue, not including the number, direction or length. 

In many puzzles, there is a 1:1 correspondence between **clues** and **ranges** - every **clue** will yield a one-word answer that should be entered into the corresponding **range**. 

If a clue yields a multi-word answer that must be entered into more than one range, this is known as a **linked clue**. The **linked clue** will correspond to the **range** containing the first part of the solution, and the **linked clue** will contain one or more **continuations**, which are the clue numbers and directions indicating the subsequent ranges, *in order*.

> Note: continuations are not explicitly listed as separate clues in the `ipuz` file format. So, for example, if a clue is listed as follows:
>
> ```json
> { 
>     "label":"2,9,4d,12",
>     "answer":"dark side of the moon",
>     "enumeration":"4,4,2,3,4",
>     "number":2,
>     "clue":"Even NASA radios can't listen to this album"},
>     "continued":[
>         {"direction":"Across", "number":"9"},
>         {"direction":"Down", "number":"4"},
>         {"direction":"Across", "number":"12"}        
>     ]
> }
> ```
>
> we need to generate separate clues for 9 across, 4 down and 12 across, all with the clue text "See 2"

Every clue has a **label**. This is normally just the clue number, except for linked clues, where it includes the list of clue numbers indicating all the ranges corresponding to that clue.

A clue has an **enumeration**, indicating the length of the word(s) that form the solution to the clue. Examples of enumerations are in bold below:

> horse **(5)**
>
> role-playing game **(4-7,4)**
>
> tic-tac-toe **(3-3-3)**

### Event handlers

ipuzzler handles these JavaScript user events

**`focus`**

* occurs when a cell input receives focus (via a click, Tab key or touchscreen event)
* The actual UI focus is handled natively by the browser; the `puzzle.focusedCell` property is updated to reflect it.

**`click`**

* When a user clicks a clue, highlight the associated cells in the grid
* When a user clicks a grid cell, ONLY IF THE CELL IS ALREADY FOCUSED and the CELL IS BIDIRECTIONAL, we toggle the puzzle direction. (The browser won't raise a `focus` event for an element that already has focus)

**`keydown`**

* Arrow keys: move the focus around the puzzle grid
* Backspace: clear the current cell and retreat the focus
* Delete: clear the current cell
* Escape: remove focus, un-highlight all clues



















