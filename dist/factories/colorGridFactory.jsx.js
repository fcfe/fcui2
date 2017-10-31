/**
 * @file ColorGrid 工厂方法
 * @author Wang Yi
 * @email wangyispaceman@gmail.com
 * @version 0.0.2.2
 */

define(function (require) {
    var React = require('react');

    var DEFAULT_COLORS = ['#D15D5D', '#F35A59', '#EE745D', '#FF7271', '#FF908F', '#E6578F', '#FD8EB9', '#FF8D8C', '#F8B6B7', '#FFD5D6', '#D0A26D', '#C8B7A5', '#DDBA8A', '#FC9300', '#F7C834', '#FED85B', '#E6BD35', '#E2DA88', '#E5E89D', '#FFFCDE', '#6157B5', '#7163DC', '#7F71EF', '#8D66A5', '#ABA1FF', '#D19BF7', '#AE77D5', '#9CABFB', '#A98ABC', '#ECD2FF', '#425EFF', '#5078EA', '#0082DA', '#00A1DD', '#169AFF', '#43AEFF', '#82B6DD', '#26C2EA', '#96E3F7', '#E0EFF4', '#168B78', '#559E93', '#1FB275', '#1FB19A', '#37CDB4', '#9CBC70', '#92C64A', '#AADFD7', '#BCE4A8', '#ECFFD2'];

    return {
        colorBlockFactory: function colorBlockFactory(color, active, onClick) {
            var containerStyle = {
                position: 'relative',
                float: 'left',
                width: 16,
                height: 16,
                marginRight: 1,
                marginBottom: 1,
                border: '1px solid transparent',
                borderColor: active ? '#169AFF' : 'transparent',
                cursor: 'pointer'
            };
            var innerBlockStyle = {
                position: 'absolute',
                top: 1,
                left: 1,
                width: 14,
                height: 14,
                backgroundColor: color
            };
            var onBlockClick = function onBlockClick(e) {
                onClick({ color: color }, e);
            };
            return React.createElement(
                'div',
                { style: containerStyle, key: color, onClick: onBlockClick },
                React.createElement('div', { style: innerBlockStyle })
            );
        },

        colorGridFactory: function colorGridFactory(component) {
            var me = this;
            var value = JSON.parse(component.___getValue___());
            var hex = value.hex;
            var colors = component.props.colors && component.props.colors.length ? component.props.colors : DEFAULT_COLORS;
            var containerStyle = {
                padding: '14px 9px 9px 14px'
            };
            var clearStyle = {
                clear: 'both'
            };
            return React.createElement(
                'div',
                { style: containerStyle },
                colors.map(function (color) {
                    return me.colorBlockFactory(color, color === hex, component.onColorClick);
                }),
                React.createElement('div', { style: clearStyle })
            );
        }
    };
});