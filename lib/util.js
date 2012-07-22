exports.RightPadder = function (char) {
    char = char || ' '
    return function (obj, length) {
        var s = String(obj)
        var l = s.length
        for (var i = 0; i < length - l; i++) {
            s += char
        }
        return s
    }
}

exports.LeftPadder = function (char) {
    char = char || ' '
    return function (obj, length) {
        var ret = ''
        var s = String(obj)
        for (var i = 0; i < length - s.length; i++) {
            ret += char
        }
        ret += s
        return ret
    }
}

exports.padLeft = exports.LeftPadder()

exports.padWithDashs = exports.RightPadder('-')

exports.padSpaces = exports.RightPadder()

exports.string = function (val) {
    if (val === undefined) return ''
    return String(val)
}

exports.number = function (val, width) {
    return exports.padLeft(exports.string(val), width)
}


var aggr = exports.aggr = {}

aggr.Printer = function (name, format) {
    return function (val, width) {
        var s = name + ' ' + format(val)
        return width == null
            ? s
            : exports.padLeft(s, width)
    }
}

aggr.sum = function (sum, val) {
    sum = sum || 0
    return sum += val
}

aggr.sum.printer = aggr.Printer('\u2211', String)

aggr.avg = function (sum, val, index, length) {
    sum = sum || 0
    sum += val
    return index + 1 == length
        ? sum / length
        : sum
}

aggr.avg.printer = aggr.Printer('Avg:', String)