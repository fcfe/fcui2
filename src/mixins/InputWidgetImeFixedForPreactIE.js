/**
 * 文本输入组件输入法hack mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var util = require('../core/util');
    var fireTimerSpan = 100;

    return {
        componentDidMount: function () {
            this.___fireTimeout___ = null;
            this.___imeStart___ = false;
            this.___lastFireValue___ = null;
            this.___lastCursorPos___ = -1;
            this.refs.inputbox.value = this.___getValue___();
        },
        shouldComponentUpdate: function (nextProps, nextState) {
            if (this.___fireTimeout___) {
                return false;
            }
        },
        componentDidUpdate: function () {
            if (this.___fireTimeout___) {
                return false;
            }
            this.refs.inputbox.value = this.props.value;
            util.setCursorPosition(this.refs.inputbox, this.___lastCursorPos___);
        },
        ___onCompositionStart___: function () {
            clearTimeout(this.___fireTimeout___);
            this.___fireTimeout___ = null;
            this.___imeStart___ = true;
        },
        ___onCompositionEnd___: function () {
            var me = this;
            clearTimeout(this.___fireTimeout___);
            this.___fireTimeout___ = null;
            this.___imeStart___ = false;
            this.___fireTimeout___ = setTimeout(function () {
                me.___fireChange___();
            }, fireTimerSpan);
        },
        ___onKeyUp___: function () {
            if (this.___imeStart___) return;
            var me = this;
            clearTimeout(this.___fireTimeout___);
            this.___fireTimeout___ = null;
            this.___fireTimeout___ = setTimeout(function () {
                me.___fireChange___();
            }, fireTimerSpan);
        },
        ___fireChange___: function () {
            clearTimeout(this.___fireTimeout___);
            this.___fireTimeout___ = null;
            if (this.refs.inputbox.value === this.___lastFireValue___) return;
            this.___lastFireValue___ = this.refs.inputbox.value;
            this.___lastCursorPos___ = util.getCursorPosition(this.refs.inputbox);
            var e = {target: this.refs.container};
            e.target.value = this.___lastFireValue___;
            this.___dispatchChange___(e);
        }
    };

});
