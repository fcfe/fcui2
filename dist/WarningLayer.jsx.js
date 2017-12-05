var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * 警告提示浮层
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.2
 */
define(function (require) {

    var React = require('react');
    var util = require('./core/util');
    var Layer = require('./Layer.jsx');
    var cTools = require('./core/componentTools');

    var ARROW_LOCATION = {
        '12.5': 'down',
        '1': 'down',
        '2': 'down',
        '3.5': 'left',
        '4': 'left',
        '5': 'left',
        '6': 'up',
        '6.5': 'up',
        '8': 'right',
        '9': 'right',
        '9.5': 'right'
    };
    var ARROW_OFFSET = {
        '12.5': [0, -10],
        '1': [0, -10],
        '2': [-30, -10],
        '3.5': [10, 0],
        '4': [10, 0],
        '5': [10, -30],
        '6': [0, 10],
        '6.5': [0, 10],
        '8': [-10, -30],
        '9': [-10, 0],
        '9.5': [-10, 0]
    };

    return React.createClass({
        /**
         * @properties
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} message 警告信息
         * @param {Import|Properties} src\Layer.jsx.js anchor location onOffset
         * @param {Function} onClick 点击layer后执行的回调
         */
        /**
         * @fire Import src\Layer.jsx.js layer onOffset
         */
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        getDefaultProps: function getDefaultProps() {
            return {
                // base
                skin: 'warning',
                className: '',
                style: {},
                disabled: false,
                // self
                message: '',
                anchor: null,
                location: '',
                onClick: cTools.noop,
                onOffset: cTools.noop
            };
        },
        getInitialState: function getInitialState() {
            return {};
        },
        onClick: function onClick(e) {
            typeof this.props.onClick === 'function' && this.props.onClick(e);
        },
        onLayerOffset: function onLayerOffset(e) {
            var arrow = this.refs.arrow;
            arrow.className = ARROW_LOCATION[e.clockPosition] + '-arrow';
            var arrowMargin = this.context.appSkin === 'oneux4' ? 30 : 10;
            switch (this.props.location) {
                case '1':
                case '2':
                case '6':
                    arrow.style.left = arrowMargin + 'px';
                    break;
                case '4':
                case '5':
                case '8':
                    arrow.style.top = arrowMargin - 5 + 'px';
                    break;
                case '3.5':
                case '9.5':
                    arrow.style.top = arrow.parentNode.offsetHeight / 2 - 6 + 'px';
                    break;
                case '6.5':
                case '12.5':
                    arrow.style.left = arrow.parentNode.offsetWidth / 2 - 6 + 'px';
                    break;
                default:
                    break;
            }
            this.refs.arrow.style.display = ARROW_LOCATION.hasOwnProperty(e.clockPosition) ? 'block' : 'none';
            if (ARROW_OFFSET.hasOwnProperty(e.clockPosition)) {
                e.left += ARROW_OFFSET[e.clockPosition][0];
                e.top += ARROW_OFFSET[e.clockPosition][1];
            }
            typeof this.props.onOffset === 'function' && this.props.onOffset(e);
        },
        render: function render() {
            var layerProp = {
                skin: (this.context.appSkin ? this.context.appSkin + '-' : '') + (this.props.skin ? this.props.skin : 'normal'),
                isOpen: this.props.message && !this.props.disabled,
                anchor: this.props.anchor,
                fixedWidthToAnchor: false,
                location: this.props.location,
                onOffset: this.onLayerOffset
            };
            return React.createElement(
                Layer,
                layerProp,
                React.createElement(
                    'div',
                    _extends({}, cTools.containerBaseProps('warninglayer', this), { onClick: this.onClick }),
                    React.createElement(
                        'div',
                        { ref: 'arrow' },
                        React.createElement('div', { className: 'arrow-bg' })
                    ),
                    React.createElement('div', { className: 'warninglayer-content', dangerouslySetInnerHTML: { __html: this.props.message } })
                )
            );
        }
    });
});