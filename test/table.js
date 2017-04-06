var should = require('should')
var Table = require('..')

describe('Easy table', function() {
  var t

  beforeEach(function() {
    t = new Table
  })

  function expectLine(line) {
    line--
    return t.toString().split('\n')[line].should
  }

  it('Formating', function() {
    t.cell('First column', '11')
    t.cell('Second column', '12')
    t.newRow()

    t.cell('First column', '21')
    t.cell('Second column', '22')
    t.newRow()

    t.toString().should.equal(
      'First column' + t.separator + 'Second column' + '\n' +
      '------------' + t.separator + '-------------' + '\n' +
      '11          ' + t.separator + '12           ' + '\n' +
      '21          ' + t.separator + '22           ' + '\n'
    )

    t.print().should.equal(
      '11' + t.separator + '12\n' +
      '21' + t.separator + '22\n'
    )
  })

  it('Printing transposed version', function() {
    t.cell('c1', 11).cell('c2', 12).newRow()
    t.cell('c1', 21).cell('c2', 22).newRow()
    t.printTransposed({separator: ':'}).should.equal(
      'c1:11:21\n' +
      'c2:12:22\n'
    )
  })

  it('Columns ordering', function() {
    t.cell('1').cell('3').cell('5').newRow()
    t.cell('1').cell('4').cell('5').newRow()
    t.cell('2').cell('4').newRow()
    t.columns().should.eql(['1', '2', '3', '4', '5'])

    t = new Table
    t.cell('1').cell('3').cell('5').newRow()
    t.cell('2').cell('4').newRow()
    t.cell('1').cell('4').cell('5').newRow()
    t.columns().should.eql(['1', '2', '3', '4', '5'])

    t = new Table
    t.cell('3').newRow()
    t.cell('3').cell('4').cell('5').newRow()
    t.cell('1').cell('2').cell('3').newRow()
    t.columns().should.eql(['1', '2', '3', '4', '5'])
  })

  it('Table.print(array)', function() {
    var arr = [{foo: 'foooo', bar: 1 }]
    Table.print(arr, {
      bar: {
        name: 'baz',
        printer: Table.padLeft
      }
    }).should.equal(
      'foo  ' + '  ' + 'baz\n' +
      '-----' + '  ' + '---\n' +
      'foooo' + '  ' + '  1\n'
    )
  })

  it('Table.print(obj)', function() {
    var obj = {
      foo: 'foo',
      bar: 1
    }
    Table.print(obj).should.equal(
      'foo : foo\n' +
      'bar : 1  \n'
    )
  })

  describe('Should accept print function as third parameter to .cell() method and call it two times', function () {
    it('First time to determine minimal width', function() {
      var callCount = 0
      function print(obj) {
        obj.should.equal(10)
        if (callCount == 0) arguments.length.should.equal(1)
        callCount++
        return obj.toString()
      }
      t.cell('col', 10, print).newRow().toString()
      callCount.should.be.equal(2)
    })

    it('Second time asking to render actual value passing additional length parameter', function() {
      var callCount = 0
      function print(obj, length) {
        obj.should.equal(10)
        if (callCount == 1) length.should.equal(3)
        callCount++

        if (arguments.length == 1) return '10'
        return ' 10'
      }
      t.cell('col', 10, print).newRow()
      expectLine(3).be.equal(' 10')
    })

    it('It should be called with `this` set to row', function() {
      function print(obj) {
        this.should.have.property('bar')
        this.should.have.property('baz')
        return obj.toString()
      }
      t.cell('bar', 1, print).cell('baz', 2, print).newRow().toString()
    })
  })

  it('Table.padLeft()', function() {
    Table.padLeft('a', 2).should.equal(' a')
  })

  it('Sorting', function() {
    t.cell('a', 1).newRow()
    t.cell('a', 2).newRow()
    t.cell('a', null).newRow()
    t.cell('a', undefined).newRow()
    t.sort(['a|des'])
    expectLine(3).be.equal('    ')
    expectLine(4).be.equal('null')
    expectLine(5).be.equal('2   ')
    expectLine(6).be.equal('1   ')

    t.sort(['a'])
    expectLine(3).be.equal('1   ')
    expectLine(4).be.equal('2   ')

    t.sort(['a|des']).sort(['a|asc'])
    expectLine(3).be.equal('1   ')
    expectLine(4).be.equal('2   ')
  })

  describe('Totals', function() {
    it('Default totaling', function() {
      t.cell('a', 1).newRow()
      t.cell('a', 2).newRow()
      t.total('a')
      expectLine(6).be.equal('3')
    })

    it('Custom', function() {
      t.cell('just column', 1).newRow()
      t.cell('just column', 2).newRow()
      t.total('just column', {
        printer: Table.aggr.printer('Avg: ', Table.number()),
        reduce: Table.aggr.avg,
        init: 3
      })
      expectLine(6).be.equal('     Avg: 3')
    })
  })
})

