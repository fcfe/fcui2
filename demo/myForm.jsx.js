define(function (require) {


    var TextBox = require('fcui/TextBox.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');
    var Button = require('fcui/Button.jsx');


    var React = require('react');
    var mixins = require('fcui/core/mixins.jsx');
    var checker = require('fcui/core/checker');


    var nameCheckers = [
        checker.maxLength(4, '长度不能大于4'),
        checker.minLength(1, '姓名不能为空')
    ];
    var addressCheckers = [
        function (e) {
            return e.indexOf('abc') < 0 ? '必须含有abc' : true;
        }
    ];
    var ageCheckers = [
        function (e) {
            return e > 18 ? true : '必须大于18岁，嘿嘿嘿';
        }
    ];


    function isCheckerJumped(obj, isSubmit, props) {
        // 如果表单处于提交状态，不能跳过checker
        if (isSubmit) return false;
        // 如果obj对象缺少任何一个给定的属性，跳过checker
        for (var i = 0; i < props.length; i++) {
            if (!obj.hasOwnProperty(props[i])) return true;
        }
    }

    var formCheckers = [
        function (e, isSubmit) {
            if (isCheckerJumped(e, isSubmit, ['address', 'name'])) return true;
            if (e.name.indexOf('3') > -1 && e.address.indexOf('bcd') > -1) {
                return '姓名含有3时，地址不能含有bcd';
            }
            return true;
        },
        function (e, isSubmit) {
            if (isCheckerJumped(e, isSubmit, ['name', 'age'])) return true;
            if (e.age > 20 && e.name.indexOf('a') > -1) {
                return '大于20岁的人，姓名中不能含有a';
            }
            return true;
        }
    ];


    return React.createClass({
        // @override
        mixins: [mixins.formContainer],
        // @override
        getDefaultProps: function () {
            return {
                disable: false,
                checkout: formCheckers
            }
        },
        // @override
        getInitialState: function () {
            return {
                disable: this.props.disable,
                checkPassed: true,
                checkMessage: ''
            };
        },
        // @override
        componentWillReceiveProps: function (props) {
            this.setState({
                disable: props.disable
            });
        },
        submit: function () {
            var result = this.getFormData();
            alert(JSON.stringify(result));
        },
        render: function () {
            return (
                <div className="my-form">
                    <div className="info">
                        姓名不能超过4个字符；<br/>
                        地址必须含有abc，且姓名含有3时，地址不能含有bcd<br/>
                        大于20岁的人名字里不能含有a
                    </div>
                    <div className="fieldItem">
                        <span className="label">姓名：</span>
                        <TextBox label="请输入姓名，最多4个字符"
                            checkout={nameCheckers}
                            disable={this.state.disable}
                            form={this}
                            formField="name"
                            formFeedback="nameFeedback"/>
                        <span className="alert" ref="nameFeedback"></span>
                    </div>
                    <div className="fieldItem">
                        <span className="label">地址：</span>
                        <TextBox label="必须含有abc，且姓名含有3时，地址不能含有bcd" width="300"
                            checkout={addressCheckers}
                            disable={this.state.disable}
                            form={this}
                            formField="address"
                            formFeedback="addressFeedback"/>
                        <span className="alert" ref="addressFeedback"></span>
                    </div>
                    <div className="fieldItem">
                        <span className="label">年龄：</span>
                        <NumberBox min="0" max="100"
                            checkout={ageCheckers}
                            disable={this.state.disable}
                            form={this}
                            formField="age"
                            formFeedback="ageFeedback"/>
                        <span className="alert" ref="ageFeedback"></span>
                    </div>
                    <div className="alert">{this.state.checkMessage}</div>
                    <Button className="button-submit" skin="important" label="确定"
                        disable={this.state.disable || !this.state.checkPassed}  onClick={this.submit}/>
                    <Button disable={this.state.disable} label="取消"/>
                </div>
            );
        }
    });
});
