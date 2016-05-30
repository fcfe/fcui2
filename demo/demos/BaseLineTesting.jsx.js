define(function (require) {


    var React = require('react');
    var Button = require('fcui/Button.jsx');
    var TextBox = require('fcui/TextBox.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');
    var TextArea = require('fcui/TextArea.jsx');
    var Select = require('fcui/Select.jsx');
    var CheckBox = require('fcui/CheckBox.jsx');
    var Radio = require('fcui/Radio.jsx');
    var Calendar = require('fcui/Calendar.jsx');
    var DropDownList= require('fcui/DropDownList.jsx');
    var DropDownCalendar = require('fcui/DropDownCalendar.jsx');
    var RangeCalendar = require('fcui/RangeCalendar.jsx');
    var Schedule = require('fcui/Schedule.jsx');
    var Region = require('fcui/Region.jsx');
    var DropDownRegion = require('fcui/DropDownRegion.jsx')
    var Slider = require('fcui/Slider.jsx');
    var ComboList = require('fcui/ComboList.jsx');

    return React.createClass({
        render: function () {
            return (
                <div className="demo-content demo-item">
                    <h1>Test Display Base Line</h1>
                    <span style={{textDecoration: 'underline',fontSize: 12}}>Display Base Line:</span>
                    <Button/>
                    <DropDownList/>
                    <ComboList/>
                    <br/>
                    <span style={{textDecoration: 'underline',fontSize: 12}}>Display Base Line:</span>
                    <Button/>
                    <CheckBox label="复选框"/>
                    <Radio label="主说要有光，于是有了光"/>
                    <TextBox/>
                    <br/>
                    <span style={{textDecoration: 'underline',fontSize: 12}}>Display Base Line:</span>
                    <Button/>
                    <NumberBox/>
                    <TextBox/>
                    <Select/>
                </div>
            );
        }
    });
});
