var util = require('./util')

module.exports = Table

Table.string = util.string
Table.number = util.number
Table.padLeft = util.padLeft
Table.RightPadder = util.RightPadder
Table.LeftPadder = util.LeftPadder
Table.aggr = util.aggr


function Table () {
    this.columns = {}
    this.rows = []
    this.row = new Row
}

function Row () {
    Object.defineProperties(this, {
        __printers: {
            value: {},
            enumerable: false
        },
        __cell: {
            value: function (col, val, printer) {
                this[col] = val
                this.__printers[col] = printer
            },
            enumerable: false
        }
    })
}

Table.prototype.cell = function (col, val, printer, width) {
    this.row.__cell(col, val, printer)
    var c = this.columns[col] || (this.columns[col] = {})
    if (width != null) c.width = width
    return this
}

Table.prototype.newRow = Table.prototype.newLine = function () {
    this.rows.push(this.row)
    this.row = new Row
    return this
}

Table.prototype.sort = require('./sort')

Table.prototype.total = function (col, fn, printer) {
    fn = fn || util.aggr.sum
    printer = printer || fn.printer

    this._totals = this._totals || new Row

    var val
    var rows = this.rows

    this._totals.__cell(col, null, function (_, width) {
        if (width != null) return printer(val, width)
        val = rows.reduce(function (val, row, index) {
            return fn(val, row[col], index, rows.length)
        }, null)
        return printer(val)
    })
    return this
}

Table.prototype.shift = '  '

Table.prototype.toString = function () {
    var delimeter = this._row(function () {
        return ['', util.padWithDashs]
    })
    var head = this._row(function (key) {
        return [key, Table.string]
    })
    var rows = [head, delimeter].concat(this.rows)
    if (this._totals) {
        rows = rows.concat([delimeter, this._totals])
    }
    return print(rows, this.columns, this.shift)
}

Table.prototype._row = function (cb) {
    var row = new Row
    for (var key in this.columns) {
        var args = cb(key)
        row.__cell(key, args[0], args[1])
    }
    return row
}

function print (rows, columns, shift) {
    var widths = {}

    function setWidth (col, width) {
        var isFixed = columns[col].width != null
        if (isFixed) {
            widths[col] = columns[col].width
        } else {
            if (widths[col] > width) return
            widths[col] = width
        }
    }

    function cellPrinter (row, col) {
        return row.__printers[col] || util.string
    }

    function calcWidths () {
        for (var key in columns) {
            setWidth(key, key.length)
        }

        rows.forEach(function (row) {
            for (var key in columns) {
                setWidth(key, cellPrinter(row, key).call(row, row[key]).length)
            }
        })
    }

    function printRow (cb) {
        var s = ''
        var firstColumn = true
        for (var key in columns) {
            if (!firstColumn) s += shift
            firstColumn = false
            var width = widths[key]
            s += printCell(cb(key, width), width)
        }
        s += '\n'
        return s
    }

    function printCell (s, width) {
        if (s.length <= width) return util.padSpaces(s, width)
        s = s.slice(0, width)
        if (width > 3) s = s.slice(0, -3).concat('...')
        return s
    }

    calcWidths()

    return rows.map(function (row) {
        return printRow(function (key, width) {
            return cellPrinter(row, key).call(row, row[key], width)
        })
    }).join('')
}