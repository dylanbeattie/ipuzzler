function iPuzzler(ipuz) {

    this.width = ipuz.dimensions.width;
    this.height = ipuz.dimensions.height;

    this.render = function ($container) {
        let $grid = $container.find("div.puzzle-grid");
        this.populateGrid($grid);
    }

    this.createGridCell = function(x,y,cell) {
        var $span = $("<span class='cell'></span>");
        if (parseInt(cell)) $span.append(`<span class="clue-number">${cell}</span>`);
        if (cell == "#") {
            $span.addClass("block");
        } else {
            $span.append(`<input maxlength='1' data-x="${x}" data-y="${y}" />`);
        }
        return ($span);
    }

    this.populateGrid = function ($grid) {        
        $grid.html("");
        let css = { "grid-template": `repeat(${this.width}, 1fr) / repeat(${this.height}, 1fr)` }
        $grid.css(css);    
        ipuz.puzzle.forEach((row, y) => row.forEach((cell, x) => $grid.append(this.createGridCell(x,y,cell))));
    }
}

