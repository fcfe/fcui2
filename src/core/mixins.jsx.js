define(function (require) {

    var util = require('./util.es6');
    var React = require('react');

    // 更新表单数据域回馈信息
    function updateFeedback(v, feedback) {
        if (!feedback) return;
        if (feedback.tagName) {
            feedback.innerHTML = v;
        }
        else {
            feedback.setState({value: v});
        }
    }

    // 表单级别校验
    function formLevelCheck(data, checkers, isSubmit) {
        var checkPassed = true;
        var checkMessage = '';
        if (checkers instanceof Array) {
            for (var i = 0; i < checkers.length; i++) {
                var func = checkers[i];
                if (typeof func !== 'function') continue;
                var result = func(data, isSubmit);
                if (result !== true) {
                    checkPassed = false;
                    checkMessage = result;
                    break;
                }
            }
        }
        return {
            checkPassed: checkPassed,
            checkMessage: checkMessage
        }
    }

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
            getFormData: function () {
                var data = {};
                var checkPassed = true;
                // 获取数据域，并进行域校验
                for (var key in this.registedField) {
                    if (!this.registedField.hasOwnProperty(key)) continue;
                    var child = this.registedField[key];
                    var result = child.checkValue(child.state.value);
                    checkPassed = checkPassed && (result === true);
                    data[key] = child.state.value;
                    child.setState({
                        checkPassed: result === true ? true : false,
                        checkMessage: result === true ? '' : result
                    });
                    updateFeedback(result !== true ? result : '', this.refs[child.props.formFeedback]);
                    
                }
                // 表单界别校验
                var formCheckResult = formLevelCheck(data, this.props.checkout, 1);
                formCheckResult.checkPassed = formCheckResult.checkPassed && checkPassed;
                this.setState(formCheckResult);
                return {
                    data: data,
                    checkPassed: formCheckResult.checkPassed
                };
            },
            registedFieldUpdate: function (field, state) {
                if (!this.registedField[field]) return;
                // 检测单一域
                var child = this.registedField[field];
                var checkPassed = state.checkPassed;
                updateFeedback(checkPassed !== true ? state.checkMessage : '', this.refs[child.props.formFeedback]);
                if (checkPassed !== true) {
                    this.setState({checkPassed: false});
                    return;
                }
                if (!(this.props.checkout instanceof Array) || this.props.checkout.length === 0) {
                    return;
                }
                // 表单联合校验
                var data = {};
                data[field] = state.value;
                for (var key in this.registedField) {
                    var inputState = this.registedField[key].state;
                    checkPassed = checkPassed && inputState.checkPassed;
                    if (inputState.changed !== true || key === field) continue;
                    data[key] = inputState.value;
                }
                var formCheckResult = formLevelCheck(data, this.props.checkout);
                formCheckResult.checkPassed = formCheckResult.checkPassed && checkPassed;
                this.setState(formCheckResult);
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
