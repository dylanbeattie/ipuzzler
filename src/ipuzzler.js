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
        this.toClueList = _ =>  [this].concat(this.continuations);
        
        this.toListItem = function () {
            let html = `<a href="#"><label>${this.label}</label>${this.text}`;
            if (this.enumeration) html += ` <span>(${this.enumeration})</span>`;
            html += "</a>";
            const li = document.createElement('li');
            li.innerHTML = html;
            return (li);
        }
    }

    Clue.parse = function(ipuzClue, direction) {
        var clue = new Clue(ipuzClue, direction);
        if (ipuzClue.continued && ipuzClue.continued.map) {
            clue.continuations = ipuzClue.continued.map(c => ({ ...Clue.parse(c), text: `See ${ipuzClue.number}`, root: clue }));
            for(var i = 0; i < clue.continuations.length-1; i++) clue.continuations[i].next = clue.continuations[i+1];
        }
        return clue;
    }    

    function Cell(x, y, ipuzCellData) {
        this.x = x;
        this.y = y;
        this.span = document.createElement('span');
        this.span.className = 'cell';
        if (ipuzCellData.style && ipuzCellData.style.barred) this.span.className += 'barred-' + ipuzCellData.style.barred.toLowerCase();
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
        // this.style = ipuzCellData.style || {};
    }

    function Puzzle(container) {

        function parseCells(ipuz) {
            let cells = [];
            ipuz.puzzle.forEach((row, y) => row.forEach((ipuzCell, x) => {
                if (! cells[y].length) cells[y] = [];
                cells[y][x] = new Cell(x, y, ipuzCell);
            }));
            return(cells);
        }

        function parseClues(ipuz) {
            let cluesFromAcross = ipuz.clues.Across.map(c => Clue.parse(c, "across").toClueList()).flat();
            let cluesFromDown = ipuz.clues.Down.map(c => Clue.parse(c, "across").toClueList()).flat();
            const clues = { across: [], down: [] };
            cluesFromAcross.concat(cluesFromDown).forEach(clue =>  clues[clue.direction][clue.number] = clue);
            return clues;
        }

        function drawGrid() {
            const grid = document.createElement('div');
            grid.className = 'puzzle-grid';
            puzzle.cells.forEach(row => row.forEach(cell => grid.appendChild(cell.span)));
            return (grid);
        }

        function drawClues(direction) {
            let div = document.createElement('div');
            div.innerHTML = `<h2>${direction}</h2>`;
            let ul = document.createElement(ul);
            puzzle.clues[direction].forEach(clue => ul.appendChild(clue.toListItem()));
            div.appendChild(ul);
            return div;
        }

        this.drawPuzzle = function (data) {
            this.clues = parseClues(ipuz);
            this.cells = parseCells(ipuz);
            const layout = document.createElement('div');
            layout.className = "puzzle-layout";
            layout.appendChild(drawGrid());
            layout.appendChild(drawClues("across"));
            layout.appendChild(drawClues("down"));
            container.appendChild(layout);
        }
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
            console.log(token);
            query[pair[0]] = pair[1];
        });
        w.query = query;
    })(window);

})();