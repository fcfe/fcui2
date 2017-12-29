/**
 * @file 为 React child components 提供'oneux4'的appSkin值刀到child context type中
 *
 * @author hanbingfeng@baidu.com
 */
define(function (require) {


    const React = require('react');


    return React.createClass({

        // @override
        getDefaultProps: function () {
            return {
                skin: 'oneux3'
            };
        },

        // @override
        childContextTypes: {
            appSkin: React.PropTypes.string
        },

        // @override
        getChildContext() {
            return {
                appSkin: this.props.skin
            };
        },

        render() {
            const className = 'fcui2-' + this.props.skin + '-wrapper'
                + (this.props.className ? ' ' + this.props.className : '');
            return (
                <div className={className}>
                    {this.props.children}
                </div>
            );
        }
    });


});
