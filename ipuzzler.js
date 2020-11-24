function iPuzzler(ipuz) {

    this.width = ipuz.dimensions.width;
    this.height = ipuz.dimensions.height;

    this.render = function ($container) {
        let $grid = $container.find("div.puzzle-grid");
        this.layoutPuzzleGrid($grid);

        this.drawPuzzle($grid);
    }

    this.createGridCell = function (x, y, cell) {
        var $span = $("<span class='cell'></span>");
        if (parseInt(cell)) $span.append(`<span class="clue-number">${cell}</span>`);
        if (cell == "#") {
            $span.addClass("block");
        } else {
            $span.append(`<input maxlength='1' data-x="${x}" data-y="${y}" value="W" />`);
        }
        return ($span);
    }
    this.drawPuzzle = function($grid) {
        ipuz.puzzle.forEach((row, y) => row.forEach((cell, x) => $grid.append(this.createGridCell(x, y, cell))));
    }

    this.layoutPuzzleGrid = function ($grid) {
        $grid.html("");
        let gridCss = { "grid-template": `repeat(${this.width}, 1fr) / repeat(${this.height}, 1fr)` }
        if ($(window).width() > 768) {
            gridCss.width = `${this.width * 32}px`;
            gridCss.height = `${this.height * 32}px`;
        }
    
        $grid.css(gridCss);
        let gridSize = $grid.width();
        $grid.find("input").css("font-size", `${(Math.ceil(gridSize / (1.5 * this.height)))}px`);
        $grid.find("span.clue-number").css("font-size", `${(Math.ceil(120 / this.height))}px`);

    }
}

