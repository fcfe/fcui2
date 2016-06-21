/**
 * Tab 普通渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');


    return React.createClass({
        // @override
        /**
         * @properties
         * @param {String} className 挂接在渲染器根容器上的类
         * @param {String} label 渲染器显示的内容
         * @param {String} value 渲染器的值
         * @param {Function} onClick 渲染器被点击后的回调
         * @attention <ListItemObject>中所有数据属性都会灌入此渲染器的props中，onClick除外
         */
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
