define(function (require) {

    var mixins = require('./core/mixins.jsx');
    var React = require('react');

    return React.createClass({
        // @override
        mixins: [mixins.layerContainer, mixins.mouseContainer],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                label: 'DropDownList',
                minWidth: 60,
                disable: false,
                datasource: [],         // {label: <string>, value: <string>, disable: <boolean>, datasource:[#self]}
                onClick: function () {},
                layerContent: require('./List.jsx'),
                layerProps: {}
            };
        },
        // @override
        componentWillReceiveProps: function (props) {
            this.setState({
                disable: props.disable,
                datasource: JSON.parse(JSON.stringify(props.datasource))
            });
        },
        // @override
        getInitialState: function () {
            return {
                mouseover: false,
                disable: this.props.disable,
                datasource: JSON.parse(JSON.stringify(this.props.datasource))
            };
        },
        layerAction: function (type, value) {
            if (this.state.disable) return;
            this.props.onClick({target: this, value: value});
            this.layerHide();
        },
        mouseEnterHandler: function (e) {
            this.mouseenter(e);
            this.layerShow();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-dropdownlist ' + this.props.className,
                style: {minWidth: this.props.minWidth},
                onMouseEnter: this.mouseEnterHandler,
                onMouseLeave: this.mouseleave,
                ref: 'container'
            };
            if (this.state.disable) {
                containerProp.className += ' fcui2-dropdownlist-disable';
            }
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{this.props.label}</span>
                </div>
            );
        }
    });
});
