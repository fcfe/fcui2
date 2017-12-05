/**
 * 有拖拽功能的mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 * @note
 * ###说明文档
 * #####此mixin作用
 * 某些需要有拖拽功能的组件，需要一些公共方法，如：鼠标拖动过程中，触发一个onDrag事件，回传鼠标位移向量；
 * 鼠标抬起后，触发一个onDrop事件，回传鼠标从按下到抬起的位移向量，此mixin解决了整个问题。
 * #####this实例注入
 * * this.___dragStart___：开始拖拽的入口，一般放在某个DOM的onMouseDown事件中
 * #####触发回调
 * * this.onDrag(dx, dy)：鼠标拖动过程中触发此回调，dx、dy分别为位移向量
 * * this.onDrop(dx, dy)：鼠标拖动结束松开时触发此回调，dx、dy为鼠标释放位置相对按下位置的位移向量
 */
define(function (require) {

    return {
        ___dragStart___: function ___dragStart___(e) {
            this.___initX___ = e.clientX;
            this.___initY___ = e.clientY;
            this.___curX___ = e.clientX;
            this.___curY___ = e.clientY;
            document.onselectstart = new Function('return false');
            document.body.style.cursor = 'default';
            window.addEventListener('mousemove', this.___dragHandler___);
            window.addEventListener('mouseup', this.___dragEnd___);
        },
        ___dragEnd___: function ___dragEnd___(e) {
            document.onselectstart = null;
            document.body.style.cursor = 'auto';
            window.removeEventListener('mousemove', this.___dragHandler___);
            window.removeEventListener('mouseup', this.___dragEnd___);
            var dx = e.clientX - this.___initX___;
            var dy = e.clientY - this.___initY___;
            typeof this.onDrop === 'function' && this.onDrop(dx, dy, e);
        },
        ___dragHandler___: function ___dragHandler___(e) {
            var dx = e.clientX - this.___curX___;
            var dy = e.clientY - this.___curY___;
            this.___curX___ = e.clientX;
            this.___curY___ = e.clientY;
            typeof this.onDrag === 'function' && this.onDrag(dx, dy, e);
        }
    };
});