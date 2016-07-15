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

    var ARROW_LOCATION = {
        '1': 'down',
        '4': 'left',
        '6': 'up',
        '9': 'right'
    };
    var ARROW_OFFSET = {
        '1': [0, -10],
        '4': [10, 0],
        '6': [0, 10],
        '9': [-10, 0]
    };

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
            this.refs.arrow.className = ARROW_LOCATION[e.clockPosition] + '-arrow';
            this.refs.arrow.style.display = ARROW_LOCATION.hasOwnProperty(e.clockPosition) ? 'block' : 'none';
            if (ARROW_OFFSET.hasOwnProperty(e.clockPosition)) {
                e.left += ARROW_OFFSET[e.clockPosition][0];
                e.top += ARROW_OFFSET[e.clockPosition][1];
            }
            typeof this.props.onOffset === 'function' && this.props.onOffset(e);
        },
        render: function () {
            var layerProp = {
                skin: 'warning',
                isOpen: this.props.message && !this.props.disabled,
                anchor: this.props.anchor,
                location: this.props.location,
                onOffset: this.onLayerOffset
            };
            return (
                <Layer {...layerProp}>
                    <div {...cTools.containerBaseProps('warninglayer', this)}>
                        <div ref="arrow" className="up-arrow">
                            <div className="arrow-bg"></div>
                        </div>
                        {this.props.message}
                    </div>
                </Layer>
            );
        }
    });


});
