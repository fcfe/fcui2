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
    const TitleWindow = require('TitleWindow.jsx');


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
                            (<TitleWindow title={this.state.titleWindow}
                                isOpen={this.state.open}
                                ref="titlewindow" {...layerProps} anchor={this.refs.anchor}>
                                <div></div>
                            </TitleWindow>)
                        }
                    </div>
                );
            }
        }); 
    }
    
    describe('TitleWindow', () => {

        describe('Base Testing', () => {

            it('Normal TitleWindow', () => {
                let dom = realRender(getComponent({}));
                dom.setState({titleWindow: false});
                expect(dom.refs.titlewindow).toBe(undefined);
                dom.setState({titleWindow: 'abcded'});
                expect(dom.refs.titlewindow.___workspace___ .className).toBe('fcui2-titlewindow fcui2-titlewindow-normal');
            });

            it('Close TitleWindow', () => {
                let dom = realRender(getComponent({}));
                dom.setState({titleWindow: 'abcded'});
                dom.refs.titlewindow.close();
                expect(dom.refs.titlewindow.___appended___).toBe(false);
            });

            it('FullScreen TitleWindow', () => {
                let dom = realRender(getComponent({isFullScreen: true}));
                dom.setState({open: false});
                expect(dom.refs.titlewindow.___appended___).toBe(false);
            });

        });

    });
});
