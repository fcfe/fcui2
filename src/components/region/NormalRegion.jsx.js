/**
 * Region大区域渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var CheckBox = require('../../CheckBox.jsx');
    var Radio = require('../../Radio.jsx');

    var tools = require('../../core/regionTools');
    var language = require('../../core/language').region;

    return React.createClass({
        /**
         * @properties
         * @param {Number} id 省所属的编号
         * @param {Object} value Region组件转译后的value，以省市编号为key，有哪个key，代表哪个地区被选中
         * @param {ReactComponent} parent 渲染器所属的Region组件实例
         * @param {Boolean} disabled 渲染器是否处于禁用状态
         * @param {String} type 渲染器的选择状态，'single'表示单选，其他为多选
         * @param {Function} onChange 选择状态改变后的回调
         */
        // @override
        getDefaultProps: function () {
            return {
                type: 'multi',
                disabled: false,
                id: -1,
                value: {},
                parent: {},
                onChange: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onRegionChange: function (e) {
            if (this.props.disabled) return;
            this.props.onChange(e);
        },
        render: function () {
            var selected = tools.getSelectedState(
                this.props.id,
                this.props.value,
                this.props.parent.props.noLinkage
            );
            var prop = {
                label: language.regionName[this.props.id],
                labelPosition: 'right',
                value: this.props.id,
                disabled: this.props.disabled,
                checked: selected.checked,
                indeterminate: selected.indeterminate,
                onChange: this.onRegionChange
            };
            if (this.props.type === 'single') {
                return (<Radio {...prop} />);
            }
            return (<CheckBox {...prop}/>);
        }
    });

});
