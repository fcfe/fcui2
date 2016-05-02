/**
 * @file spec for scheduleTools
 * @author Han Bing Feng
 */

define(function (require) {
    var _ = require('underscore');
    var scheduleTools = require('core/scheduleTools');

    function getParsedLength168Array() {
        var arr = [];
        for (var i = 0; i < 168; i++) {
            arr.push('');
        }
        return JSON.stringify(arr);
    }

    describe('schedule', function () {
        describe('scheduleTools', function () {
            it('parses 168-length array to 7x24 length array', function () {
                var arr = getParsedLength168Array();
                var res = scheduleTools.parseValue(arr);
                expect(res.length).toBe(7);
                res.forEach(function (item) {
                    expect(item.length).toBe(24);
                    item.forEach(function (innerItem) {
                        expect(innerItem).toBe('');
                    });
                });
            });

            it('returns nothing for unexpected input', function () {
                expect(scheduleTools.parseValue('!')).toEqual([]);
            });

            it('puts correct value in correct pos', function () {
                var arr = getParsedLength168Array();
                // 7th position every day put '1.0'
                arr = JSON.parse(arr);
                _.each(_.range(7, 168, 24), function (v) {
                    arr[v] = '1.0';
                });

                arr = JSON.stringify(arr);
                var res = scheduleTools.parseValue(arr);
                res.forEach(function (item) {
                    expect(item[7]).toBe('1.0');
                });
            });
        });
    });
});
