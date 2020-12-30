export class Clue {
    constructor(ipuzClueData, direction) {
        this.direction = direction;
        this.number = parseInt(ipuzClueData.number);
        this.text = ipuzClueData.clue;
        this.enumeration = ipuzClueData.enumeration;
        this.cells = [];
        this.continuations = [];
        if (ipuzClueData.continued && ipuzClueData.continued.map) {
            this.continuations = ipuzClueData.continued.map(c => {
                let continuation = new Clue(c, c.direction.toLowerCase());
                continuation.text = `See ${ipuzClueData.number}`;
                if (continuation.direction != this.direction) continuation.text += " " + this.direction;
                continuation.root = this;
                return continuation
            });
            this.next = this.continuations[0];
            for (var i = 0; i < this.continuations.length - 1; i++) this.continuations[i].next = this.continuations[i + 1];
        }
    }

    getContinuationLabel(puzzle) {
        return (this.number + (puzzle.isClueBirectional(this.number) ? this.direction[0] : ""));
    }

    getLabel(puzzle) {
        return [String(this.number)].concat(this.continuations.map(c => c.getContinuationLabel(puzzle))).join(",");
    }

    get elementId() {
        return `clue-${this.number}-${this.direction}`;
    }

    get allCells() {
        let root = (this.root ?? this);
        return root.cells.concat(root.continuations.map(c => c.cells).flat());
    }
    get allClues() {
        let root = (this.root ?? this);
        return [root].concat(root.continuations);
    }

    addHighlight() {
        this.allClues.forEach(clue => clue.isActive = true);
        this.allCells.forEach(cell => cell.addHighlight());
    }

    clearHighlight() {
        this.allClues.forEach(clue => clue.isActive = false);
    }

    toClueList() {
        return [this].concat(this.continuations);
    }
}