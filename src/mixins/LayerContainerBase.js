/**
 * @file 含有layer组件基础mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 *
 * 此mixin主要作用是为某些组件提供一些弹出layer的功能，依赖MouseWidgetBase
 *
 * 使用此mixin的组件中应含有如下内容：
 * 1. [required] props.layerContent {function}
 *      用于渲染layer内容的组件构造函数，可以是其他任何组件
 * 2. [optional] props.layerProps {Object}
 *      渲染layer时，此属性会当作layer的原始props传入进去
 * 3. [optional] props.layerPolicymaker {boolean | function}
 *      是否弹出layer的决策算法，如果被设置成true或false则直接使用
 *      如果是函数，就将制作好的layerProps传过去由外界计算，根据返回值决定是否弹出
 *      当然在这个函数里改layerProps的值都没问题，不过不建议这样做
 * 4. [optional] props.layerInterface {string}
 *      layerContent组件需要用回调方法与父组件通信，这里给出外部响应的主回调名称
 *      可能难于理解，详情请看代码中 “// 创建layer props”之后的部分
 * 5. [optional] props.datasource {Any}
 *      绝大多数情况下，layer是一个列表，因此会把props.datasource加到props.layerProps中传入进去
 *      但如果props.layerProps存在datasource，不会被覆盖，也不会merge
 * 6. [required] ref.container
 *      组件的根容器引用，用于layer的自动定位：定位的优先级是先下后上，先右后左
 *
 * 在初始化layer时，mixin会在props.layerProps中加入parent属性，记录当前组件；同时会加入onAction属性，默认传入
 * 当前组件的this.layerAction方法，以提供layer内容的回调接口。
 *
 * 此mixin会在this下注入两个内部变量，this.___layerContainer___，存放layer的最外dom容器；this.___layer___，存放layer
 * 初始化完毕后的react组件实例
 *
 * 此mixin会在this下暴露两个接口，this.layerShow用于弹出layer，this.layerHide用于移除layer
 */
define(function (require) {


    var util = require('../core/util');
    var React = require('react');
    var ReactDOM = require('react-dom');


    function propsFactory(initProp, me) {
        var props = initProp || {};
        if (me.props.hasOwnProperty('layerProps')) {
            for (var key in me.props.layerProps) {
                if (!me.props.layerProps.hasOwnProperty(key) || props.hasOwnProperty(key)) continue;
                props[key] = me.props.layerProps[key];
            }
        }
        props.parent = me;
        if (typeof me.props.layerInterface === 'string' && me.props.layerInterface.length > 0) {
            props[me.props.layerInterface] = typeof me.layerAction === 'function' ? me.layerAction : function () {};
        }
        if (me.props.hasOwnProperty('datasource') && !props.hasOwnProperty('datasource')) {
            props.datasource = me.props.datasource;
        }
        return props;
    }


    return {

        ___layerContainer___: null,
        ___layer___: null,

        layerUpdateProp: function (props) {
            if (!this.___layer___) return;
            var props = propsFactory(props, this); 
            this.___layer___ = ReactDOM.render(
                React.createElement(this.props.layerContent, props),
                this.___layerContainer___
            );
        },

        layerShow: function (initProp, dontAutoClose) {
            // 创建layer容器
            var me = this;
            if (me.___layerContainer___ == null) {
                me.___layerContainer___ = document.createElement('div');
                me.___layerContainer___.className = 'fcui2-layer'
            }
            // 弹出条件1
            if (typeof me.props.layerContent !== 'function'|| me.props.disable || me.props.layerPolicymaker === false) {
                return;
            }
            document.body.appendChild(me.___layerContainer___);
            // 创建layer props
            var props = propsFactory(initProp, me);
            // 弹出条件2
            if (typeof me.props.layerPolicymaker === 'function' && !me.props.layerPolicymaker(props)) return;
            // 弹出layer
            var timer = null;
            try {
                me.___layer___ = ReactDOM.render(
                    React.createElement(me.props.layerContent, props),
                    me.___layerContainer___
                );
                timer = setInterval(fixedPosition, 5);
            }
            catch (e) {
                console.error(e);
            }

            // 自动适应layer位置，开启自动隐藏
            function fixedPosition() {
                var layerContainer = me.___layerContainer___;
                var height = layerContainer.offsetHeight;
                var width = layerContainer.offsetWidth;
                var container = me.refs.container;
                if (!me.state.mouseover || !container) {
                    clearInterval(timer);
                    return;
                }
                if (height === 0) return; // 还没渲染完
                clearInterval(timer);
                // 开始定位
                var pos = util.getDOMPosition(container);
                var top = (pos.y + container.offsetHeight + height < document.documentElement.clientHeight)
                    ? (pos.top + container.offsetHeight) : (pos.top - height);
                var left = pos.x + width < document.documentElement.clientWidth ?
                    pos.left : (pos.left + container.offsetWidth - width);
                layerContainer.style.left = left + 'px';
                layerContainer.style.top = top + 'px';
                // 开启自动隐藏
                if (!dontAutoClose) timer = setInterval(autoHide, 200);
            }

            function autoHide() {
                if (me.___layer___ == null) {
                    clearInterval(timer);
                    return;
                }
                if (me.state.mouseover || me.___layer___.state.mouseover) return;
                clearInterval(timer);
                me.layerHide();
            }
        },

        layerHide: function () {
            this.___layer___ = null;
            try {
                var container = this.___layerContainer___;
                container.style.left = '-9999px';
                container.style.top = '-9999px';
                document.body.removeChild(container);
            }
            catch (e) {
                // DO NOTHING    
            }
        }
    };
});
