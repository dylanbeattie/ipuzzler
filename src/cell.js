import { Position } from "./position";

export class Cell {
    constructor(ipuzCellData, row, col) {
        this.isActive = false;
        this.style = "";
        this.position = new Position(row, col);
        this.previous = {};
        this.next = {};
        this.clues = {};
        this.value = "";
        if (ipuzCellData === null) {
            this.style = "blank";
        } else {
            if (typeof (ipuzCellData.cell) === "number") {
                this.number = ipuzCellData.cell;
            } else if (typeof (ipuzCellData) === "number") {
                this.number = ipuzCellData;
            } else {
                this.number = NaN;
            }
            if (ipuzCellData.style) {
                switch (ipuzCellData.style.barred) {
                    case "T":
                        this.style = "barred-top";
                        break;
                    case "L":
                        this.style = "barred-left";
                        break;
                    case "TL":
                        this.style = "barred-top barred-left";
                        break;
                }
            } else if (ipuzCellData == "#") {
                this.style = "block";
            }
        }
    }

    setValue(value) {
        if (this.hasInput) this.value = (value && value.toUpperCase ? value.toUpperCase() : "");
    }

    get isBirectional() {
        return this.clues["across"] && this.clues["down"];
    }

    get hasInput() {
        return !/bl(an|oc)k/.test(this.style);
    }

    addHighlight() {
        this.isActive = true;
    }

    clearHighlight() {
        this.isActive = false;
    }

    isEndOfRange(direction) {
        if (!this.hasInput) return (true);
        if (direction == "across" && this.previous.across && /left/.test(this.style)) return (true);
        if (direction == "down" && this.previous.down && /top/.test(this.style)) return (true);
        return (false);
    }

    check() {
        let value = (this.value && this.value.toUpperCase ? this.value.toUpperCase() : "");
        let solution = (this.solution && this.solution.toUpperCase ? this.solution.toUpperCase() : "");
        if (value !== solution) this.clear();
    }
    cheat() {
        if (this.solution) this.setValue(this.solution);
    }

    clear() {
        this.setValue("");
    }
}