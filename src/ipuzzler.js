(function ($) {
    $.fn.puzzle = function (ipuz) {        
        this.html(ipuz.puzzle.map(t => t.toString()));
        return this;
    };
}(jQuery));