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
                position: 'relative',
                top: -10,
                marginTop: 10,
                marginLeft: -10,
                width: 28,
                textAlign: 'center'
            };
            if (this.props.mode === 'background') {
                containerStyle.backgroundColor = value.css;
                containerStyle.color = tools.RGB2CSS(255 - value.rgb[0], 255 - value.rgb[1], 255 - value.rgb[2])
            }
            else {
                containerStyle.borderBottom = '5px solid ' + value.css;
                containerStyle.height = 23;
            }
            return (<div style={containerStyle}>A</div>);
        }
    });
});
