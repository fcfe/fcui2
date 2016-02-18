define(function (require) {
    var React = require('react');
    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                minWidth: 40,
                maxWidth: null,
                label: 'Button',
                icon: '',
                cmd: '',
                skin: '',
                disable: false,
                onClick: function () {}
            };
        },
        // @override
        componentWillReceiveProps: function (props) {
            this.setState({
                disable: props.disable
            });
        },
        // @override
        getInitialState: function () {
            return {
                active: false,
                disable: this.props.disable
            };
        },
        // 这样写的原因是：css:active在IE中不好使，因为react自动加span把label包了起来
        mouseDownHandler: function () {
            this.setState({active: true});
        },
        mouseUpHandler: function () {
            this.setState({active: false});
        },
        clickHandler: function () {
            if (this.state.disable) return;
            this.props.onClick({
                target: this,
                value: this.props.cmd
            });
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-button ' + this.props.className,
                style: {minWidth: this.props.minWidth},
                onMouseDown: this.mouseDownHandler,
                onMouseUp: this.mouseUpHandler,
                onClick: this.clickHandler
            };
            var iconProp = {
                className: 'font-icon ' + this.props.icon
            };
            if (this.state.disable) {
                containerProp.className += ' fcui2-button-disable';
            }
            else {
                if (this.state.active) {
                    containerProp.className += ' fcui2-button-active';
                }
                if (this.props.skin.length > 0) {
                    containerProp.className += ' fcui2-button-' + this.props.skin;
                }
            }
            if (this.props.maxWidth != null) {
                delete containerProp.style.minWidth;
                containerProp.style.maxWidth = this.props.maxWidth;
            }
            return (
                <div {...containerProp}>
                    <div {...iconProp}></div>
                    {this.props.label}
                </div>
            );
        }
    });
});
