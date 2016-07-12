/**
 * @file Specs for Region
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Region = require('Region.jsx');


    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Region', () => {

        describe('Base Testing', () => {

            it('Normal Region', () => {
                let dom = realRender(Region, {});
                expect(dom.refs.container.childNodes.length).toBe(11);
            });

            it('events', () => {
                let value = '';
                let dom = realRender(Region, {
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[0]
                        .childNodes[0].childNodes[1]
                );
                expect(value).toBe('1');
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[0]
                        .childNodes[0].childNodes[1]
                );
                expect(value).toBe('');
                let checkbox = dom.refs.container.childNodes[0].childNodes[0].childNodes[0];
                expect(checkbox.type).toBe('checkbox');
                checkbox.checked = true;
                TestUtils.Simulate.change(checkbox, {target: checkbox});
                expect(value.split(',').length).toBe(401);

                let province = dom.refs.container.childNodes[1].childNodes[1].childNodes[2];
                expect(province.className).toBe('fcui2-region-province');
                TestUtils.Simulate.mouseEnter(province);
                expect(dom.___currentLayer___.props.id).toBe(13);
                expect(dom.___currentLayer___.state.layerShow).toBe(true);

                province = dom.refs.container.childNodes[1].childNodes[1].childNodes[3];
                TestUtils.Simulate.mouseEnter(province);
                expect(dom.___currentLayer___.props.id).toBe(26);

                TestUtils.Simulate.mouseLeave(province);
            });

            it('disabled', () => {
                let value = '';
                let dom = realRender(Region, {
                    disabled: true,
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[0]
                        .childNodes[0].childNodes[1]
                );
                expect(value).toBe('');
                dom.onRegionChange();
                let checkbox = dom.refs.container.childNodes[0].childNodes[0].childNodes[0];
                expect(checkbox.type).toBe('checkbox');
                checkbox.checked = true;
                TestUtils.Simulate.change(checkbox, {target: checkbox});
                expect(value).toBe('');

                let province = dom.refs.container.childNodes[1].childNodes[1].childNodes[2];
                expect(province.className).toBe('fcui2-region-province');
                TestUtils.Simulate.mouseEnter(province);
                expect(dom.___currentLayer___).toBe();
                TestUtils.Simulate.mouseLeave(province);
            });

            it('type = single', () => {
                let value = '';
                let dom = realRender(Region, {
                    type: 'single',
                    countryRenderer: null,
                    regionRenderer: null,
                    provinceRenderer: null,
                    onChange(e) {
                        value = e.target.value;
                    }
                });
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[0]
                        .childNodes[0].childNodes[2]
                );
                expect(value).toBe('1');
                TestUtils.Simulate.click(
                    dom.refs.container.childNodes[1].childNodes[1].childNodes[1]
                        .childNodes[0].childNodes[2]
                );
                expect(value).toBe('3');
            });

        });

    });
});
