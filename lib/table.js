module.exports = Table;

var _divider = {};

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
    c.printer = printer || c.printer || Table.string;
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
        if (line === _divider) {
            s += self._printLine(function (key, col) {
                return padWithDashs('', col.length);
            });
        } else {
            s += self._printLine(function (key, col) {
                return printCell(col.printer(line[key], col.length), col.length);
            });
        }
    });

    return s;
}

// pass either a comparator function, or an array of keys to sort on
Table.prototype.sort = function (comparator) {
    var keys = Object.keys(this.columns);
    if (typeof comparator === 'function') {
        // use as a function
    } else if (Object.prototype.toString.apply(comparator) === '[object Array]') {
        keys = comparator;
        comparator = undefined;
    }
    comparator = comparator || function (a, b) {
        for (var ii in keys) {
            var key = keys[ii];
            if (a[key] < b[key]) {
                return -1;
            }
            if (b[key] < a[key]) {
                return 1;
            }
        }
        return 0;
    };
    this.lines.sort(comparator);
};

// pass in an array of keys to total, otherwise all numeric keys will be totaled
Table.prototype.totals = function(keys, label) {
    keys = keys || Object.keys(this.columns);
    label = label || 'TOTALS';
    var totals = {};
    var ii, jj, key;
    for (ii in this.lines) {
        var line = this.lines[ii];
        for (jj in keys) {
            key = keys[jj];
            var val = line[key];
            if (typeof val === 'number') {
                totals[key] = (totals[key] || 0) + val;
            }
        }
    }
    this.lines.push(_divider); // add divider
    var first = true;
    for (key in this.columns) {
        if (totals[key]) {
            this.cell(key, totals[key]);
        } else if (first) {
            // first item, add label
            this.cell(key, label);
        } else {
            // Put in empty string instead of 'undefined'
            this.cell(key, '');
        }
        first = false;
    }
    this.newLine();
};

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
