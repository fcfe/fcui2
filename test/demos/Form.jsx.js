define(function (require) {


    var React = require('react');
    var Button = require('fcui/Button.jsx');
    var Form = require('fcui/Form.jsx');
    var TextBox = require('fcui/TextBox.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');
    var TextArea = require('fcui/TextArea.jsx');
    var Select = require('fcui/Select.jsx');
    var CheckBox = require('fcui/CheckBox.jsx');
    var Radio = require('fcui/Radio.jsx');
    var Calendar = require('fcui/Calendar.jsx');
    var DropDownCalendar = require('fcui/DropDownCalendar.jsx');
    var RangeCalendar = require('fcui/RangeCalendar.jsx');
    var Schedule = require('fcui/Schedule.jsx');
    var DropDownSchedule = require('fcui/DropDownSchedule.jsx');
    var Region = require('fcui/Region.jsx');
    var DropDownRegion = require('fcui/DropDownRegion.jsx')
    var Slider = require('fcui/Slider.jsx');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        getInitialState: function () {
            return {
                message: '',
                message1: ''
            };
        },
        formFieldChange: function (state) {
            this.setState({
                message: JSON.stringify(state)
            });
        },
        form1FieldChange: function (state) {
            this.setState({
                message1: JSON.stringify(state)
            });
        },
        render: function () {
            var containerProp = {
                className: 'demo-content demo-item',
                style: {
                    display: this.props.demo === 'Form' ? 'block' : 'none'
                }
            };
            var nameValid = {
                required: true,
                maxLength: 4
            };
            var ageValid = {
                required: true,
                min: function (v) {
                    return v < 18 ? '不能小于18岁': true;
                }
            };
            var introValid = {
                required: true,
                maxByteLength: 40
            };
            var formValid = {
                hehe: function (values) {
                    if (values.age > 20 && values.name.indexOf('a') < 0) return '大于20岁的人姓名里必须含有a';
                    return true;
                }
            };
            return (
                <div {...containerProp}>
                    <h3>Normal Form</h3>
                    <div className="props">{this.state.message1}</div>
                    <Form className="demo-form" onFieldChange={this.form1FieldChange}>
                    <table><tbody>
                        <tr>
                            <td>
                                姓名：<TextBox name="name" value="abc"/><br/>
                                年龄：<NumberBox name="age"/><br/>
                                职业：
                                    <Select datasource={[
                                        {label:'有职业',value: 'have'},
                                        {label:'无职业', value:'none'}
                                    ]} name="job" /><br/>
                                逗逼：<CheckBox name="2b"/><br/>
                                口味：
                                    <Radio label="甜豆腐脑" value="1" name="doufunao" labelPosition="right"/>
                                    <Radio label="咸豆腐脑" value="2" name="doufunao" labelPosition="right"/><br/>
                                生日：<DropDownCalendar width="180px" name="birthday"/><br/>
                                休假：<RangeCalendar width="180px" name="holiday"/><br/>
                                保健：<DropDownSchedule width="180px" name="heihei" label="大宝剑时段"/><br/>
                                籍贯：<DropDownRegion width="180px" name="jiguan" label="选择籍贯"/><br/>
                                简介：<TextArea className="form-textarea" name="intro"/>
                            </td>
                            <td>
                                胸围：
                                    <Slider min="30" max="100" name="size"/>
                                身高：<br/>
                                <div style={{marginLeft: 40}}>
                                    <Radio label="小于165cm" value="1" name="height"/><br/>
                                    <Radio label="165-175cm" value="2" name="height"/><br/>
                                    <Radio label="175-185cm" value="3" name="height"/><br/>
                                    <Radio label="185-195cm" value="4" name="height"/><br/>
                                    <Radio label="大于195cm" value="5" name="height"/>
                                </div>
                                入职时间：<Calendar name="joinData"/>  
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                出差意愿：
                                <Region name="chuchai"/>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                空间时间：
                                <Schedule name="freeTime"/>
                            </td>
                        </tr>
                    </tbody></table>
                    </Form>
                    <h3>Form With Validation</h3>
                    <div className="props">{this.state.message}</div>
                    <Form className="demo-form"
                        onFieldChange={this.formFieldChange} onSubmit={this.formFieldChange}
                        validations={formValid}
                    >
                        姓名：<TextBox name="name" validations={nameValid}/><br/>
                        年龄：<NumberBox name="age" validations={ageValid}/><br/>
                        简介：<TextArea name="intro" className="form-textarea" validations={introValid}/>
                        <Button type="submit" label="提交" skin="important"/>
                    </Form>
                </div>
            );
        }
    });
});
