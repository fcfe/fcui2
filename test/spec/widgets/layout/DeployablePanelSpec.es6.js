/**
 * @file Specs for DeployablePanel
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const DeployablePanel = require('DeployablePanel.jsx');


    function realRender(Component, props) {
        props = props;
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }


    function getComponent(props) {
        return React.createClass({
            render() {
                return (
                    <DeployablePanel {...props} ref="demo">
                        <div>哈哈哈</div>
                    </DeployablePanel>
                );
            }
        }); 
    }
    
    describe('DeployablePanel', () => {

        describe('Base Testing', () => {

            it('Normal DeployablePanel', () => {
                let dom = realRender(getComponent({
                    value: 'expand'
                })).refs.demo;
                expect(dom.refs.container.childNodes.length).toBe(2);
                expect(dom.refs.container.childNodes[0].childNodes.length).toBe(1);
                expect(dom.refs.container.childNodes[0].childNodes[0].innerHTML).toBe('哈哈哈');
            });

            it('event', () => {
                let value = '';
                let dom = realRender(getComponent({
                    value: 'hide',
                    onChange(e) {
                        value = e.target.value;
                    }
                })).refs.demo;
                TestUtils.Simulate.click(dom.refs.container.childNodes[1].childNodes[0]);
                expect(value).toBe('expand');
                dom = realRender(getComponent({
                    value: 'expand',
                    onChange(e) {
                        value = e.target.value;
                    }
                })).refs.demo;
                TestUtils.Simulate.click(dom.refs.container.childNodes[1].childNodes[0]);
                expect(value).toBe('hide');
            });
        });

    });
});
