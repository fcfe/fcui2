// 此mixin已停止维护，即将废弃
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

    function deprecated() {
        try {
            console.error('Mixin LayerContainerBase is deprecated, please use Layer instead.')
        }
        catch (e) {

        }
    }

    return {

        ___layerContainer___: null,
        ___layer___: null,

        componentWillUnmount: function () {
            if (!this.___layerContainer___ || !this.___layer___) return;
            this.layerHide();
        },

        layerUpdateProp: function (props) {
            deprecated();
            if (!this.___layerContainer___) return;
            var props = propsFactory(props, this); 
            this.___layer___ = ReactDOM.render(
                React.createElement(this.props.layerContent, props),
                this.___layerContainer___
            );
        },

        layerShow: function (initProp, dontAutoClose, layerPosition) {
            deprecated();
            // 创建layer容器
            var me = this;
            if (me.___layerContainer___ == null) {
                me.___layerContainer___ = document.createElement('div');
                me.___layerContainer___.className = 'fcui2-layer fcui2-layer-normal';
            }
            // 弹出条件1
            if (typeof me.props.layerContent !== 'function' || me.props.disabled || me.props.layerPolicymaker === false) {
                return;
            }
            document.body.appendChild(me.___layerContainer___);
            // 创建layer props
            var props = propsFactory(initProp, me);
            // 弹出条件2
            if (typeof me.props.layerPolicymaker === 'function' && !me.props.layerPolicymaker(props)) return;
            // 弹出layer
            var timer = null;
            var innerTimer = null;
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

            // 自动适应layer位置，开启自动隐藏，开启父元素显隐适配
            function fixedPosition() {
                var layerContainer = me.___layerContainer___;
                var height = layerContainer.offsetHeight;
                var width = layerContainer.offsetWidth;
                var container = (initProp && initProp.layerAnchor) || me.refs.container;
                if (!me.state.mouseover || !container || me.___layer___ == null) {
                    clearInterval(timer);
                    return;
                }
                if (height === 0) return; // 还没渲染完
                clearInterval(timer);
                // 开始定位
                var pos = util.getDOMPosition(container);
                var top = -9999;
                var left = -9999;
                layerPosition = layerPosition + '';
                if (layerPosition.indexOf('top') > -1) {
                    top = pos.top - height;
                }
                else if (layerPosition.indexOf('bottom') > -1) {
                    top = pos.top + container.offsetHeight - 1;
                }
                else {
                    top = (pos.y + container.offsetHeight + height < document.documentElement.clientHeight)
                        ? (pos.top + container.offsetHeight - 1) : (pos.top - height);
                }
                if (layerPosition.indexOf('left') > -1) {
                    left = pos.left + container.offsetWidth - width;
                }
                else if (layerPosition.indexOf('right') > -1) {
                    left = pos.left;
                }
                else {
                    left = pos.x + width < document.documentElement.clientWidth ?
                        pos.left : (pos.left + container.offsetWidth - width);
                }
                layerContainer.style.left = left + 'px';
                layerContainer.style.top = top + 'px';
                // 开启自动隐藏
                if (!dontAutoClose) timer = setInterval(autoHide, 200);
                // 开启父元素显隐适配
                innerTimer = setInterval(autoHideWithParent, 200);
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

            function autoHideWithParent() {
                if (me.___layer___ == null) {
                    clearInterval(innerTimer);
                    return;
                }
                var container = (initProp && initProp.layerAnchor) || me.refs.container;
                var visible = util.isDOMVisible(container);
                if (visible) return;
                clearInterval(innerTimer);
                me.layerHide();
            }
        },

        layerHide: function () {
            deprecated();
            try {
                var container = this.___layerContainer___;
                container.style.left = '-9999px';
                container.style.top = '-9999px';
                // 部分layer会自己setState，会出现warning
                ReactDOM.unmountComponentAtNode(container);
                document.body.removeChild(container);
                this.___layer___ = null;
                if (typeof this.layerClose === 'function') this.layerClose();
            }
            catch (e) {
                // console.log(e);  
            }
        }
    };
});
