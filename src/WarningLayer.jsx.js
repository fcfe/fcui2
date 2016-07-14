/**
 * 警告提示浮层
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var util = require('./core/util');
    var Layer = require('./Layer.jsx');
    var cTools = require('./core/componentTools');


    return React.createClass({
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} message 警告信息
         * @param {Import|Properties} src\Layer.jsx.js anchor location onOffset
         */
        /**
         * @fire Import src\Layer.jsx.js layer onOffset
         */
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                message: '',
                anchor: null,
                location: '',
                onOffset: cTools.noop
            };
        },
        getInitialState: function () {
            return {};
        },
        onLayerOffset: function (e) {
            typeof this.props.onOffset === 'function' && this.props.onOffset(e);
        },
        render: function () {
            var layerProp = {
                skin: 'warning',
                isOpen: this.props.message,
                anchor: this.props.anchor,
                location: this.props.location,
                onOffset: this.onLayerOffset
            };
            return (
                <Layer {...layerProp}>
                    <div className="fcui2-layer-warning-content">
                        <div className="up-arrow">
                            <div className="arrow-bg"></div>
                        </div>
                        <div className="down-arrow">
                            <div className="arrow-bg"></div>
                        </div>
                        <div className="left-arrow">
                            <div className="arrow-bg"></div>
                        </div>
                        <div className="right-arrow">
                            <div className="arrow-bg"></div>
                        </div>
                        {this.props.message}
                    </div>
                </Layer>
            );
        }
    });


});
