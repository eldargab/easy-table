var util = require('./util')
var print = require('./print')

module.exports = Table

Table.string = function (obj) {
    if (obj === undefined) return ''
    return String(obj)
}

Table.padLeft = util.padLeft
Table.RightPadder = util.RightPadder
Table.LeftPadder = util.LeftPadder


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
    var c = this.columns[col] || (this.columns[col] = {
        printer: printer || Table.string
    })
    c.width = width > c.width || c.width == null ? width : c.width
    return this
}

Table.prototype.newRow = Table.prototype.newLine = function () {
    this.rows.push(this.row)
    this.row = new Row
    return this
}

Table.prototype.sort = require('./sort')

Table.prototype.shift = '  '

Table.prototype.toString = function () {
    return print(this.rows, this.columns, this.shift)
}