/**
 * @file Specs for WarningLayer
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const WarningLayer = require('WarningLayer.jsx');


    function realRender(Component, props = {}) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('WarningLayer', () => {

        describe('Base Testing', () => {

            it('default', () => {
                let dom = realRender(WarningLayer, {
                    message: 'hehe',
                    anchor: document.createElement('div')
                });
                expect(dom.refs.container.className).toBe('fcui2-warninglayer fcui2-warninglayer-warning browser-chrome');
                expect(dom.refs.container.childNodes.length).toBe(2);
            });

        });

    });
});
