var should = require('should');
var Table = require('../lib/table');

describe('Easy table', function () {
    var t;

    beforeEach(function () {
        t = new Table;
    });

    function expectLine (line) {
        line--;
        return t.toString().split('\n')[line].should;
    }

    it('test', function () {
        t.cell('First column', '11');
        t.cell('Second column', '12');
        t.newLine();

        t.cell('First column', '21');
        t.cell('Second column', '22');
        t.newLine();

        t.toString().should.equal(
            'First column' + t.shift + 'Second column' + '\n' +
            '------------' + t.shift + '-------------' + '\n' +
            '11          ' + t.shift + '12           ' + '\n' +
            '21          ' + t.shift + '22           ' + '\n'
        );
    });

    it('Should adjust column width to fit all contents', function () {
        t.cell('col', '').newLine();
        expectLine(1).be.equal('col');

        t.cell('col', 'value').newLine();
        expectLine(1).be.equal('col  ');
    });

    describe('Should accept print function as third parameter to .cell() method and call it two times', function () {
        it('First time to determine minimal width', function () {
            var callCount = 0;
            function print (obj) {
                obj.should.equal(10);
                if (callCount == 0) arguments.length.should.equal(1);
                callCount++;
                return obj.toString();
            }
            t.cell('col', 10, print);
        });

        it('Second time asking to render actual value passing additional length parameter', function () {
            var callCount = 0;
            function print (obj, length) {
                obj.should.equal(10);
                if (callCount == 1) length.should.equal(4);
                callCount++;

                if (arguments.length == 1) return '10  ';
                return ' 10 ';
            }
            t.cell('col', 10, print).newLine();
            expectLine(3).be.equal(' 10 ');
        });
    });

    describe('Should accept column length as 4-th parameter to .cell() method. In such case:', function () {
        it('Column length should be fixed', function () {
            t.cell('col', 'value', null, 10).newLine();
            expectLine(3).be.equal('value     ');
        });

        it('If cell value doesn`t fit column width it should be trancated', function () {
            t.cell('col', 'A very long value', null, 14).newLine();
            expectLine(3).be.equal('A very long...');
        });
    });

    it('test Table.padLeft()', function () {
        Table.padLeft('a', 2).should.equal(' a');
    });
});

