/**
 * 有拖拽功能的mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    return {
        ___dragStart___: function (e) {
            this.___initX___ = e.clientX;
            this.___initY___ = e.clientY;
            this.___curX___ = e.clientX;
            this.___curY___ = e.clientY;
            document.onselectstart = new Function('return false');
            document.body.style.cursor = 'default';
            window.addEventListener('mousemove', this.___dragHandler___);
            window.addEventListener('mouseup', this.___dragEnd___);
        },
        ___dragEnd___: function (e) {
            document.onselectstart = null;
            document.body.style.cursor = 'auto';
            window.removeEventListener('mousemove', this.___dragHandler___);
            window.removeEventListener('mouseup', this.___dragEnd___);
            var dx = e.clientX - this.___initX___;
            var dy = e.clientY - this.___initY___;
            typeof this.onDrop === 'function' && this.onDrop(dx, dy);
        },
        ___dragHandler___: function (e) {
            var dx = e.clientX - this.___curX___;
            var dy = e.clientY - this.___curY___;
            this.___curX___ = e.clientX;
            this.___curY___ = e.clientY;
            typeof this.onDrag === 'function' && this.onDrag(dx, dy);
        }
    };

});
