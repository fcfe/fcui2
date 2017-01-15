/**
 * 下拉颜色选择器-默认渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.2
 */
define(function (require) {


    var React = require('react');
    var tools = require('../../core/colorPickerTools');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                value: '',
                mode: ''
            };
        },
        render: function () {
            var value = tools.getValueObject(this.props.value);
            var containerStyle = {
                marginLeft: -10,
                fontWeight: 700,
                width: 28,
                textAlign: 'center'
            };
            if (this.props.mode === 'background') {
                containerStyle.backgroundColor = value.css;
                containerStyle.color = tools.RGB2CSS(255 - value.rgb[0], 255 - value.rgb[1], 255 - value.rgb[2])
            }
            else {
                containerStyle.color = value.css;
            }
            return (<div style={containerStyle}>A</div>);
        }
    });
});
