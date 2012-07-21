# Easy table

Simple and nice utility for rendering text tables with javascript.

## Usage

``` javascript
var Table = require('easy-table');

var data = [
    { id: 123123, desc: 'Something awesome', price: 1000.00 },
    { id: 245452, desc: 'Very interesting book', price: 11.45},
    { id: 232323, desc: 'Yet another product', price: 555.55 }
]

var t = new Table;

data.forEach(function (product) {
    t.cell('Product Id', product.id);
    t.cell('Description', product.desc);
    t.cell('Price, USD', product.price.toFixed(2), Table.padLeft);
    t.newRow();
});

console.log(t.toString());
```

The script above will render:

```
Product Id  Description            Price, USD
----------  ---------------------  ----------
123123      Something awesome         1000.00
245452      Very interesting book       11.45
232323      Yet another product        555.55

```

The full signature of `.cell()` method is:

``` javascript
t.cell(column, value, printer, width)
```

Where `column` is a column name to print, `value` - cell's value, `printer` is
a function with which cell's value should be printed, `width` - column's width.

By default column's width is ajusted to fit the longest value, but if specified
explicitly it is fixed and any non-fitting cell is truncated.

Cell's value rendering occures in two phases. At the first phase `printer`
function is called to get minimal width required to fit cell correctly, at the
second phase `printer` function is called to get actual string to render with
additional `width` parameter supplied.

You can sort a table by calling `.sort()`, and optionally passing in a list of
column names to sort on (by default uses all columns), or a custom comparator
function. It is also possible to specify the sort order. For example:

``` javascript
t.sort(['Price, USD|des']) // will sort in descending order
t.sort(['Price, USD|asc']) // will sort in ascending order
t.sort(['Price, USD']) // sorts in ascending order by default
```

## Installation

Just install from the npm repository with:

```
$ npm install easy-table
```

## License

(The MIT License)

Copyright (c) 2012 Eldar Gabdullin <eldargab@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
