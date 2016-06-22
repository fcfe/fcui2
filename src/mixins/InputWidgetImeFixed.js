/**
 * 输入框流劫持
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {

    var util = require('../core/util');

    return {
        // @override
        componentDidMount: function () {
            var value = this.___getValue___();
            this.refs.inputbox.value = value;
            this.___lastFiredValue___ = value;
            this.___lastCursorPos___ = -1;
            this.___imeStart___ = false;
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            var value = nextProps.value
            if (value === undefined || value == null || nextProps.value + '' === this.refs.inputbox.value + '') return;
            value = value + '';
            this.___lastFiredValue___ = value;
            this.setState({___value___: value});
            this.refs.inputbox.value = value;
            if (this.___lastCursorPos___ > -1 && this.___lastCursorPos___ < value.length) {
                util.setCursorPosition(this.refs.inputbox, this.___lastCursorPos___);
            }
        },
        ___onCompositionStart___: function (e) {
            this.___imeStart___ = true;
        },
        ___onCompositionEnd___: function (e) {
            this.___imeStart___ = false;
        },
        ___onKeyUp___: function (e) {
            this.___lastCursorPos___ = util.getCursorPosition(e.target);
            if (this.___imeStart___ || this.___lastFiredValue___ === this.refs.inputbox.value) return;
            var lastValue = this.___lastFiredValue___;
            e.target = this.refs.container;
            e.target.value = this.___lastFiredValue___ = this.refs.inputbox.value;
            this.___dispatchChange___(e, this.___lastFiredValue___, lastValue);
        },
        ___onPaste___: function (e) {
            var me = this;
            // onPaste天生拿不到新值，没办法，只能用timer
            setTimeout(function () {
                if (me.refs.inputbox.value === me.___lastFiredValue___) return;
                var evt = {target: me.refs.container};
                var lastValue = me.___lastFiredValue___;
                evt.target.value = me.___lastFiredValue___ = me.refs.inputbox.value;
                me.___dispatchChange___(evt, me.___lastFiredValue___, lastValue);
            }, 10);
        }
    };
});
