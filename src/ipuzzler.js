(function () {

    function Clue(ipuzClueData, direction) {
        this.direction = (direction || ipuzClueData.direction || "").toLowerCase();
        if (ipuzClueData) {
            this.text = ipuzClueData.clue || "";
            this.number = ipuzClueData.number || 0;
            this.enumeration = (ipuzClueData.enumeration || "").replace(/ /g, ',');
            this.label = ipuzClueData.label || this.number;
        }
        this.root = null;
        this.next = null;
        this.continuations = [];
        this.cells = [];
        this.toClueList = _ => [this].concat(this.continuations);

        this.toListItem = function () {
            let html = `<a href="#"><label>${this.label}</label>${this.text}`;
            if (this.enumeration) html += ` <span>(${this.enumeration})</span>`;
            html += "</a>";
            const li = document.createElement('li');
            li.innerHTML = html;
            return (li);
        }

        this.highlight = function (depth = 0) {
            if (depth == 0 && this.root) {
                return this.root.highlight(depth + 1);
            } else {
                this.cells.forEach(cell => cell.highlight());
                this.continuations.forEach(clue => clue.highlight(depth + 1));
            }
        }

        this.focusFirstInput = function () {
            this.cells[0].focus();
        }

        this.focusFinalInput = function () {
            this.cells[this.cells.length - 1].focus();
        }
    }

    Clue.parse = function (ipuzClue, direction) {
        var clue = new Clue(ipuzClue, direction);
        if (ipuzClue.continued && ipuzClue.continued.map) {
            clue.continuations = ipuzClue.continued.map(c => ({ ...Clue.parse(c), text: `See ${ipuzClue.number}`, root: clue }));
            clue.next = clue.continuations[0];
            for (var i = 0; i < clue.continuations.length - 1; i++) clue.continuations[i].next = clue.continuations[i + 1];
        }
        return clue;
    }

    function Cell(x, y, ipuzCellData) {
        this.position = { x: x, y: y };
        this.span = document.createElement('span');
        this.span.className = 'cell';
        this.previous = {};
        this.next = {};
        this.clues = [];
        if (ipuzCellData === null) {
            this.span.className += " null";
        } else {
            this.style = ipuzCellData.style || {};
            if (ipuzCellData.style && ipuzCellData.style.barred) this.span.className += ' barred-' + ipuzCellData.style.barred.toLowerCase();
            this.value = (ipuzCellData.cell || ipuzCellData);
            if (parseInt(this.value)) this.span.insertAdjacentHTML('afterbegin', `<span class="clue-number">${this.value}</span>`);
            if (this.value == '#') {
                this.span.className += " block";
            } else {
                this.input = document.createElement('input');
                this.input.setAttribute('maxlength', '1');
                this.input.cell = this;
                this.span.appendChild(this.input);
            }
        }

        this.isEndOfRange = function (direction) {
            if (!this.input) return (true);
            if (this.previous[direction]) {
                if (direction == "across" && /L/i.test(this.style.barred)) return true;
                if (direction == "down" && /T/i.test(this.style.barred)) return true;
            }
            return false;
        }

        this.highlight = () => this.span.classList.add('current-clue');
        this.clearHighlight = () => this.span.classList.remove('current-clue');
        this.focus = () => this.input.focus();
        this.clear = () => this.input.value = "";
    }

    function Puzzle(container) {

        this.direction = "across";

        this.changeDirection = function (direction) {
            if (direction) {
                this.direction = direction;
            } else {
                this.direction = (this.direction == "across" ? "down" : "across");
            }
        }

        const parseCells = (ipuz) => ipuz.puzzle.map((row, y) => row.map((ipuzCell, x) => new Cell(x, y, ipuzCell)));

        const findCluePosition = function (clue) {
            return puzzle.cells.flat().find(cell => cell.value == clue.number).position;
        }

        const parseClues = function (ipuz) {
            let cluesFromAcross = ipuz.clues.Across.map(c => Clue.parse(c, "across").toClueList()).flat();
            let cluesFromDown = ipuz.clues.Down.map(c => Clue.parse(c, "down").toClueList()).flat();
            const clues = { across: [], down: [] };
            cluesFromAcross.concat(cluesFromDown).forEach(clue => {
                clue.position = findCluePosition(clue);
                clue.cells = listCells(clue.position.x, clue.position.y, clue.direction);
                clue.cells.forEach(cell => cell.clues.push(clue));
                clues[clue.direction][clue.number] = clue;
            });
            return clues;
        }

        const listCells = function (x, y, direction, previous) {
            if (y < 0 || x < 0 || y >= puzzle.cells.length || x >= puzzle.cells[y].length) return [];
            var cell = puzzle.cells[y][x];
            cell.previous[direction] = previous;
            if (cell.isEndOfRange(direction)) return [];
            if (cell.value == "#") return [];
            if (previous) previous.next[direction] = cell;
            (direction == "across" ? x++ : y++);
            return ([cell].concat(listCells(x, y, direction, cell)));
        }

        function drawGrid(cells) {
            const grid = document.createElement('div');
            grid.className = 'puzzle-grid';
            cells.forEach(row => row.forEach(cell => grid.appendChild(cell.span)));
            return (grid);
        }

        function drawClues(heading, clues) {
            let div = document.createElement('div');
            div.innerHTML = `<h2>${heading}</h2>`;
            let ul = document.createElement(ul);
            clues.forEach(clue => ul.appendChild(clue.toListItem()));
            div.appendChild(ul);
            return div;
        }

        this.drawPuzzle = function (ipuz) {
            this.cells = parseCells(ipuz);
            this.clues = parseClues(ipuz);
            const layout = document.createElement('div');
            layout.className = "puzzle-layout";
            this.grid = drawGrid(this.cells);
            layout.appendChild(this.grid);
            layout.appendChild(drawClues("Across", this.clues.across));
            layout.appendChild(drawClues("Down", this.clues.down));
            container.appendChild(layout);

            container.addEventListener("keypress", this.handleKeyPress);
            container.addEventListener("keydown", this.handleKeyDown);
            container.addEventListener("focusin", this.handleFocus);
            container.addEventListener("click", this.handleClick);

            this.grid.style.gridTemplate = `repeat(${ipuz.dimensions.height}, 1fr) / repeat(${ipuz.dimensions.width}, 1fr)`;
            if (window.innerWidth > 768) {
                this.grid.style.width = (ipuz.dimensions.width * 32) + "px";
                this.grid.style.height = (ipuz.dimensions.height * 32) + "px";
            }
            this.handleWindowResize();
        }

        let puzzle = this;

        this.findCluesForInput = function (input, direction) {
            let cell = puzzle.cells.flat().find(cell => cell.input === input);
            return cell.clues;
        }

        this.clearHighlights = function () {
            puzzle.cells.flat().forEach(cell => cell.clearHighlight());
        }

        this.moveFocusToNextCell = function (direction = puzzle.direction) {
            return (function (event) {
                let cell = event.target.cell;
                if (cell.next && cell.next[direction]) {
                    puzzle.changeDirection(direction);
                    cell.next[direction].focus();
                } else {
                    var clues = puzzle.findCluesForInput(event.target);
                    var clue = clues.find(c => c.direction == direction);
                    if (clue && clue.next) {
                        puzzle.changeDirection(clue.next.direction);
                        clue.next.focusFirstInput();
                    }
                }
            });
        }

        this.moveFocusToPreviousCell = function (direction) {
            return (function (event) {
                direction ||= puzzle.direction;
                var cell = event.target.cell;
                if (cell.previous && cell.previous[direction]) {
                    puzzle.changeDirection(direction);
                    cell.previous[direction].focus();
                }
            });
        }

        this.focusFirstInput = function (event) {
            let clues = puzzle.findCluesForInput(event.target);
            let clue = clues.find(clue => clue.direction == puzzle.direction);
            clue.focusFirstInput();
        }

        this.focusFinalInput = function (event) {
            let clues = puzzle.findCluesForInput(event.target);
            let clue = clues.find(clue => clue.direction == puzzle.direction);
            clue.focusFinalInput();
        }

        this.clearInput = function (callback) {
            return event => {
                event.target.cell.clear();
                if (callback) callback(event);
            };
        }

        this.keyHandlers = {
            ArrowUp: this.moveFocusToPreviousCell("down"),
            ArrowDown: this.moveFocusToNextCell("down"),
            ArrowLeft: this.moveFocusToPreviousCell("across"),
            ArrowRight: this.moveFocusToNextCell("across"),
            Home: this.focusFirstInput,
            End: this.focusFinalInput,
            Backspace: this.clearInput(this.moveFocusToPreviousCell()),
            Delete: this.clearInput,
            Escape: event => event.target.blur()
        }

        this.handleKeyDown = function (event) {
            var handler = puzzle.keyHandlers[event.key];
            if (handler) return handler(event);
        }

        this.handleFocus = function (event) {
            window.focusing = true;
            puzzle.clearHighlights();
            let clues = puzzle.findCluesForInput(event.target);
            console.log("handleFocus");
            console.log(puzzle.direction);
            let clue = clues.find(clue => clue.direction == puzzle.direction);
            if (!clue) {
                puzzle.changeDirection();
                clue = clues.find(clue => clue.direction == puzzle.direction);
            }
            clue.highlight();
            console.log(puzzle.direction);
            window.setTimeout(() => window.focusing = false, 200);
        }


        this.handleKeyPress = function (event) {
            event.preventDefault();
            console.log(event);
            if (/^[A-Z]$/i.test(event.key)) {
                event.target.value = event.key.toUpperCase();
                //TODO: this is horrible...
                puzzle.moveFocusToNextCell()(event);
            }
            return (false);
        }

        this.handleClick = function (event) {
            if (window.focusing || event.target.tagName != "INPUT") return;
            let clues = puzzle.findCluesForInput(event.target);
            if (clues.length > 1) puzzle.changeDirection();
            puzzle.clearHighlights();
            clues.find(clue => clue.direction == puzzle.direction).highlight();
        }

        this.handleWindowResize = function (event) {
            if (!puzzle.grid) return;
            let gridSize = parseInt(getComputedStyle(puzzle.grid, null).width.replace("px", ""));
            let fontSize = Math.ceil(gridSize / (2 * puzzle.cells[0].length));

            // for sizes just under 16, we bump the size to 16px to prevent zooming on iOS when input is focused.
            if (fontSize > 10 && fontSize < 16) fontSize = 16;
            puzzle.grid.querySelectorAll("input").forEach(input => input.style.fontSize = fontSize + "px");

            let clueFontSize = (Math.ceil(gridSize / (3.5 * puzzle.cells[0].length)));
            puzzle.grid.querySelectorAll("span.clue-number").forEach(input => input.style.fontSize = clueFontSize + "px");
        }

        window.addEventListener("resize", this.handleWindowResize);
    }

    function get(url, success, failure, error) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                success(JSON.parse(request.responseText));
            } else {
                if (failure) failure();
            }
        };
        request.send();
    }

    let ipuzzler = function (selector) {
        let puzzle = new Puzzle(document.querySelector(selector));
        this.load = function (url) {
            get(url, function (data) {
                puzzle.drawPuzzle(data);
            });
        }
        return (this);
    }

    window.ipuzzler = ipuzzler;

    (function (w) {
        let query = {};
        let tokens = window.location.search.replace(/^\?/, '').split('&');
        tokens.forEach(token => {
            let pair = token.split('=');
            query[pair[0]] = pair[1];
        });
        w.query = query;
    })(window);

})();