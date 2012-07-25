var Table = require('./lib/table')

var data = [
    { id: 123123, desc: 'Something awesome', price: 1000.00 },
    { id: 245452, desc: 'Very interesting book', price: 11.45},
    { id: 232323, desc: 'Yet another product', price: 555.55 }
]

var t = new Table

data.forEach(function (product) {
    t.cell('Product Id', product.id)
    t.cell('Description', product.desc)
    t.cell('Price, USD', product.price, Table.Number(2))
    t.newRow()
})

t.sort(['Price, USD'])
t.total('Price, USD', Table.aggr.avg, Table.aggr.Printer('Avg:', Table.Number(2)))

console.log(t.toString())
console.log(t.print())
console.log(t.printTransposed(' : '))
