define(function (require) {
    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                minWidth: 40,
                label: 'Button',
                icon: '',
                cmd: '',
                skin: '',
                disable: false,
                onClick: function () {}
            };
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
                className: 'ui-button',
                style: {minWidth: this.props.minWidth},
                onMouseDown: this.mouseDownHandler,
                onMouseUp: this.mouseUpHandler,
                onClick: this.clickHandler
            };
            var iconProp = {
                className: 'font-icon ' + this.props.icon
            };
            if (this.state.disable) {
                containerProp.className += ' ui-button-disable';
            }
            else {
                if (this.state.active) {
                    containerProp.className += ' ui-button-active';
                }
                if (this.props.skin.length > 0) {
                    containerProp.className += ' ui-button-' + this.props.skin;
                }
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
