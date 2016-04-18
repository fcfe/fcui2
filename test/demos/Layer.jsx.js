/**
 * @file 弹出层，下拉层demo
 * @author Han Bing Feng
 */

define(function (require) {
    let React = require('react');
    let _ = require('underscore');
    let Button = require('fcui/Button.jsx');

    let LayerWithButtons = React.createClass({
        propTypes: {

        },
        mixins: [
            require('fcui/mixins/LayerContainerBase'),
            require('fcui/mixins/MouseWidgetBase')
        ],
        getDefaultProps() {
            return {
                count: 0
            };
        },
        getInitialState() {
            return {};
        },
        onTriggerClick() {
            this.layerShow();
        },
        layerAction(action) {
            if (action === 'ok') {
                this.props.onLayerOk();
            }
            this.layerHide();
        },
        render() {
            return (
                <div
                    className="fcui2-droplayer-container"
                    onMouseEnter={this.___mouseenterHandler___}
                    onMouseLeave={this.___mouseleaveHandler___}
                >
                    <Button
                        ref="container"
                        label={'点了 ' + this.props.count + ' 下'}
                        onClick={this.onTriggerClick}
                    />
                </div>
            );
        }
    });


    return React.createClass({
        propTypes: [],
        mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
        // @override
        getDefaultProps() {
            return {
                demo: 'Layer',
                alert() {}
            };
        },
        getInitialState() {
            return {count: 0};
        },
        getLayerContent(props) {
            return (
                <div className="fcui2-droplayer">
                    <div className="fcui2-droplayer-content">
                        <h1>hello layer.</h1>
                    </div>
                    <div
                        className="fcui2-droplayer-footer"
                        style={{padding: '10px'}}
                    >
                        <Button
                            label="确定"
                            skin="important"
                            onClick={_.partial(props.onLayerAction, 'ok')}
                        />
                        <Button
                            label="取消"
                            onClick={_.partial(props.onLayerAction, 'cancel')}
                        />
                    </div>
                </div>
            );
        },
        onLayerOk() {
            this.props.alert('ok from layer, state count: ' + this.state.count);
            this.setState({count: this.state.count + 1});
        },
        render() {
            let containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'Layer' ? 'block' : 'none'
                }
            };
            return (
                <div {...containerProp}>
                    <div className="demo-item" key="1">
                        <h3>Normal Popup Layer</h3>
                        <div className="props">props</div>
                        <LayerWithButtons
                            layerProps={{}}
                            layerContent={this.getLayerContent}
                            layerInterface="onLayerAction"
                            onLayerOk={this.onLayerOk}
                            count={this.state.count}
                        />
                    </div>
                </div>
            );
        }
    });
});
