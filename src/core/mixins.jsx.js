define(function (require) {
    var util = require('./util.es6');
    var React = require('react');
    return {
        formContainer: {
            registedField: {},
            registField: function (child) {
                var field = child.props.formField;
                if (
                    typeof field !== 'string'
                    || this.registedField[field]
                    || typeof child.changeHandler !== 'function'
                ) {
                    return;
                }
                this.registedField[field] = child;
            },
            registedFieldUpdate: function (field, state) {
                if (!this.registedField[field]) return;
                // 检测单一域
                var child = this.registedField[field];
                var feedback = this.refs[child.props.formFeedback];
                var checkPassed = state.checkPassed;
                var checkMessage = '';
                updateFeedback(checkPassed !== true ? state.checkMessage : '');
                if (
                    checkPassed !== true
                    || (!(this.props.checkout instanceof Array) || this.props.checkout.length === 0)
                ) {
                    this.setState({checkPassed: checkPassed});
                    return;
                }
                // 表单联合校验
                var data = {};
                for (var key in this.registedField) {
                    var inputState = this.registedField[key].state;
                    if (inputState.changed !== true) continue;
                    data[key] = inputState.value;
                    checkPassed = checkPassed && inputState.checkPassed;
                }
                data[field] = state.value;
                for (var i = 0; i < this.props.checkout.length; i++) {
                    var func = this.props.checkout[i];
                    if (typeof func !== 'function') continue;
                    var result = func(data);
                    if (result !== true) {
                        checkPassed = false;
                        checkMessage = result;
                        break;
                    }
                }
                this.setState({
                    checkPassed: checkPassed,
                    checkMessage: checkMessage
                });
                // 检测表单联合域
                function updateFeedback(v) {
                    if (!feedback) return;
                    if (feedback.tagName) {
                        feedback.innerHTML = v;
                    }
                    else {
                        feedback.setState({value: v});
                    }
                }
            }
        },
        formField: {
            // @override
            componentDidMount: function () {
                if (
                    typeof this.props.form === 'object'
                    && typeof this.props.form.registField === 'function'
                ) {
                    this.props.form.registField(this);
                }
            },
            // @override
            componentWillUpdate: function (props, state) {
                if (
                    typeof this.props.form === 'object'
                    && typeof this.props.form.registedFieldUpdate === 'function'
                    && state.value !== this.state.value
                ) {
                    this.props.form.registedFieldUpdate(this.props.formField, state);
                }
            },
            checkValue: function (v) {
                if (
                    !(this.props.checkout instanceof Array)
                    || this.props.checkout.length === 0
                ) {
                    return true;
                }
                for (var i = 0; i < this.props.checkout.length; i++) {
                    var result = this.props.checkout[i](v);
                    if (result !== true) return result;
                }
                return true;
            }
        },
        layerContainer: {
            fixedLayerPosition: function () {
                util.fixedLayerPositionTB(this.refs.container, this.refs.layer, this);
            },
            showLayer: function () {
                if (this.state.disable) return;
                this.setState({showLayer: !this.state.showLayer});
                this.fixedLayerPosition();
            },
            hideLayer: function () {
                if (this.state.disable) return;
                this.setState({showLayer: false});
            }
        },
        layerList: {
            produceList: function (item, index) {
                var me = this;
                var children = item.datasource instanceof Array ? item.datasource : [];
                var itemProp = {
                    onClick: me.clickHandler,
                    className: 'item' + (me.state.disable || item.disable ? ' disable' : ''),
                    key: index
                };
                var spanProp = {
                    onClick: me.clickHandler
                };
                var rightArrowProp = {
                    className: 'icon-right font-icon font-icon-largeable-caret-right',
                    style: {
                        visibility: children.length > 0 ? 'visible' : 'hidden'
                    }
                };
                var rightLayerProp = {
                    className: 'layer ' + (children.length > 0 ? 'right-layer' : 'disable-layer')
                };
                if (!(me.state.disable || item.disable)) {
                    itemProp['data-ui-cmd'] = spanProp['data-ui-cmd'] = item.value;
                }
                return (
                    <div {...itemProp}>
                        <div {...rightArrowProp}></div>
                        <span {...spanProp}>{item.label}</span>
                        <div {...rightLayerProp}>{children.map(this.produceList)}</div>
                    </div>
                );
            }
        }
    };
});
