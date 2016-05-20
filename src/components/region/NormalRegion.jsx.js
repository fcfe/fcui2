/**
 * @file 大区选择零件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var CheckBox = require('../../CheckBox.jsx');
    var Radio = require('../../Radio.jsx');

    var tools = require('../../core/regionTools');
    var language = require('../../core/language').region;

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                type: 'multi',
                className: '',
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
