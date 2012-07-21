module.exports = Table;

function Table () {
    this.columns = {};
    this.lines = [];
    this.line = new Line;
}

function Line () {
    Object.defineProperties(this, {
        __printers: {
            value: {},
            enumerable: false
        },
        __cell: {
            value: function (col, val, printer) {
                this[col] = val;
                this.__printers[col] = printer;
            },
            enumerable: false
        }
    })
}

Table.prototype.cell = function (col, val, printer, length) {
    this.line.__cell(col, val, printer)
    var c = this.columns[col] || (this.columns[col] = {
        printer: printer || Table.string
    });
    c.length = length > c.length || c.length == null ? length : c.length
    return this;
}

Table.prototype.newLine = function () {
    this.lines.push(this.line);
    this.line = new Line;
    return this;
}

Table.prototype.shift = '  ';

Table.prototype.toString = function () {
    return new Printer(this).print();
}

Table.prototype.sort = require('./sort');


function Printer (table) {
    this.table = table
    this.columns = table.columns
    this.colLengths = {}
    this.shift = table.shift
}

Printer.prototype.print = function () {
    var padWithDashs = RightPadder('-');

    var s = '';

    this.calcColumnLengths();

    s += this.printLine(function (key) {
        return key;
    });

    s += this.printLine(function (key, length) {
        return padWithDashs('', length);
    });

    this.forEachLine(function (line) {
        s += this.printLine(function (key, length) {
            return this.cellPrinter(line, key).call(line, line[key], length);
        });
    });

    return s;
}

Printer.prototype.forEachLine = function (cb) {
    return this.table.lines.forEach(cb, this);
}

Printer.prototype.cellPrinter = function (line, col) {
    return line.__printers[col] || this.columns[col].printer;
}


Printer.prototype.calcColumnLengths = function () {
    var setLength = function (col, length) {
        var isFixed = this.columns[col].length != null;
        if (isFixed) {
            this.colLengths[col] = this.columns[col].length
        } else {
            if (this.colLengths[col] > length) return
            this.colLengths[col] = length
        }
    }.bind(this)

    for (var key in this.columns) {
        setLength(key, key.length)
    }

    this.forEachLine(function (line) {
        for (var key in this.columns) {
            setLength(key, this.cellPrinter(line, key).call(line, line[key]).length)
        }
    })
}

Printer.prototype.printLine = function (print) {
    var s = '';
    var firstColumn = true;
    for (var key in this.columns) {
        if (!firstColumn) s += this.shift;
        firstColumn = false;
        var l = this.colLengths[key]
        s += printCell(print.call(this, key, l), l);
    }
    s += '\n';
    return s;
}

function printCell (s, length) {
    if (s.length <= length) return padSpaces(s, length);
    s = s.slice(0, length);
    if (length > 3) s = s.slice(0, -3).concat('...');
    return s;
}

var padSpaces = RightPadder();

function RightPadder (char) {
    char = char || ' ';
    return function (obj, length) {
        var s = String(obj);
        var l = s.length;
        for (var i = 0; i < length - l; i++) {
            s += char;
        }
        return s;
    }
}

function LeftPadder (char) {
    char = char || ' ';
    return function (obj, length) {
        var ret = '';
        var s = String(obj);
        for (var i = 0; i < length - s.length; i++) {
            ret += char;
        }
        ret += s;
        return ret;
    }
}


Table.padLeft = LeftPadder();

Table.string = function (obj) {
    if (obj === undefined) return '';
    return String(obj);
}