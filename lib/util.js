
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