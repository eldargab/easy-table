module.exports = sort;

function sort (comparator) {
    if (typeof comparator != 'function') {
        var sortKeys = Array.isArray(comparator)
            ? comparator
            : Object.keys(this.columns);
        comparator = KeysComparator(sortKeys);
    }
    this.lines.sort(comparator);
    return this;
}

function KeysComparator (keys) {
    var comparators = keys.map(function (key) {
        var sortFn = 'asc'; 

        var m = /(.*)\|\s*(asc|des)\s*$/.exec(key);
        if (m) {
            key = m[1];
            sortFn = m[2];
        }

        return function compare (a, b) {
            var va = a[key];
            var vb = b[key];
            var ret = 0;
            if (va > vb) ret = 1;
            if (va < vb) ret = -1;
            return sortFn == 'asc' ? ret : -1 * ret;
        }
    });

    return function compare (a, b) {
        for (var i = 0; i < comparators.length; i++) {
            var res = comparators[i](a, b)
            if (res != 0) return res;
        }
        return 0;
    }
}