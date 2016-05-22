/**
 * @file 弹出层，下拉层demo
 * @author Han Bing Feng
 */

define(function (require) {

    let React = require('react');
    let Button = require('fcui/Button.jsx');
    let Layer = require('fcui/Layer.jsx');

    let LayerContent =  React.createClass({
        getDefaultProps() {
            return {
                count: 0,
                enterHandler: function () {},
                cancelHandler: function () {}
            };
        },
        getInitialState() {
            return {};
        },
        enterHandler: function () {
            this.props.enterHandler();
        },
        cancelHandler: function () {
            this.props.cancelHandler();
        },
        render() {
            return (
                <div className="fcui2-droplayer" style={{width: 300}}>
                    <div className="fcui2-droplayer-content">
                        <h1>{'HELLO Layer NO.' + this.props.count}</h1>
                    </div>
                    <div className="fcui2-droplayer-footer" style={{padding: '10px'}}>
                        <Button label="确定" skin="important" onClick={this.enterHandler} />
                        <Button label="取消" onClick={this.cancelHandler} />
                    </div>
                </div>
            );
        }
    });


    return React.createClass({
        // @override
        getDefaultProps() {
            return {
                alert() {}
            };
        },
        getInitialState() {
            return {
                layerOpen: false,
                count: 0
            };
        },
        openLayer() {
            this.setState({
                count: this.state.count + 1,
                layerOpen: true
            });
        },
        closeLayer() {
            this.setState({
                layerOpen: false
            });
        },
        render() {
            return (
                <div>
                    <div className="demo-item" key="1">
                        <h3>Normal Popup Layer</h3>
                        <Button label="Click me to open Layer" onClick={this.openLayer}/>
                        <div ref="anchor" style={{border: '1px solid black'}}>it is anchor for Layer</div>
                        <Layer isOpen={this.state.layerOpen} anchor={this.refs.anchor} closeWithBodyClick={true}>
                            <LayerContent count={this.state.count}
                                enterHandler={this.closeLayer}
                                cancelHandler={this.closeLayer}
                            />
                        </Layer>
                    </div>
                </div>
            );
        }
    });
});
