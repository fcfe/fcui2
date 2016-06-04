/**
 *  切换组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                label: '',
                value: '',
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onItemClick: function (e) {
            e.target.value = this.props.value;
            this.props.onClick(e);
        },
        render: function () {
            return (
                <div className={this.props.className} onClick={this.onItemClick}>
                    {this.props.label}
                </div>
            );
        }
    });

});
