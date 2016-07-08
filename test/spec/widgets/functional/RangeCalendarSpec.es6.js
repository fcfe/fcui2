/**
 * @file Specs for RangeCalendar
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const RangeCalendar = require('RangeCalendar.jsx');
    const calendarTools = require('core/calendarTools');
    const util = require('core/util');

    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    const shortCut = [
        {label: '今天', getValues: calendarTools.getDataRange.today},
        {label: '昨天', getValues: calendarTools.getDataRange.yesterday},
        {label: '前天', getValues: calendarTools.getDataRange.beforeYesterday},
        {label: '上周', getValues: calendarTools.getDataRange.lastWeek},
        {label: '过去7天', getValues: calendarTools.getDataRange.last7},
        {label: '过去14天', getValues: calendarTools.getDataRange.last14},
        {label: '过去30天', getValues: calendarTools.getDataRange.last30},
        {label: '本月', getValues: calendarTools.getDataRange.currentMonth},
        {label: '上月', getValues: calendarTools.getDataRange.lastMonth},
        {label: '上季度', getValues: calendarTools.getDataRange.lastQuarter}
    ];

    describe('RangeCalendar', () => {

        describe('Base Testing', () => {

            it('Normal RangeCalendar', () => {
                let dom = realRender(RangeCalendar, {
                    value: '2016-07-01;2016-07-31'
                });
                expect(dom.refs.container.childNodes[1].innerHTML).toBe('2016.07.01 - 2016.07.31');
                ReactDOM.render(
                    React.createElement(RangeCalendar, {value: ''}),
                    dom.refs.container.parentNode
                );
                expect(dom.refs.container.childNodes[1].innerHTML).toBe('please select');
            });

            it('open layer', () => {
                let dom = realRender(RangeCalendar, {
                    value: '2016-07-01;2016-07-31'
                });
                TestUtils.Simulate.click(dom.refs.container);
                expect(dom.state.layerOpen).toBe(true);
                dom.setState({layerOpen: false})
                ReactDOM.render(
                    React.createElement(RangeCalendar, {disabled: true}),
                    dom.refs.container.parentNode
                );
                TestUtils.Simulate.click(dom.refs.container);
                expect(dom.state.layerOpen).toBe(false);
            });

            it('events', () => {
                let value = '';
                let dom = realRender(RangeCalendar, {
                    value: '2016-07-01;2016-07-31',
                    min: '',
                    max: '',
                    rangeValidator() {
                        return '';
                    },
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                expect(dom.refs.c1).toBe(undefined);
                TestUtils.Simulate.click(dom.refs.container);
                expect(dom.refs.c1.refs.container.className).toBe('fcui2-calendar fcui2-calendar-normal');
                let c1 = dom.refs.c1;
                TestUtils.Simulate.click(c1.refs.container.childNodes[2].childNodes[5]);
                TestUtils.Simulate.click(dom.refs.enterButton.refs.container);
                expect(value).toBe('2016-07-02;2016-07-31');
                expect(dom.refs.c1).toBe(undefined);

                TestUtils.Simulate.click(dom.refs.container);
                let c2 = dom.refs.c2;
                TestUtils.Simulate.click(c2.refs.container.childNodes[2].childNodes[5]);
                TestUtils.Simulate.click(dom.refs.cancelButton.refs.container);
                expect(value).toBe('2016-07-02;2016-07-31');
                expect(dom.refs.c1).toBe(undefined);
            });

            it('short cut', () => {
                let value = '';
                let dom = realRender(RangeCalendar, {
                    value: '2016-07-01;2016-07-31',
                    shortCut: shortCut,
                    min: null,
                    max: null,
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(dom.refs.container);
                let shortCutContainer = dom.refs.layer.___layerContainer___.childNodes[0].childNodes[0];
                expect(shortCutContainer.childNodes.length).toBe(shortCut.length);
                TestUtils.Simulate.click(shortCutContainer.childNodes[0]);
                TestUtils.Simulate.click(dom.refs.enterButton.refs.container);
                expect(value).toBe(
                    util.dateFormat(new Date(), 'YYYY-MM-DD') + ';' + util.dateFormat(new Date(), 'YYYY-MM-DD')
                );

                dom = realRender(RangeCalendar, {
                    value: '2016-07-01;2016-07-31',
                    min: '9999-12-31',
                    max: '0-0-0',
                    shortCut: shortCut.concat({
                        label: 'hehe',
                        getValues() {return false;}
                    }),
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(dom.refs.container);
                shortCutContainer = dom.refs.layer.___layerContainer___.childNodes[0].childNodes[0];
                TestUtils.Simulate.click(shortCutContainer.childNodes[0]);
                TestUtils.Simulate.click(dom.refs.enterButton.refs.container);
                expect(value).toBe(
                    util.dateFormat(new Date(), 'YYYY-MM-DD') + ';' + util.dateFormat(new Date(), 'YYYY-MM-DD')
                );

                TestUtils.Simulate.click(dom.refs.container);
                shortCutContainer = dom.refs.layer.___layerContainer___.childNodes[0].childNodes[0];
                TestUtils.Simulate.click(shortCutContainer.childNodes[shortCut.length]);

                value = '';
                dom = realRender(RangeCalendar, {
                    value: '2016-07-01;2016-07-31',
                    min: '1990-01-01',
                    max: '2020-12-31',
                    rangeValidator(v1, v2) {
                        if (
                            util.dateFormat(v1, 'YYYY-MM-DD') === '1990-01-01'
                            && util.dateFormat(v2, 'YYYY-MM-DD') === '2020-12-31'
                        ) {
                            return '???';
                        }
                        return null;
                    },
                    shortCut: [
                        {
                            label: 'max_value1',
                            getValues() {
                                return {
                                    value1: calendarTools.str2date('2025-01-01'),
                                    value2: calendarTools.str2date('2016-01-01')
                                }
                            }
                        },
                        {
                            label: 'value2_min',
                            getValues() {
                                return {
                                    value1: calendarTools.str2date('1800-01-01'),
                                    value2: calendarTools.str2date('1984-09-12')
                                }
                            }
                        },
                        {
                            label: 'value1_min_max_value2',
                            getValues() {
                                return {
                                    value1: calendarTools.str2date('1800-01-01'),
                                    value2: calendarTools.str2date('2025-01-01')
                                }
                            }
                        }
                    ],
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                value = '';
                TestUtils.Simulate.click(dom.refs.container);
                shortCutContainer = dom.refs.layer.___layerContainer___.childNodes[0].childNodes[0];
                TestUtils.Simulate.click(shortCutContainer.childNodes[0]);
                TestUtils.Simulate.click(dom.refs.enterButton.refs.container);
                expect(value).toBe('2016-07-01;2016-07-31');
                value = '';
                TestUtils.Simulate.click(dom.refs.container);
                shortCutContainer = dom.refs.layer.___layerContainer___.childNodes[0].childNodes[0];
                TestUtils.Simulate.click(shortCutContainer.childNodes[1]);
                TestUtils.Simulate.click(dom.refs.enterButton.refs.container);
                expect(value).toBe('2016-07-01;2016-07-31');
                value = '';
                TestUtils.Simulate.click(dom.refs.container);
                shortCutContainer = dom.refs.layer.___layerContainer___.childNodes[0].childNodes[0];
                TestUtils.Simulate.click(shortCutContainer.childNodes[2]);
                expect(dom.refs.enterButton.props.disabled).toBe(true);
                TestUtils.Simulate.click(dom.refs.enterButton.refs.container);
                expect(value).toBe('');
                TestUtils.Simulate.click(dom.refs.cancelButton.refs.container);
                expect(dom.refs.cancelButton).toBe(undefined);
            });

        });

    });
});
