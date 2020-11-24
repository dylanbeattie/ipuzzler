function iPuzzler(ipuz, $container) {

    const $grid = $container.find("div.puzzle-grid");

    this.ready = function () {    
        puzzle.layoutPuzzleGrid();
        puzzle.drawPuzzle();
        puzzle.handleResize();
    }

    this.createGridCell = function (x, y, cell) {
        let $span = $("<span class='cell'></span>");
        if (cell.style && cell.style.barred) $span.addClass(`barred-${cell.style.barred.toLowerCase()}`);
        if (cell.cell) cell = cell.cell;
        if (parseInt(cell)) $span.append(`<span class="clue-number">${cell}</span>`);
        if (cell == "#") {
            $span.addClass("block");
        } else {
            $span.append(`<input maxlength='1' data-x="${x}" data-y="${y}" value="" />`);
        }
        return ($span);
    }
    this.drawPuzzle = function () {
        ipuz.puzzle.forEach((row, y) => row.forEach((cell, x) => $grid.append(this.createGridCell(x, y, cell))));
    }

    this.layoutPuzzleGrid = function () {
        $grid.html("");
        let gridCss = { "grid-template": `repeat(${ipuz.dimensions.width}, 1fr) / repeat(${ipuz.dimensions.height}, 1fr)` }
        if ($(window).width() > 768) {
            gridCss.width = `${ipuz.dimensions.width * 32}px`;
            gridCss.height = `${ipuz.dimensions.height * 32}px`;
        }
        $grid.css(gridCss);
    }
    
    this.handleResize= function () {
        let gridSize = $grid.width();
        $grid.find("input").css("font-size", `${(Math.ceil(gridSize / (1.6 * ipuz.dimensions.height)))}px`);
        $grid.find("span.clue-number").css("font-size", `${(Math.ceil(120 / ipuz.dimensions.height))}px`);
    }

    const puzzle = this;
    // Attach handlers
    $(window).resize(puzzle.handleResize);
    $(puzzle.ready);
}

