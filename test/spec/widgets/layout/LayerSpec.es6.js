/**
 * @file Specs for Layer
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Layer = require('Layer.jsx');

    function realRender(Component, props) {
        props = props;
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }


    function getComponent(layerProps) {
        return React.createClass({
            getInitialState: function () {
                return {};
            },
            render() {
                return (
                    <div>
                        <div ref="anchor"></div>
                        {
                            this.state.disposeLayer ? null : 
                            (<Layer ref="layer" {...layerProps} anchor={this.refs.anchor}>
                                <div></div>
                            </Layer>)
                        }
                    </div>
                );
            }
        }); 
    }
    
    describe('Layer', () => {

        describe('Base Testing', () => {

            it('Layer Close By Window', () => {
                let onBeforeCloseByWindowDone = false;
                let dom = realRender(getComponent({
                    isOpen: true,
                    closeWithBodyClick: true,
                    onBeforeCloseByWindow: function () {
                        onBeforeCloseByWindowDone = true;
                    }
                }));
                dom.refs.layer.onBodyClick({returnValue: true});
                expect(onBeforeCloseByWindowDone).toBe(true);
                expect(dom.refs.layer.___layerContainer___.childNodes.length).toBe(0);
                dom.setState({disposeLayer: true});
                expect(dom.refs.layer).toBe(undefined);
            });

            it('Layer MouseEvent', () => {
                let onLayerMouseEnterDone = false;
                let onLayerMouseLeaveDone = false;
                let dom = realRender(getComponent({
                    isOpen: true,
                    onMouseEnter: function () {
                        onLayerMouseEnterDone = true;
                    },
                    onMouseLeave: function () {
                        onLayerMouseLeaveDone = true;
                    }
                }));
                dom.refs.layer.onLayerMouseEnter({returnValue: true});
                expect(onLayerMouseEnterDone).toBe(true);
                dom.refs.layer.onLayerMouseLeave({returnValue: true});
                expect(onLayerMouseLeaveDone).toBe(true);
            });

        });

    });
});
