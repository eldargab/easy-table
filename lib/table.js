module.exports = Table;

function Table () {
    this.shift = '  ';
    this.columns = {};
    this.lines = [];
    this.line = {};
}

Table.prototype.column = function (key) {
    return this.columns[key] || (this.columns[key] = {length: key.length})
}

Table.prototype.cell = function (col, obj, printer, length) {
    var c = this.column(col);
    c.printer = printer || Table.string;
    this.line[col] = obj;
    if (length != null) {
        c.length = length;
    }
    else {
        var s = c.printer(obj);
        c.length = s.length > c.length ? s.length : c.length;
    }
    return this;
}

Table.prototype.newLine = function () {
    this.lines.push(this.line);
    this.line = {};
    return this;
}

Table.prototype.toString = function () {
    var self = this;
    var pad = Table.RightPadder();
    var padWithDashs = Table.RightPadder('-');

    function printCell (s, length) {
        if (s.length <= length) return pad(s, length);
        s = s.slice(0, length);
        if (length > 3) s = s.slice(0, -3).concat('...');
        return s;
    }

    var s = '';
    
    s += this._printLine(function (key, col) {
        return printCell(key, col.length);
    });

    s += this._printLine(function (key, col) {
        return padWithDashs('', col.length);
    });

    this.lines.forEach(function (line) {
        s += self._printLine(function (key, col) {
            return printCell(col.printer(line[key], col.length), col.length);
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
        s += print(key, this.columns[key]);    
    }
    s += '\n';
    return s;
}

Table.string = function (obj) {
    return String(obj);
}

Table.LeftPadder = function (char) {
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

Table.padLeft = Table.LeftPadder();

Table.RightPadder = function (char) {
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
