/**
 * @file Specs for Select
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const util = require('core/util');




    describe('util', () => {

        describe('Base Testing', () => {

            it('dateFormat', () => {
                let date = new Date();
                date.setFullYear(2012);
                date.setMonth(0);
                date.setDate(31);
                expect(util.dateFormat(date, 'YYYY-MM-DD')).toBe('2012-01-31');
            });

        });

    });
});
