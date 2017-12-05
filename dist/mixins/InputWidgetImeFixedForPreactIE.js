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
        componentDidMount: function componentDidMount() {
            this.___fireTimeout___ = null;
            this.___imeStart___ = false;
            this.___lastFireValue___ = null;
            this.___lastCursorPos___ = -1;
            var value = this.___getValue___() || '';
            this.refs.inputbox.value = value;
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
            if (this.___fireTimeout___) {
                return false;
            }
        },
        componentDidUpdate: function componentDidUpdate() {
            if (this.___fireTimeout___) {
                return false;
            }
            var value = this.___getValue___() || '';
            this.refs.inputbox.value = value;
            if (this.___lastCursorPos___ > -1) util.setCursorPosition(this.refs.inputbox, this.___lastCursorPos___);
        },
        ___onCompositionStart___: function ___onCompositionStart___() {
            clearTimeout(this.___fireTimeout___);
            this.___fireTimeout___ = null;
            this.___imeStart___ = true;
        },
        ___onCompositionEnd___: function ___onCompositionEnd___() {
            var me = this;
            clearTimeout(this.___fireTimeout___);
            this.___fireTimeout___ = null;
            this.___imeStart___ = false;
            this.___fireTimeout___ = setTimeout(function () {
                me.___fireChange___();
            }, fireTimerSpan);
        },
        ___onKeyUp___: function ___onKeyUp___() {
            if (this.___imeStart___) return;
            var me = this;
            clearTimeout(this.___fireTimeout___);
            this.___fireTimeout___ = null;
            this.___fireTimeout___ = setTimeout(function () {
                me.___fireChange___();
            }, fireTimerSpan);
        },
        ___onFocus___: function ___onFocus___(e) {
            this.setState({ hasFocus: true });
            typeof this.props.onFocus === 'function' && this.props.onFocus(e);
        },
        ___onBlur___: function ___onBlur___(e) {
            var me = this;
            setTimeout(function () {
                if (me.___stopBlur___ || !me.__isMounted) {
                    me.___stopBlur___ = false;
                    return;
                }
                me.setState({ hasFocus: false });
            }, 200);
            this.___lastCursorPos___ = -1;
            typeof this.props.onBlur === 'function' && this.props.onBlur(e);
        },
        ___fireChange___: function ___fireChange___() {
            clearTimeout(this.___fireTimeout___);
            this.___fireTimeout___ = null;
            if (this.refs.inputbox.value === this.___lastFireValue___) return;
            this.___lastFireValue___ = this.refs.inputbox.value;
            this.___lastCursorPos___ = util.getCursorPosition(this.refs.inputbox);
            var e = { target: this.refs.container };
            e.target.value = this.___lastFireValue___;
            this.___dispatchChange___(e);
        }
    };
});