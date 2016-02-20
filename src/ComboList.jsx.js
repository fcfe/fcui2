define(function (require) {

    var React = require('react');
    var Button = require('./Button.jsx');
    var mixins = require('./core/mixins.jsx');

    return React.createClass({
        // @override
        mixins: [mixins.layerContainer, mixins.mouseContainer],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                label: 'ComboList',
                icon: '',
                cmd: '',
                disable: false,
                datasource: [], // {label: <string>, cmd: <string>, disable: <boolean>, datasource:[#self]}
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
        mainCommand: function (e) {
            if (this.state.disable) return;
            this.props.onClick({target: this, value: this.props.cmd});
            this.layerHide();
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-combolist ' + this.props.className,
                onMouseEnter: this.mouseenter,
                onMouseLeave: this.mouseleave,
                ref: 'container'
            };
            var mainButtonProp = {
                label: this.props.label,
                disable: this.state.disable,
                cmd: this.props.cmd,
                icon: this.props.icon,
                skin: 'important',
                onClick: this.mainCommand
            };
            if (this.state.disable) {
                containerProp.className += ' fcui2-combolist-disable';
            }
            return (
                <div {...containerProp}>
                    <div className="font-icon font-icon-largeable-caret-down" onClick={this.layerShow}></div>
                    <Button {...mainButtonProp}/>
                </div>
            );
        }
    });
});
