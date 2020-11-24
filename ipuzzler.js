function Clue(ipuzClue, direction) {
    this.direction = direction;
    if (ipuzClue) {
        this.text = ipuzClue.clue || "";
        this.number = ipuzClue.number || 0;
        this.enumeration = (ipuzClue.enumeration || "").replace(/ /g, ',');
        this.label = ipuzClue.label || this.number;
    }
    this.toHtml = function() { 
        var html = `<li><a href="#"><label>${this.label}</label>${this.text}`;
        if (this.enumeration) html += ` <span class="clue-enumeration">(${this.enumeration})</span>`;
        html += '</a></li>';
        return(html);
    }
}

function iPuzzler(ipuz, $container) {

    const $grid = $('<div class="puzzle-grid"/>');
    const $info = $('<div class="puzzle-info" />');
    const $puzzle = $('<div class="puzzle-grid-wrapper"/>');
    $puzzle.append($grid);
    $puzzle.append($info);
    const $acrossListWrapper = $('<div class="clue-list-wrapper across-clue-list-wrapper"><h4>Across</h4><ul class="clue-list across-clue-list"></ul></div>');
    const $downListWrapper = $('<div class="clue-list-wrapper down-clue-list-wrapper"><h4>Down</h4><ul class="clue-list down-clue-list"></ul></div>');

    const clues = {
        across: [],
        down: []
    };

    this.drawElements = function() {        
        $container.html("");
        $container.append($grid);
        $container.append($acrossListWrapper);
        $container.append($downListWrapper);
    }

    this.ready = function () {
        puzzle.drawElements();
        puzzle.layoutPuzzleGrid();
        puzzle.drawPuzzle();
        puzzle.handleResize();

        // Because of the way the ipuz format handles continuations, we might end up
        // with down clues in the list of clues that came from ipuz.clues.Across
        let cluesFromAcross = puzzle.parseClues(ipuz.clues.Across, "across");
        let cluesFromDown = puzzle.parseClues(ipuz.clues.Down, "down");
        for(const clue of cluesFromAcross.concat(cluesFromDown)) clues[clue.direction][clue.number] = clue;

        puzzle.drawClueList();

        $(window).resize(puzzle.handleResize);
    }

    this.drawClueList = function() {
        $acrossListWrapper.find("ul").append(clues.across.map(clue => clue.toHtml()));
        $downListWrapper.find("ul").append(clues.down.map(clue => clue.toHtml()));
    }

    this.parseClues = function (ipuzClueList, direction) {
        return ipuzClueList.map(c => [...this.parseClue(c, direction)]).flat();
    }
    this.parseClue = function* (ipuzClue, direction) {
        yield new Clue(ipuzClue, direction);
        if (ipuzClue.continued && typeof ipuzClue.continued[Symbol.iterator] === "function") {
            for (const continuation of ipuzClue.continued) {
                let c = new Clue(continuation);
                c.direction = continuation.direction.toLowerCase();
                c.text = `See ${ipuzClue.number}`
                yield c;
            }
        }
    }


    this.drawGridCell = function (x, y, cell) {
        let $span = $("<span class='cell'></span>");
        if (cell.style && cell.style.barred) $span.addClass(`barred-${cell.style.barred.toLowerCase()}`);
        if (cell.cell) cell = cell.cell;
        if (parseInt(cell)) $span.append(`<span class="clue-number">${cell}</span>`);
        if (cell == "#") {
            $span.addClass("block");
        } else {
            $span.append(`<input maxlength='1' data-x="${x}" data-y="${y}" value="" />`);
        }
        $grid.append($span);
    }

    this.drawPuzzle = function () {
        ipuz.puzzle.forEach((row, y) => row.forEach((cell, x) => this.drawGridCell(x, y, cell)));
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

    this.handleResize = function () {
        let gridSize = $grid.width();
        $grid.find("input").css("font-size", `${(Math.ceil(gridSize / (1.6 * ipuz.dimensions.height)))}px`);
        $grid.find("span.clue-number").css("font-size", `${(Math.ceil(gridSize / (3.5 * ipuz.dimensions.height)))}px`);
    }

    const puzzle = this;
    $(puzzle.ready);
}

