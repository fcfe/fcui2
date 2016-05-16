/**
 * @file 响应鼠标类型组件基础mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 *
 * 此mixin主要作用是提供某些鼠标事件
 * 将mouseover, mousedown状态记录在state中
 * 这些鼠标事件应由组件设计者自行绑定，或在自定义事件中调用
 *
 * @Attention 此mixin已停止维护，即将废弃。
 */
define(function (require) {

    function deprecated() {
        try {
            console.error('Mixin MouseWidgetBase is deprecated, please merge these functions to your component.')
        }
        catch (e) {

        }
    }

    return {
        ___mouseenterHandler___: function () {
            deprecated();
            this.setState({mouseover: true});
            typeof this.props.onMouseEnter === 'function' && this.props.onMouseEnter();
        },
        ___mouseleaveHandler___: function () {
            deprecated();
            this.setState({mouseover: false});
            typeof this.props.onMouseLeave === 'function' && this.props.onMouseLeave();
        },
        ___mousedownHandler___: function () {
            deprecated();
            this.setState({mousedown: true});
        },
        ___mouseupHandler___: function () {
            deprecated();
            this.setState({mousedown: false});
        }
    };

});
