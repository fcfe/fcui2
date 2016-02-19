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
        // 用于随window resize进行特殊渲染处理的组件，如table header
        resizeContainer: {
            resizeTimer: null,
            resizeHandler: function () {
                if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }
                var me = this;
                me.resizeTimer = setTimeout(function () {
                    if (typeof me.resizing === 'function') {
                        me.resizing();
                    }
                }, 1000 / 60);
            }
        },
        // 用于含有随滚动条fixed dom的组件，如table，需要fixed header
        fixedContainer: {
            scrollTimer: null,
            scrollHandler: function () {
                if (this.scrollTimer) {
                    clearTimeout(this.scrollTimer);
                }
                var me = this;
                me.scrollTimer = setTimeout(function () {
                    me.scrolling();
                }, 1000 / 60);
            },
            scrolling: function () {
                if (!(this.props.fixedPosition instanceof Array)) return;
                var fixedArray = this.props.fixedPosition;
                for (var i = 0; i < fixedArray.length; i++) {
                    var obj = fixedArray[i];
                    var dom = this.refs[obj.ref];
                    if (!dom) continue;
                    obj.top = isNaN(obj.top) ? 0 : obj.top * 1;
                    var pos = util.getDOMPosition(dom);
                    if (window.scrollY - dom.__posY + obj.top < 0 && dom.__fixed) {
                        dom.__fixed = false;
                        dom.className = dom.className.replace(' fcui2-fixed-with-scroll', '');
                        dom.style.zIndex = dom.__zIndex;
                        dom.style.top = dom.__top
                        return;
                    }
                    if (pos.y < obj.top) {
                        dom.__fixed = true;
                        dom.className = dom.className + ' fcui2-fixed-with-scroll';
                        dom.style.top = obj.top + 'px';
                        dom.style.zIndex = obj.zIndex;
                    }
                }
            },
            recordFixedDOMPosition: function () {
                if (!(this.props.fixedPosition instanceof Array)) return;
                var fixedArray = this.props.fixedPosition;
                for (var i = 0; i < fixedArray.length; i++) {
                    var obj = fixedArray[i];
                    var dom = this.refs[obj.ref];
                    if (!dom) continue;
                    var pos = util.getDOMPosition(dom);
                    dom.__posY = pos.top;
                    dom.__fixed = false;
                    dom.__zIndex = dom.style.zIndex;
                    dom.__top = dom.style.top;
                }
            }
        },
        // 用于想作为表单的组件
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
                // 表单级别校验
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
                    if (key === field) continue;
                    var inputState = this.registedField[key].state;
                    checkPassed = checkPassed && inputState.checkPassed;
                    if (inputState.changed !== true) continue;
                    data[key] = inputState.value;
                }
                var formCheckResult = formLevelCheck(data, this.props.checkout);
                formCheckResult.checkPassed = formCheckResult.checkPassed && checkPassed;
                this.setState(formCheckResult);
            }
        },
        // 用于表单输入域
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
        // 用于含有layer浮层的容器
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
        // 用于生成纯list列表的layer内容
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
