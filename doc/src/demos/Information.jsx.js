define(function (require) {


    var React = require('react');
    var tools = require('./tools');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                title: '',
                props: ''
            };
        },
        // @override
        getInitialState: function () {
            return {
                isOpen: false
            };
        },
        togglePropsBoxFactory: function () {
            this.setState({isOpen: !this.state.isOpen});
        },
        render: function () {
            var props = tools.trans2html(tools.formatter(tools.getDisplayProps(this.props.props)));
            var titleProp = {
                className: 'font-icon font-icon-caret-' + (this.state.isOpen ? 'down' : 'right'),
                onClick: this.togglePropsBoxFactory
            };
            var propboxProp = {
                className: 'props',
                dangerouslySetInnerHTML: {__html: props},
                style: {display: this.state.isOpen ? 'block' : 'none'}
            };
            return (
                <div>
                    <h4 {...titleProp}>{this.props.title}</h4>
                    <div {...propboxProp}></div>
                </div>
            );
        }
    });


});
