define(function (require) {


    var React = require('react');
    var language = require('../../core/language');


    function getSelect(obj) {
        if (obj[-1]) return -1;
        var n = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) n++;
        }
        return n;
    }

    return React.createClass({
        // @override
        mixins: [],
        // @override
        getDefaultProps: function () {
            return {
                selectedIndex: {},
                datasource: [
                    {label: language.tableSelector.selectCurrentPage, value: '-2'},
                    {label: language.tableSelector.selectAll, value: '-1'}
                ],
                onAction: function () {},
                layerContent: require('../List.jsx'),
                layerProps: {}
            };
        },
        // @override
        componentDidUpdate: function () {
            var i = getSelect(this.props.selectedIndex);
            var mainCheckbox = this.refs.mainCheckbox;
            mainCheckbox.indeterminate = i !== -1 && i > 0;
        },
        layerAction: function (e, value) {
            this.props.onAction(value * 1);
        },
        mainSelectorHandler: function () {
            this.props.onAction(this.props.isAllSelected ? -3 : -2);
        },
        mouseEnterHandler: function (e) {
            this.mouseenter(e);
            this.layerShow();
        },
        // @override
        render: function () {
            var i = getSelect(this.props.selectedIndex);
            var containerProp = {
                className: 'table-selector fcui2-dropdownlist',
                onMouseEnter: this.mouseEnterHandler,
                onMouseLeave: this.mouseleave,
                ref: 'container'
            };
            var mainCheckboxProp = {
                type: 'checkbox',
                checked: i === -1,
                className: 'tr-selector',
                ref: 'mainCheckbox',
                onClick: this.mainSelectorHandler
            };
            return (
                <div {...containerProp}>
                    <div className="font-icon font-icon-largeable-caret-down"></div>
                    <input {...mainCheckboxProp}/>
                </div>
            );
        }
    });
});
