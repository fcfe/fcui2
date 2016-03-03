define(function (require) {


    var util = require('./util.es6');
    var React = require('react');
    var ReactDOM = require('react-dom');


    // 更新输入组件的信息反馈
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
    function formLevelCheck(data, checkers, isSubmiting) {
        var checkPassed = true;
        var checkMessage = '';
        if (checkers instanceof Array) {
            for (var i = 0; i < checkers.length; i++) {
                var func = checkers[i];
                if (typeof func !== 'function') continue;
                var result = func(data, isSubmiting);
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
                if (typeof this.resizing === 'function') {
                    this.resizing();
                }
            }
        },
        // 用于含有随滚动条fixed dom的组件，如table，需要fixed header
        fixedContainer: {
            scrollTimer: null,
            scrollHandler: function () {
                this.scrolling();
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
                        dom.className = dom.__className;
                        dom.style.zIndex = dom.__zIndex;
                        dom.style.top = dom.__top
                    }
                    else if (pos.y < obj.top) {
                        dom.className = dom.__className + ' fcui2-fixed-with-scroll';
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
                    dom.__className = dom.className;
                    dom.__posTop = pos.top;
                    dom.__zIndex = dom.style.zIndex;
                    dom.__top = dom.style.top;
                }
            }
        },
        /**
         * 表单form mixin，任何component引入此mixin后会变身成表单
         */
        formContainer: {
            /**
             * 已经注册的输入组件hash
             */
            registedField: {},
            /**
             * 注册输入组件到form，此方法由输入组件的生命周期componentDidMount调用
             */
            registField: function (child) {
                var field = child.props.formField;
                if (typeof field !== 'string' || this.registedField[field]) {
                    return;
                }
                this.registedField[field] = child;
            },
            /**
             * 还原表单所有域
             */
            resetForm: function () {
                for (var key in this.registedField) {
                    var child = this.registedField[key];
                    if (typeof child.reset === 'function') {
                        child.reset();
                    }
                    else {
                        var state = child.getInitialState();
                        child.setState(state);
                    }
                }
            },
            /**
             * 获取form中所有域的值及校验结果，此方法form外部手动调用
             */
            getFormData: function () {
                // 表单数据
                var data = {};
                // 表单是否全部校验完毕
                var checkPassed = true;
                // 输入域的校验，遍历每个输入域
                // 读取state.value，调用输入组件的校验方法进行校验
                // 将校验结果和输入的value合并到form上
                // 更新输入组件的校验状态
                // 在表单中反馈输入组件的校验信息
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
                // 记录校验结果，设置表单的输入反馈
                var formCheckResult = formLevelCheck(data, this.props.checkout, 1);
                formCheckResult.checkPassed = formCheckResult.checkPassed && checkPassed;
                this.setState(formCheckResult);
                // 返回校验结果和表单数据
                return {
                    data: data,
                    checkPassed: formCheckResult.checkPassed
                };
            },
            /**
             * 更新表单域，由注册的输入组件生命周期componentWillUpdate自动触发
             */
            registedFieldUpdate: function (field, state) {
                if (!this.registedField[field]) return;
                // 读取发生onChange组件的校验信息，在表单中反馈校验结果
                var child = this.registedField[field];
                var checkPassed = state.checkPassed;
                updateFeedback(checkPassed !== true ? state.checkMessage : '', this.refs[child.props.formFeedback]);
                // 域未通过校验，将校验结同步到表单，并直接返回
                if (checkPassed !== true) {
                    this.setState({checkPassed: false});
                    return;
                }
                // 没有表单级别校验，直接返回
                if (!(this.props.checkout instanceof Array) || this.props.checkout.length === 0) {
                    return;
                }
                // 域通过了校验，开始表单级别校验
                var data = {};
                data[field] = state.value;
                // 遍历除了当前域外的所有域，拼装数据
                for (var key in this.registedField) {
                    if (key === field) continue;
                    var inputState = this.registedField[key].state;
                    // 同步校验结果到form
                    checkPassed = checkPassed && inputState.checkPassed;
                    // 如果输入组件还没有被用户操作过，数据不进入表单
                    if (inputState.changed !== true) continue;
                    data[key] = inputState.value;
                }
                // 表单级别校验，并同步校验结果到form中
                var formCheckResult = formLevelCheck(data, this.props.checkout);
                formCheckResult.checkPassed = formCheckResult.checkPassed && checkPassed;
                this.setState(formCheckResult);
            }
        },
        /**
         * 输入组件mixin，引入此mixin的组件将会变成form可自动检验的组件，要求组件有以下特性：
         * 1：{Any type} state.value，存储用户输入值
         * 2：{boolean} state.checkPassed，输入组件是否通过了自身校验
         * 3：{string} state.checkMessage，输入组件如果没通过自身校验，这里存储校验错误提示，否则为空串
         * 4  {ReactComponent} props.form form组件，不一定父亲，可以是任何祖先甚至其他，不建议其他
         * 5：{string} props.formField，输入组件值在form中的域名，相当于name
         * 6. {string} props.formFeedback，输入组件在form中的结果显示框，可以是dom，也可以是含有state.value的组件，对应form中的某个ref
         * 7：{Array.<function>} props.checkout，输入组件的校验队列
         */
        formField: {
            // @override
            // 输入组件自动注册自身到form中
            componentDidMount: function () {
                if (
                    typeof this.props.form === 'object'
                    && typeof this.props.form.registField === 'function'
                ) {
                    this.props.form.registField(this);
                }
            },
            // @override
            // 输入组件响应用户行为后，自身onChange中进行checkValue，将校验结果和输入值同步到state中
            // setState后，在此方法截获用户更新的state，并将值通知给form，此方法为只读，不影响setState操作
            componentWillUpdate: function (props, state) {
                if (
                    typeof this.props.form === 'object'
                    && typeof this.props.form.registedFieldUpdate === 'function'
                    && state.value !== this.state.value
                ) {
                    this.props.form.registedFieldUpdate(this.props.formField, state);
                }
            },
            // 输入组件公共校验方法，循环调用校验队列中的函数，并返回校验结果
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
