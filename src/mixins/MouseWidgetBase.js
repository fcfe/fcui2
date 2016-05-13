/**
 * @file 响应鼠标类型组件基础mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 *
 * 此mixin主要作用是提供某些鼠标事件
 * 将mouseover, mousedown状态记录在state中
 * 这些鼠标事件应由组件设计者自行绑定，或在自定义事件中调用
 */
define(function (require) {

    return {
        ___mouseenterHandler___: function () {
            this.setState({mouseover: true});
            typeof this.props.onMouseEnter === 'function' && this.props.onMouseEnter();
        },
        ___mouseleaveHandler___: function () {
            this.setState({mouseover: false});
            typeof this.props.onMouseLeave === 'function' && this.props.onMouseLeave();
        },
        ___mousedownHandler___: function () {
            this.setState({mousedown: true});
        },
        ___mouseupHandler___: function () {
            this.setState({mousedown: false});
        }
    };

});
