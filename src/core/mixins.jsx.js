define(function (require) {


    var util = require('./util.es6');
    var React = require('react');
    var ReactDOM = require('react-dom');


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
        // 用于需要记录鼠标状态的组件，如layer
        mouseContainer: {
            mouseleave: function (e) {
                e.stopPropagation();
                this.setState({mouseover: false});
            },
            mouseenter: function (e) {
                e.stopPropagation();
                this.setState({mouseover: true});
            },
        },
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
                    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                    if (scrollY - dom.__posTop + obj.top < 0) {
                        dom.className = dom.className.replace(' fcui2-fixed-with-scroll', '');
                        dom.style.zIndex = dom.__zIndex;
                        dom.style.top = dom.__top
                    }
                    else if (pos.y < obj.top) {
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
                    dom.__posTop = pos.top;
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
            layerContainer: null,
            layerShow: function () {
                var me = this;
                if (me.layerContainer == null) {
                    me.layerContainer = document.createElement('div');
                    me.layerContainer.className = 'fcui2-layer'
                }
                if (me.layer || typeof me.props.layerContent !== 'function') return;
                document.body.appendChild(me.layerContainer);
                var props = {
                    parent: me,
                    datasource: me.props.datasource,
                    onAction: me.layerAction
                };
                var timer = null;
                if (typeof me.props.layerProps === 'object') {
                    for (var key in me.props.layerProps) {
                        if (props.hasOwnProperty('key')) continue;
                        props[key] = me.props.layerProps[key];
                    }
                }
                me.layer = ReactDOM.render(React.createElement(me.props.layerContent, props), me.layerContainer);
                timer = setInterval(fixedPosition, 5);
                function fixedPosition() {
                    var height = me.layerContainer.offsetHeight;
                    var container = me.refs.container;
                    var layer = me.layerContainer;
                    if (!me.state.mouseover || !container) {
                        clearInterval(timer);
                        return;
                    }
                    if (height === 0) return;
                    clearInterval(timer);
                    var pos = util.getDOMPosition(container);
                    var top = (pos.y + container.offsetHeight + height < document.documentElement.clientHeight)
                        ? (pos.y + container.offsetHeight) : (pos.y - height);
                    var left = pos.x;
                    layer.style.left = left + 'px';
                    layer.style.top = top + 'px';
                    timer = setInterval(autoHide, 1000);
                }
                function autoHide() {
                    if (me.layer == null) {
                        clearInterval(timer);
                        return;
                    }
                    if (me.state.mouseover || me.layer.state.mouseover) return;
                    clearInterval(timer);
                    me.layerHide();
                }
            },
            layerHide: function () {
                this.layer = null;
                try {
                    document.body.removeChild(this.layerContainer);
                } catch (e) {
                    // TODO
                }
            }
        }
    };
});
