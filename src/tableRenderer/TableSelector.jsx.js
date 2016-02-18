define(function (require) {

    var React = require('react');
    var language = require('../core/language');
    var mixins = require('../core/mixins.jsx');

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
        mixins: [mixins.layerContainer],
        // @override
        getDefaultProps: function () {
            return {
                datasource: {},
                onAction: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                showLayer: false,
                layerPosition: 'bottom-layer'
            };
        },
        // @override
        componentDidUpdate: function () {
            var i = getSelect(this.props.datasource);
            var mainCheckbox = this.refs.mainCheckbox;
            mainCheckbox.indeterminate = i !== -1 && i > 0;
        },
        selectAll: function () {
            this.props.onAction(-1);
        },
        selectCurrentPage: function () {
            this.props.onAction(-2);
        },
        mainSelectorHandler: function () {
            this.props.onAction(this.props.isAllSelected ? -3 : -2);
        },
        // @override
        render: function () {
            var i = getSelect(this.props.datasource);
            var containerProp = {
                className: 'tableSelector fcui2-dropdownlist layer-container',
                onMouseEnter: this.showLayer,
                onMouseLeave: this.hideLayer,
                ref: 'container'
            };
            var mainCheckboxProp = {
                type: 'checkbox',
                checked: i === -1,
                className: 'tr-selector',
                ref: 'mainCheckbox',
                onClick: this.mainSelectorHandler
            };
            var layerProp = {
                className: 'layer ' + this.state.layerPosition,
                ref: 'layer'
            };
            if (this.state.showLayer) {
                containerProp.className += ' layer-container-showlayer';
            }
            return (
                <div {...containerProp}>
                    <div className="font-icon font-icon-largeable-caret-down"></div>
                    <input {...mainCheckboxProp}/>
                    <div {...layerProp} onClick={this.hideLayer}>
                        <div className="item" onClick={this.selectCurrentPage}>
                            <span onClick={this.selectCurrentPage}>{language.tableSelector.selectCurrentPage}</span>
                        </div>
                        <div className="item" onClick={this.selectAll}>
                            <span onClick={this.selectAll}>{language.tableSelector.selectAll}</span>
                        </div>
                    </div>
                </div>
            );
        }
    });
});
