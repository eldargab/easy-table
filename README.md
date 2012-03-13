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
    t.newLine();
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

## Installation

Just install from the npm repository with:

```
$ npm install easy-table
```
