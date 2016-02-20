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
                minWidth: 60,
                label: 'please select',
                value: '',
                disable: false,
                datasource: [],         // {label: <string>, value: <string>, disable: <boolean>}
                onChange: function () {},
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
                value: this.props.value + '',
                datasource: JSON.parse(JSON.stringify(this.props.datasource))
            };
        },
        layerAction: function (type, value) {
            this.layerHide();
            if (this.state.disable || value === this.state.value) return;
            this.setState({value: value});
            this.props.onChange({target: this, value: value});
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
            var label = this.props.label;
            for (var i = 0; i < this.state.datasource.length; i++) {
                if (this.state.datasource[i].value + '' === this.state.value + '') {
                    label = this.state.datasource[i].label;
                    break;
                }
            }
            return (
                <div {...containerProp}>
                    <div className="icon-right font-icon font-icon-largeable-caret-down"></div>
                    <span>{label}</span>
                </div>
            );
        }
    });
});
