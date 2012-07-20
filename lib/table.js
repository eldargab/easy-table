module.exports = Table;

function Table () {
    this.shift = '  ';
    this.columns = {};
    this.lines = [];
    this.line = {};
}

Table.prototype.cell = function (col, obj, printer, length) {
    this.line[col] = obj;

    var c = this.columns[col] || (this.columns[col] = {length: col.length});
    c.printer = printer || Table.string;
    if (length != null) {
        c.length = length;
    }
    else {
        var s = c.printer(obj),
            sl = realLength(s);
        c.length = sl > c.length ? sl : c.length;
    }
    return this;
}

Table.prototype.newLine = function () {
    this.lines.push(this.line);
    this.line = {};
    return this;
}

Table.prototype.sort = require('./sort');


Table.prototype.toString = function () {
    var self = this;
    var padWithDashs = RightPadder('-');

    var s = '';
    
    s += this._printLine(function (key) {
        return key;
    });

    s += this._printLine(function (key, col) {
        return padWithDashs('', col.length);
    });

    this.lines.forEach(function (line) {
        s += self._printLine(function (key, col) {
            return col.printer(line[key], col.length);
        });
    });

    return s;
}

Table.prototype._printLine = function (print) {
    var s = '';
    var firstColumn = true;
    for (var key in this.columns) {
        if (!firstColumn) s += this.shift;
        firstColumn = false;
        var col = this.columns[key];
        s += printCell(print(key, col), col.length);    
    }
    s += '\n';
    return s;
}

function printCell (s, length) {
    if (realLength(s) <= length) return padSpaces(s, length);
    s = s.slice(0, length);
    if (length > 3) s = s.slice(0, -3).concat('...');
    return s;
}

function realLength(str) {
  return ("" + str).replace(/\u001b\[\d+m/g,'').length;
}

var padSpaces = RightPadder();

function RightPadder (char) {
    char = char || ' ';
    return function (obj, length) {
        var s = String(obj);
        var l = realLength(s);
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
