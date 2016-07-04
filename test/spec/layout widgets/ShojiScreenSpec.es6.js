/**
 * @file Specs for Select
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const ShojiScreen = require('ShojiScreen.jsx');


    function realRender(Component, props) {
        props = props || {};
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }


    function getComponent(layerProps) {
        return React.createClass({
            getInitialState: function () {
                return {
                    titleWindow: true,
                    open: true
                };
            },
            render() {
                return (
                    <div>
                        <div ref="anchor"></div>
                        {
                            !this.state.titleWindow ? null : 
                            (<ShojiScreen title={this.state.titleWindow}
                                isOpen={this.state.open}
                                ref="titlewindow" {...layerProps} anchor={this.refs.anchor}>
                                <div></div>
                            </ShojiScreen>)
                        }
                    </div>
                );
            }
        }); 
    }
    
    describe('ShojiScreen', () => {

        describe('Base Testing', () => {

            it('Normal ShojiScreen', () => {
                let dom = realRender(getComponent({}));
                dom.setState({titleWindow: false});
                expect(dom.refs.titlewindow).toBe(undefined);
                dom.setState({titleWindow: 'abcded'});
                expect(dom.refs.titlewindow.___container___ .className).toBe('fcui2-shojiscreen fcui2-shojiscreen-normal');
            });

            it('Test Close ShojiScreen', () => {
                let dom = realRender(getComponent({
                    buttonLabels: null,
                    workspaceWidth: 'abc'
                }));
                dom.setState({
                    titleWindow: 'abcded'
                });
                dom.refs.titlewindow.close();
                expect(dom.refs.titlewindow.___appended___).toBe(false);
            });

            it('Test ShojiScreen Events', () => {
                let actionType = '';
                let dom = realRender(getComponent({
                    buttonLabels: {},
                    onAction: function (a) {
                        actionType = a;
                    }
                }));
                let titleWindow = dom.refs.titlewindow;
                titleWindow.onHidden();
                expect(actionType).toBe('HideButtonClick');
                titleWindow.onExpand();
                expect(actionType).toBe('ExpandButtonClick');
                titleWindow.onButtonBarClick({
                    target: {
                        dataset: {
                            uiCmd: 'abc'
                        }
                    }
                });
                expect(actionType).toBe('abc');
                dom.setState({open: false});
                expect(titleWindow.___content___.childNodes.length).toBe(0);
            });

        });

    });
});
