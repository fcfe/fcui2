/**
 * @file 省选择零件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var MouseWidgetBase = require('../mixins/MouseWidgetBase');
    var LayerContainerBase = require('../mixins/LayerContainerBase');
    var CheckBox = require('../CheckBox.jsx');


    var util = require('../core/util');
    var tools = require('../core/regionTools');
    var language = require('../core/language').region;


    return React.createClass({   
        // @override
        mixins: [MouseWidgetBase, LayerContainerBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                disable: false,
                id: -1,
                value: {},
                onChange: function () {},
                layerContent: require('../Calendar.jsx'),
                layerProps: {},
                layerInterface: 'onChange'
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        layerAction: function (e) {
            if (this.props.disable) return;
        },
        mouseEnterHandler: function (e) {
            this.___mouseenterHandler___();
            if (this.props.disable) return;
            this.layerShow();
        },
        render: function () {
            var containerProp = {
                ref: 'container',
                className: 'fcui2-region-province',
                onMouseLeave: this.___mouseleaveHandler___,
                onMouseEnter: this.mouseEnterHandler
            };
            return (
                <div {...containerProp}>
                    <CheckBox label={language.regionName[this.props.id]} labelPosition="right"/>
                </div>
            );
        }
    });

});
