/**
 * @file ColorGrid 工厂方法
 * @author Wang Yi
 * @email wangyispaceman@gmail.com
 * @version 0.0.2.2
 */

define(function (require) {
    var React = require('react');

    var DEFAULT_COLORS = [
        '#CF5E60', '#F15C5D', '#EB7560', '#FD7374', '#FD9191', '#E35A8F', '#FB8FBA', '#FD8E8E', '#F7B6B7', '#FED6D6',
        '#CFA171', '#C7B6A6', '#DCB98D', '#FA9226', '#F6C745', '#FDD765', '#E5BC44', '#E2D98C', '#E5E7A1', '#FFFCDF',
        '#615AB2', '#7167D9', '#7F75EC', '#A88BBA', '#ABA3FD', '#D09DF5', '#AD7AD2', '#9DACF9', '#A88BBB', '#ECD4FE',
        '#4664FB', '#537BE8', '#1483D6', '#269CFC', '#4AAFFC', '#4AAFFD', '#84B6DB', '#34C2E8', '#99E3F6', '#DFEFF3',
        '#1F8A78', '#579D92', '#2BB177', '#2CB19A', '#41CCB4', '#9CBB74', '#92C452', '#AADFD6', '#BDE2AA', '#ECFFD4'
    ];

    return {
        colorBlockFactory: function (color, active, onClick) {
            var containerStyle = {
                position: 'relative',
                float: 'left',
                width: 16,
                height: 16,
                marginRight: 1,
                marginBottom: 1,
                border: '1px solid transparent',
                borderColor: active ? '#5DB3FA' : 'transparent',
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
            var onBlockClick = function (e) {
                onClick({color: color}, e);
            };
            return (
                <div style={containerStyle} key={color} onClick={onBlockClick}>
                    <div style={innerBlockStyle}></div>
                </div>
            );
        },

        colorGridFactory: function (component) {
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
            return (
                <div style={containerStyle}>
                    {
                        colors.map(function (color) {
                            return me.colorBlockFactory(color, color === hex, component.onColorClick);
                        })
                    }
                    <div style={clearStyle}></div>
                </div>
            );
        }
    };
});