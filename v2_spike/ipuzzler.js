function Clue(ipuzClue, direction) {
    this.direction = direction;
    if (ipuzClue) {
        this.text = ipuzClue.clue || "";
        this.number = ipuzClue.number || 0;
        this.enumeration = (ipuzClue.enumeration || "").replace(/ /g, ',');
        this.label = ipuzClue.label || this.number;
    }
    this.root = null;
    this.next = null;
    this.continuations = [];
    this.cells = [];
    this.drawHtml = function ($list) {
        var html = '<li><a href="#"><label>' + this.label + '</label>' + this.text;
        if (this.enumeration) html += ' <span class="clue-enumeration">(' + this.enumeration + ')</span>';
        html += '</a></li>';
        this.$html = $(html);
        if ($list && $list.append) $list.append(this.$html);
    }
    this.focusFirstInput = function () {
        if (this.cells && this.cells.length && this.cells[0].input) this.cells[0].input.focus();
    }

    this.focusFinalInput = function () {
        if (this.cells && this.cells.length && this.cells[this.cells.length-1].input) this.cells[this.cells.length-1].input.focus();
    }

    this.getClueChain = function () {
        var root = this.root || this;
        return [root].concat(this.continuations);
    }

    this.toString = function () {
        return (this.number + " " + this.direction);
    }
}

function Cell(x, y, input, $span, value, style) {
    this.x = x;
    this.y = y;
    this.input = input; // HTMLInputElement
    this.$span = $span; // jQuery $<span /> for this cell
    this.value = value;
    this.style = style || {};
    this.previous = {};
    this.next = {};
    this.solution = "";

    this.setValue = function(value) {
        if (this.input) this.input = value.toUpperCase();
    }

    this.cheat = function () {
        if (this.input) this.input.value = this.solution;
    }
    this.clear = function () {
        if (this.input) this.input.value = "";
    }

    this.check = function () {
        console.log(this.input.value);
        console.log(this.solution);
        console.log('--------------------------');
        if (this.input && this.input.value != this.solution) this.clear();
    }

    this.getFirstCell = function (direction) {
        return (this.previous[direction] ? this.previous[direction].getFirstCell(direction) : this);
    }

    this.getFinalCell = function (direction) {
        return (this.next[direction] ? this.next[direction].getFinalCell(direction) : this);
    }
}

function iPuzzler(ipuz, $container) {
    const $grid = $('<div class="puzzle-grid"/>');
    const $clueButtons = $('<div class="buttons clue-buttons"><a href="#" class="check-clue-button">Check Clue</a><a href="#" class="cheat-clue-button">Cheat Clue</a><a href="#" class="clear-clue-button">Clear Clue</a></div>');
    const $gridButtons = $('<div class="buttons grid-buttons"><a href="#" class="check-grid-button">Check Grid</a><a href="#" class="cheat-grid-button">Cheat Grid</a><a href="#" class="clear-grid-button">Clear Grid</a></div>');
    const $info = $('<div class="puzzle-info">PUZZLE INFO</div>');
    const $infoDing = $('<div class="puzzle-info-ding"></div>');
    const $infoDingBorder = $('<div class="puzzle-info-ding-border"></div>');
    const $puzzle = $('<div class="puzzle-grid-wrapper"/>');
    $puzzle.append($grid);
    $puzzle.append($clueButtons);
    $puzzle.append($gridButtons);
    $puzzle.append($info);
    $puzzle.append($infoDing);
    $puzzle.append($infoDingBorder);
    const $acrossListWrapper = $('<div class="clue-list-wrapper across-clue-list-wrapper"><h4>Across</h4><ul class="clue-list across-clue-list"></ul></div>');
    const $downListWrapper = $('<div class="clue-list-wrapper down-clue-list-wrapper"><h4>Down</h4><ul class="clue-list down-clue-list"></ul></div>');

    this.clues = { across: [], down: [] };
    this.cells = [];
    this.cluePositions = [];
    this.direction = "across";

    this.input = null;
    this.cell = null;
    this.clue = null;

    this.drawElements = function () {
        $container.html("");
        $container.append($puzzle);
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
        var cluesFromAcross = puzzle.parseClues(ipuz.clues.Across, "across");
        var cluesFromDown = puzzle.parseClues(ipuz.clues.Down, "down");
        var allTheClues = cluesFromAcross.concat(cluesFromDown);
        for(var i = 0; i < allTheClues.length; i++) {
            var clue = allTheClues[i];
            puzzle.clues[clue.direction][clue.number] = clue;
        }

        puzzle.attachCellsToClues();

        puzzle.drawClueList();
        puzzle.loadProgressFromCookie();

        $(window).resize(puzzle.handleResize);
        $grid.on("focus", "input", puzzle.inputFocus);
        $grid.on("blur", "input", puzzle.inputBlur);
        $grid.on("keydown", "input", puzzle.inputKeyDown);
        $grid.on("keypress", "input", puzzle.inputKeyPress);

        $puzzle.on("click", "a.cheat-grid-button", puzzle.cheatGrid);
        $puzzle.on("click", "a.clear-grid-button", puzzle.clearGrid);
        $puzzle.on("click", "a.check-grid-button", puzzle.checkGrid);
        $puzzle.on("click", "a.cheat-clue-button", puzzle.cheatClue);
        $puzzle.on("click", "a.clear-clue-button", puzzle.clearClue);
        $puzzle.on("click", "a.check-clue-button", puzzle.checkClue);

        $("#save-button").on("click", puzzle.saveProgressIntoCookie);
        $("#load-button").on("click", puzzle.loadProgressFromCookie);
        $("ul.clue-list li").on("click", puzzle.clueListClick);
    }

    this.clueListClick = function (event) {
        // if ($(this).hasClass("current-clue")) return;
        $(".current-clue").removeClass("current-clue");
        var clue = puzzle.findClueForListItem(this);
        clue = (clue.root || clue);
        puzzle.focusClue(clue);
        puzzle.highlightClue(clue);
    }

    this.changeDirection = function (direction) {
        if (direction) {
            this.direction = direction;
        } else if (this.direction == "across") {
            this.direction = "down";
        } else {
            this.direction = "across";
        }
    }

    this.inputKeyPress = function (event) {
        if (/^[A-Z]$/i.test(event.key)) {
            this.value = event.key.toUpperCase();
            puzzle.saveProgressIntoCookie();
            puzzle.moveFocusToNextCell();
        }
        return (false);
    }

    this.inputKeyDown = function (event) {
        var handler = puzzle.keyHandlers[event.key];
        if (handler) return handler(this);
    }

    this.keyHandlers = {
        ArrowLeft: function() { this.moveFocusToPreviousCell("across"); },
        ArrowRight: function() { this.moveFocusToNextCell("across"); },
        ArrowUp: function() { this.moveFocusToPreviousCell("down"); },
        ArrowDown: function() { this.moveFocusToNextCell("down"); },
        Home: function() { this.clue.focusFirstInput(); },
        End: function() { this.clue.focusFinalInput(); },
        Backspace: function() { this.cell.clear(); this.moveFocusToPreviousCell(); },
        Delete: function() { this.cell.clear(); },
        Escape: function() { this.input.blur(); }
    }

    this.moveFocusToNextCell = function (direction = puzzle.direction) {
        var cell = puzzle.cell;
        if (cell.next && cell.next[direction]) {
            puzzle.changeDirection(direction);
            cell.next[direction].input.focus();
        } else {
            var clues = this.findCluesForInput(puzzle.input);
            var clue = clues.find(c => c.direction == direction);
            if (clue && clue.next) this.focusClue(clue.next);
        }
    }

    this.moveFocusToPreviousCell = function (direction = puzzle.direction) {
        var cell = puzzle.cell;
        if (cell.previous && cell.previous[direction]) {
            puzzle.changeDirection(direction);
            cell.previous[direction].input.focus();
        }
    }

    this.findCellForInput = input => puzzle.cells.flat().find(cell => cell.input == input);

    this.inputBlur = function () {
        // $(".current-clue").removeClass("current-clue");
        puzzle.hideFloatingClue();
    }

    this.inputFocus = function (event) {
        const input = this;
        const clues = puzzle.findCluesForInput(input);
        if (event.type == "focusin") {
            $(puzzle.input).off("click touchstart");
            if (clues.length > 1) window.setTimeout(function() { $(input).on("click touchstart", function(event) {
                if (window.debouncing) return;
                window.debouncing = true;
                puzzle.changeDirection();
                puzzle.highlightClueForInput(input);
                puzzle.drawFloatingClue(puzzle.cell);
                window.setTimeout(function() { window.debouncing = false }, 500);
            }), 100);
        }
        puzzle.highlightClueForInput(input);
        puzzle.input = this;
        puzzle.cell = puzzle.findCellForInput(this);
        puzzle.drawFloatingClue(puzzle.cell);
    }
    this.hideFloatingClue = function() {
        $info.hide();
        $infoDingBorder.hide();
        $infoDing.hide();
    }

    this.drawFloatingClue = function (cell) {
        var clues = this.findCluesForInput(cell.input);
        var clue = clues.find(function(c) { c.direction == puzzle.direction });
        var root = (clue.root || clue);
        $info.html(root.$html.html());
        $info.show();
        $infoDingBorder.show();
        $infoDing.show();
        var infoPositionCell = cell.getFirstCell(puzzle.direction);
        var infoPositionInput = infoPositionCell.input;
        // for down clues: we draw it alongside the first cell in the clue.
        var infoTop = $(infoPositionInput).offset().top;
        var dingleBorderOffset = { top: 0, left: 0 };
        switch (puzzle.direction) {
            case "across":
                // always draw it BELOW the clue we're filling out.
                infoTop += $(infoPositionInput).height();
                $info.offset({ top: Math.ceil(infoTop) + 4, left: 6 });
                $info.css("width", "auto");
                $info.css("right", "6px");
                dingleBorderOffset.top = infoTop - 2;
                dingleBorderOffset.left = 3 + $(infoPositionInput).offset().left;
                break;
            case "down":
                infoTop -= 2;
                dingleBorderOffset.top = infoTop + 4;
                var windowWidth = $(window).width();
                var infoLeft = $(infoPositionInput).offset().left;
                if (infoLeft < (windowWidth / 2)) {
                    // draw in RHS of window
                    $info.offset({ top: infoTop, left: infoLeft + $(infoPositionInput).width() + 2 });
                    $info.css("right", "6px");
                    dingleBorderOffset.left = $(infoPositionInput).offset().left + $(infoPositionInput).width() - 2;
                } else {
                    // draw in LHS of window
                    $info.offset({ top: infoTop, left: 6 });
                    $info.width(infoLeft - ($(infoPositionInput).width() + 8));
                    dingleBorderOffset.left = 6 + infoLeft - $(infoPositionInput).width();
                }
                break;
        }
        dingleBorderOffset.top = Math.floor(dingleBorderOffset.top);
        dingleBorderOffset.left = Math.floor(dingleBorderOffset.left);
        $infoDingBorder.offset(dingleBorderOffset);
        $infoDing.offset({ top: dingleBorderOffset.top + 1, left: dingleBorderOffset.left + 1 });
    }

    this.highlightClueForInput = function (input) {
        $(".current-clue").removeClass("current-clue");
        const clues = puzzle.findCluesForInput(input);
        const clue = (clues.length > 1 ? clues.find(function(c) { c.direction == puzzle.direction }) : clues[0]);
        puzzle.direction = clue.direction;
        puzzle.clue = clue;
        puzzle.highlightClue(clue.root || clue);
    }

    this.focusClue = function (clue) {
        puzzle.changeDirection(clue.direction);
        clue.focusFirstInput();
    }

    this.highlightClue = function (clue) {
        clue.continuations.forEach(puzzle.highlightClue);
        for(var i = 0; i < clue.cells.length; i++) clue.cells[i].$span.addClass("current-clue");
        clue.$html.addClass("current-clue");
    }

    this.findClueForListItem = function (li) {
        var allClues = puzzle.clues.across.concat(puzzle.clues.down).filter(c => c);
        return allClues.find(clue => clue.$html[0] == li);
    }

    this.findCluesForInput = function (inputElement) {
        var cellContainsInput = cell => cell.input == inputElement;
        var allClues = puzzle.clues.across.concat(puzzle.clues.down).filter(c => c);
        return allClues.filter(clue => clue.cells.some(cellContainsInput));
    }

    this.buildCells = function (x, y, direction, previous) {
        if (x < 0 || x >= puzzle.cells.length) return [];
        if (y < 0 || y >= puzzle.cells[x].length) return [];
        var cell = puzzle.cells[y][x];
        if (cell.value == "#") return [];
        if (previous) {
            if (direction == "across" && /L/i.test(cell.style.barred)) return [];
            if (direction == "down" && /T/i.test(cell.style.barred)) return [];
            cell.previous[direction] = previous;
            previous.next[direction] = cell;
        }
        (direction == "across" ? x++ : y++);
        return ([cell].concat(this.buildCells(x, y, direction, cell)));
    }

    this.attachCellsToClues = function () {
        for (const clue of puzzle.clues.across.filter(c => c)) {
            var position = puzzle.cluePositions[clue.number];
            clue.cells = this.buildCells(position.x, position.y, "across");
        }
        for (const clue of puzzle.clues.down.filter(c => c)) {
            var position = puzzle.cluePositions[clue.number];
            clue.cells = this.buildCells(position.x, position.y, "down");
        }
    }

    this.drawClueList = function () {
        var $list = $acrossListWrapper.find("ul");
        puzzle.clues.across.forEach(clue => clue.drawHtml($list));
        $list = $downListWrapper.find("ul");
        puzzle.clues.down.forEach(clue => clue.drawHtml($list));
    }

    this.parseClues = function (ipuzClueList, direction) {
        const clues = (ipuzClueList && ipuzClueList.map ? ipuzClueList.map(c => [...this.parseClue(c, direction)]).flat() : []);
        for (const clue of clues) {
            if (clue.continuations && clue.continuations.length) {
                clue.next = clue.continuations[0];
                for (var i = 0; i < clue.continuations.length - 1; i++) {
                    clue.continuations[i].next = clue.continuations[i + 1];
                }
            }
        }
        return clues;
    }

    this.parseClue = function* (ipuzClue, direction) {
        var clue = new Clue(ipuzClue, direction);
        if (ipuzClue.continued && typeof ipuzClue.continued[Symbol.iterator] === "function") {
            for (const continuation of ipuzClue.continued) {
                var cc = new Clue(continuation);
                cc.direction = continuation.direction.toLowerCase();
                cc.text = 'See ' + ipuzClue.number;
                cc.root = clue;
                clue.continuations.push(cc);
                yield cc;
            }
        }
        yield clue;
    }


    this.drawGridCell = function (x, y, ipuzData) {
        var $span = $("<span class='cell'></span>");
        if (ipuzData.style && ipuzData.style.barred) $span.addClass('barred-' + ipuzData.style.barred.toLowerCase());
        var value = (ipuzData.cell || ipuzData);
        var input = null;
        var clueNumber = parseInt(value);
        if (clueNumber) {
            puzzle.cluePositions[clueNumber] = { x: x, y: y };
            $span.append('<span class="clue-number">' + clueNumber + '</span>');
        }
        if (value == "#") {
            $span.addClass("block");
        } else {
            var $input = $('<input maxlength="1" data-x="' + x + '" data-y="' + y + '" value="" />');
            $span.append($input);
            input = $input[0];
        }
        $grid.append($span);
        return new Cell(x, y, input, $span, value, ipuzData.style);
    }

    this.drawPuzzle = function () {
        ipuz.puzzle.forEach((row, y) => row.forEach((ipuzCell, x) => {
            if (!Array.isArray(puzzle.cells[x])) puzzle.cells[x] = new Array();
            puzzle.cells[y][x] = this.drawGridCell(x, y, ipuzCell);
        }));
        if (Array.isArray(ipuz.solution)) {
            ipuz.solution.forEach((row, y) => row.forEach((col, x) => puzzle.cells[y][x].solution = (col.value ?? col)));
        }
    }

    this.layoutPuzzleGrid = function () {
        $grid.html("");
        var gridCss = { "grid-template": 'repeat(' + ipuz.dimensions.width + ', 1fr) / repeat(' + ipuz.dimensions.height + ', 1fr)' };
        if ($(window).width() > 768) {
            gridCss.width = (ipuz.dimensions.width * 32) + "px";
            gridCss.height = (ipuz.dimensions.height * 32) + "px";
        }
        $grid.css(gridCss);
    }

    this.handleResize = function () {
        var gridSize = $grid.width();
        var fontSize = (Math.ceil(gridSize / (2 * ipuz.dimensions.height)));
        // for sizes just under 16, we bump the size to 16px to prevent zooming on iOS when input is focused.
        if (fontSize > 10 && fontSize < 16) fontSize = 16;
        $grid.find("input").css("font-size", fontSize + "px");
        var clueFontSize = (Math.ceil(gridSize / (3.5 * ipuz.dimensions.height)));
        $grid.find("span.clue-number").css("font-size", clueFontSize + "px");
    }

    this.cookieName = window.location.href.replace(/#.*/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    this.saveProgressIntoCookie = function () {
        var cookieJson = JSON.stringify(puzzle.cells.map((row, y) => row.map(cell => (cell.input ? cell.input.value : null))));
        var cookieDate = new Date(2100, 1, 1);
        document.cookie = puzzle.cookieName + "=" + cookieJson + ";expires=" + cookieDate.toUTCString() + ";path=/";
    }

    this.loadProgressFromCookie = function () {
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookie = decodedCookie.split(/; */).map(token => token.split('=')).find(pair => pair[0] == puzzle.cookieName);
        if (cookie && cookie.length > 1) {
            var values = JSON.parse(cookie[1]);
            values.forEach((row, y) => row.forEach((value, x) => puzzle.cells[y][x].setValue(value)));
        }
    }

    this.getSolution = function (x, y) {

    }

    this.modifyClueCells = function (action) {
        var clue = puzzle.clue;
        clue = (clue.root || clue);
        var allCells = clue.cells.concat(clue.continuations.map(c => c.cells).flat());
        console.table(allCells);
        allCells.forEach(cell => action(cell));
        puzzle.saveProgressIntoCookie();
    }

    this.checkClue = function (event) {
        puzzle.modifyClueCells(cell => cell.check());
    }

    this.cheatClue = function (event) {
        puzzle.modifyClueCells(cell => cell.cheat());
    }

    this.clearClue = function (event) {
        puzzle.modifyClueCells(cell => cell.clear());
    }

    this.modifyGridCells = function (action) {
        puzzle.cells.flat().forEach(action);
        puzzle.saveProgressIntoCookie();
    }

    this.checkGrid = function () {
        puzzle.modifyGridCells(cell => cell.check());
    }

    this.clearGrid = function () {
        var $this = $(this);
        if (/confirm/i.test($this.html())) {
            $this.html("Clear Grid");
            $this.removeClass("confirm");
            puzzle.modifyGridCells(cell => cell.clear());
        } else {
            $this.html("Confirm?");
            $this.addClass("confirm");
            window.setTimeout(function () {
                $this.html("Clear Grid");
                $this.removeClass("confirm");
            }, 2000);
        }
    }

    this.cheatGrid = function (event) {
        var $this = $(this);
        if (/confirm/i.test($this.html())) {
            $this.html("Cheat Grid");
            $this.removeClass("confirm");
            puzzle.modifyGridCells(cell => cell.cheat());
        } else {
            $this.html("Confirm?");
            $this.addClass("confirm");
            window.setTimeout(function () {
                $this.html("Cheat Grid");
                $this.removeClass("confirm");
            }, 2000);
        }
    }

    const puzzle = this;
    $(puzzle.ready);
}

