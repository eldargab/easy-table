var util = require('./util')

module.exports = function print (rows, columns, shift) {
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
        return row.__printers[col] || columns[col].printer
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

    var ret = ''

    calcWidths()

    ret += printRow(function (key) {
        return key
    })

    ret += printRow(function (key, width) {
        return util.padWithDashs('', width)
    })

    rows.forEach(function (row) {
        ret += printRow(function (key, width) {
            return cellPrinter(row, key).call(row, row[key], width)
        })
    })

    return ret
}