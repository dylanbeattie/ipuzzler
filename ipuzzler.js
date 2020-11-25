function Clue(ipuzClue, direction) {
    this.direction = direction;
    if (ipuzClue) {
        this.text = ipuzClue.clue || "";
        this.number = ipuzClue.number || 0;
        this.enumeration = (ipuzClue.enumeration || "").replace(/ /g, ',');
        this.label = ipuzClue.label || this.number;
    }
    this.root = null;
    this.continuations = [];
    this.ranges = [];
    this.toHtml = function() { 
        var html = `<li><a href="#"><label>${this.label}</label>${this.text}`;
        if (this.enumeration) html += ` <span class="clue-enumeration">(${this.enumeration})</span>`;
        html += '</a></li>';
        return(html);
    }
    this.toString = function() {
        return(this.number + " " + this.direction);
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

    this.clues = { across: [], down: [] };
    this.cells = [];
    this.cluePositions = [];
    this.direction = "across";

    this.drawElements = function() {        
        $container.html("");
        $container.append($grid);
        $container.append($acrossListWrapper);
        $container.append($downListWrapper);
    }

    this.attachRangesToClues = function() {

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
        let allTheClues = cluesFromAcross.concat(cluesFromDown);
        for(const clue of allTheClues) puzzle.clues[clue.direction][clue.number] = clue;

        puzzle.attachRangesToClues();

        puzzle.drawClueList();

        $(window).resize(puzzle.handleResize);
        $grid.on("focus", "input", function() {
            $("div.puzzle-grid span").removeClass("current-clue");
            const clues = puzzle.findCluesForInput(this);
            const clue = (clues.length > 1 ? clues.find(c => c.direction == puzzle.direction) : clues[0]);
            puzzle.direction = clue.direction;
            puzzle.highlightClue(clue.root || clue);
        });
    }

    this.highlightClue = function(clue) {
        clue.continuations.forEach(cc => puzzle.highlightClue(cc));
        clue.ranges.forEach(range => range.forEach(cell => cell.span.addClass("current-clue")));
    }

    this.findCluesForInput = function (inputElement) {
        let cellContainsInput = cell => cell.input == inputElement;
        let rangeContainsInput = cells => cells.some(cellContainsInput);
        let allClues = puzzle.clues.across.concat(puzzle.clues.down).filter(c => c);
        return allClues.filter(clue => clue.ranges.some(rangeContainsInput));
    }

    this.buildRange = function(x,y, fx, fy) {
        if (x < 0 || x >= puzzle.cells.length) return([]);
        if (y < 0 || y >= puzzle.cells[x].length) return([]);
        let cell = puzzle.cells[x][y];
        if (cell && cell.content != '#') return([cell].concat(this.buildRange(fx(x),fy(y), fx, fy)));
        return [];
    }

    this.attachRangesToClues = function() {
        for(const clue of puzzle.clues.across.filter(c => c)) {
            var position = puzzle.cluePositions[clue.number];
            clue.ranges.push(this.buildRange(position.x, position.y, x => x+1, y => y));
        }
        for(const clue of puzzle.clues.down.filter(c => c)) {
            var position = puzzle.cluePositions[clue.number];
            clue.ranges.push(this.buildRange(position.x, position.y, x => x, y => y+1));
        }
    }

    this.drawClueList = function() {
        $acrossListWrapper.find("ul").append(puzzle.clues.across.map(clue => clue.toHtml()));
        $downListWrapper.find("ul").append(puzzle.clues.down.map(clue => clue.toHtml()));
    }

    this.parseClues = function (ipuzClueList, direction) {
        return ipuzClueList.map(c => [...this.parseClue(c, direction)]).flat();
    }
    this.parseClue = function* (ipuzClue, direction) {
        var clue = new Clue(ipuzClue, direction);
        if (ipuzClue.continued && typeof ipuzClue.continued[Symbol.iterator] === "function") {
            for (const continuation of ipuzClue.continued) {
                let cc = new Clue(continuation);
                cc.direction = continuation.direction.toLowerCase();
                cc.text = `See ${ipuzClue.number}`;
                cc.root = clue;
                clue.continuations.push(cc);
                yield cc;
            }
        }
        yield clue;
    }


    this.drawGridCell = function (x, y, cell) {
        let $span = $("<span class='cell'></span>");
        if (cell.style && cell.style.barred) $span.addClass(`barred-${cell.style.barred.toLowerCase()}`);
        let content = (cell.cell || cell);
        let input = null;
        let clueNumber = parseInt(content);
        if (clueNumber) {        
            puzzle.cluePositions[clueNumber] = { x: x, y: y };
            $span.append(`<span class="clue-number">${clueNumber}</span>`);
        } 
        if (content == "#") {
            $span.addClass("block");
        } else {
            let $input = $(`<input maxlength='1' data-x="${x}" data-y="${y}" value="" />`);
            $span.append($input);
            input = $input[0];
        }        
        $grid.append($span);
        return {
            input: input,
            span: $span,
            cell: cell,
            content: content
        };
    }

    this.drawPuzzle = function () {
        ipuz.puzzle.forEach((row, y) => row.forEach((cell, x) => {
            if (!Array.isArray(puzzle.cells[x])) puzzle.cells[x] = new Array();
            puzzle.cells[x][y] = this.drawGridCell(x, y, cell);
        }));
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

