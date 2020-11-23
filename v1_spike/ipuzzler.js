let CELL_SIZE = 30;
let grid = new Array();
function renderCell(text, x, y) {
    var $item = $("<span class='cell'></span>");
    if (parseInt(text)) {
        $item.append(`<span class="clue-number">${text}</span>`);
    }
    if (text == "#") {
        $item.addClass("block");
    } else {
        $item.append(`<input maxlength='1' data-x="${x}" data-y="${y}" />`);
    }
    return ($item);
}

function renderPuzzle(ipuz) {
    window.clues = {
        across: new Array(),
        down: new Array()
    };
    var $acrossCluesList = $("#across-clues-list");
    var $downCluesList = $("#down-clues-list");
    $acrossCluesList.html("");
    $downCluesList.html("");



    ipuz.clues.Across.forEach(clue => {
        var label = clue.label || clue.number;
        var count = (clue.enumeration && clue.enumeration.replace ? clue.enumeration.replace(/ /g, ',') : clue.enumeration);
        var $clue = $(`<li id="clue-list-item-${clue.number}-across" ><a href="#" class="clue-link" data-clue-number="${clue.number}" data-clue-direction="across">
            <span class="clue-number">${label}</span> ${clue.clue} (${count})</a></li>`);
        $acrossCluesList.append($clue);
        window.clues.across[clue.number] = clue;
        if (clue.continued) {
            clue.continued.forEach(cont => {
                var $clue = $(`<li id="clue-list-item-${cont.number}-${cont.direction.toLowerCase()}" ><a href="#" class="clue-link" data-clue-number="${clue.number}" data-clue-direction="across">
                <span class="clue-number">${label}</span> See {$clue.number}</a></li>`);
    
            })
        })
    });
    ipuz.clues.Down.forEach(clue => {
        var label = clue.label || clue.number;   
        var count = (clue.enumeration && clue.enumeration.replace ? clue.enumeration.replace(/ /g, ',') : clue.enumeration);
        var $clue = $(`<li id="clue-list-item-${clue.number}-down"><a href="#" class="clue-link" data-clue-number="${clue.number}" data-clue-direction="down">
            <span class="clue-number">${label}</span> ${clue.clue} (${count})</a></li>`);
        $downCluesList.append($clue);
        window.clues.down[clue.number] = clue
    });

    $grid = $("div.grid");
    $grid.html('');
    var width = ipuz.dimensions.width;
    var height = ipuz.dimensions.height;
    var gridCss = {
        "width": `${width * CELL_SIZE}px`,
        "height": `${height * CELL_SIZE}px`,
        "grid-template": `repeat(${width}, 1fr) / repeat(${height}, 1fr)`
    };
    $grid.css(gridCss);

    let puzzle = new Array(width).fill(0).map(_ => new Array(height));

    var rows = ipuz.puzzle;
    for (var y = 0; y < rows.length; y++) {
        var cols = rows[y];
        for (var x = 0; x < cols.length; x++) {
            var cell = cols[x];
            var $item = renderCell(cell, x, y);
            $grid.append($item);
            puzzle[x][y] = {
                "element": $item,
                "content": cell,
            };
        }
    }
    for (var x = 0; x < puzzle.length; x++) {
        for (var y = 0; y < puzzle[x].length; y++) {
            if (puzzle[x][y].content == "#") continue;
            var xMin = x;
            while (xMin > 0 && puzzle[xMin - 1][y].content != "#") xMin--;
            var xMax = x;
            while (xMax + 1 < puzzle.length && puzzle[xMax + 1][y].content != "#") xMax++;
            if (xMin != xMax) puzzle[x][y].across = { min: xMin, max: xMax };

            var yMin = y;
            while (yMin > 0 && puzzle[x][yMin - 1].content != "#") yMin--;
            var yMax = y;
            while (yMax + 1 < puzzle[x].length && puzzle[x][yMax + 1].content != "#") yMax++;
            if (yMin != yMax) puzzle[x][y].down = { min: yMin, max: yMax };
        }
    }
    return (puzzle);
}

function isInputCell(cell) {
    return (cell && cell.content == ":" || cell.content == 0);
}

function inputFocus(evt) {
    var $input = $(this);
    var x = parseInt($input.data("x"));
    var y = parseInt($input.data("y"));
    var cell = window.puzzle[x][y];
    if (cell.across && cell.down) {
        if (cell == window.previousCell) {
            window.direction = (window.direction == "across" ? "down" : "across");
        }
    } else if (cell.across) {
        window.direction = "across";
    } else {
        window.direction = "down";
    }
    $("div.grid span").removeClass("highlight");
    $("div.grid span").removeClass("focus");
    var clueNumber;
    var clue;
    switch (window.direction) {
        case "across":
            for (var hx = cell.across.min; hx <= cell.across.max; hx++) window.puzzle[hx][y].element.addClass("highlight");
            clueNumber = window.puzzle[cell.across.min][y].content;
            clue = window.clues.across[clueNumber];
            break;
        case "down":
            for (var hy = cell.down.min; hy <= cell.down.max; hy++) window.puzzle[x][hy].element.addClass("highlight");
            clueNumber = window.puzzle[x][cell.down.min].content;
            clue = window.clues.down[clueNumber];
            break;
    }

    var label = clue.label || `${clueNumber}${window.direction[0]}`;
    var clueHtml = `<strong>${label}</strong> ${clue.clue} (${clue.enumeration})`;
    $("#current-clue").html(clueHtml);
    $("ul.clue-list li").removeClass("highlight");
    var clueLinkId = `li#clue-list-item-${clueNumber}-${window.direction}`;
    console.log(clueLinkId);
    $(clueLinkId).addClass("highlight");
    $input.addClass("focus");
    window.previousCell = cell;
    return (false);
}
function inputKeyPress(event) {

    var $input = $(this);
    var x = parseInt($input.data("x"));
    var y = parseInt($input.data("y"));
    var cell = window.puzzle[x][y];
    if (event.defaultPrevented) return;
    console.log(event);
    var span;
    switch (event.code) {
        case "ArrowLeft":
            if (cell.across && x > cell.across.min) {
                window.direction = "across";
                span = window.puzzle[x - 1][y].element;
            }
            break;
        case "ArrowRight":
            if (cell.across && x < cell.across.max) {
                window.direction = "across";
                span = window.puzzle[x + 1][y].element;
            }
            break;
        case "ArrowUp":
            if (cell.down && y > cell.down.min) {
                window.direction = "down";
                span = window.puzzle[x][y - 1].element;
            }
            break;
        case "ArrowDown":
            if (cell.down && y < cell.down.max) {
                window.direction = "down";
                span = window.puzzle[x][y + 1].element;
            }
            break;
        case "Home":
            switch (window.direction) {
                case "across":
                    if (cell.across) span = window.puzzle[cell.across.min][y].element;
                    break;
                case "down":
                    if (cell.down) span = window.puzzle[x][cell.down.min].element;
                    break;
            }
            break;
        case "End":
            switch (window.direction) {
                case "across":
                    if (cell.across) span = window.puzzle[cell.across.max][y].element;
                    break;
                case "down":
                    if (cell.down) span = window.puzzle[x][cell.down.max].element;
                    break;
            }
            break;
        case "Delete":
            cell.element.children("input").val("");
            break;
        case "Backspace":
            cell.element.children("input").val("");
            switch (window.direction) {
                case "across":
                    if (cell.across && x > cell.across.min) span = window.puzzle[x - 1][y].element;
                    break;
                case "down":
                    if (cell.down && y > cell.down.min) span = window.puzzle[x][y - 1].element;
                    break;
            }
            break;
        default:
            if (/^[A-Za-z]$/.test(event.key)) {
                console.log('roooo');
                cell.element.children("input").val(event.key);
                switch (window.direction) {
                    case "across":
                        if (cell.across && x < cell.across.max) span = window.puzzle[x + 1][y].element;
                        break;
                    case "down":
                        if (cell.down && y < cell.down.max) span = window.puzzle[x][y + 1].element;
                        break;
                }
            }
    }
    if (span) {
        span.children("input")[0].focus();
        // event.preventDefault();
        return (false);
    }
}
function clueLinkClick(event) {
    var $this = $(this);
    var clueNumber = $this.data("clue-number");
    var direction = $this.data("clue-direction");
}

$(function () {
    $.get("examples/connected-clues-going-backwards.ipuz.json", function (data) {
        window.puzzle = renderPuzzle(data);
        window.direction = "across";
    });
    $("div.grid").on('focus', "input", inputFocus);
    $("div.grid").on('click', "input.focus", inputFocus);
    $("div.grid").on("keydown", "input", inputKeyPress);
    $("ul.clue-list").on("click", "a", clueLinkClick);
});
