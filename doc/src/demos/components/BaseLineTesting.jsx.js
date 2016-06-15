define(function (require) {


    var React = require('react');

    // 下面所有组件都是inline-block
    var Button = require('fcui/Button.jsx');
    var TextBox = require('fcui/TextBox.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');
    var Select = require('fcui/Select.jsx');
    var CheckBox = require('fcui/CheckBox.jsx');
    var Radio = require('fcui/Radio.jsx');
    var DropDownList= require('fcui/DropDownList.jsx');
    var DropDownCalendar = require('fcui/DropDownCalendar.jsx');
    var RangeCalendar = require('fcui/RangeCalendar.jsx');
    var DropDownRegion = require('fcui/DropDownRegion.jsx')
    var ComboList = require('fcui/ComboList.jsx');
    var SearchBox = require('fcui/SearchBox.jsx');
    var Tip = require('fcui/Tip.jsx');


    return React.createClass({
        render: function () {
            return (
                <div className="demo-content demo-item">
                    <h3>Test Display Base Line</h3>
                    <br/>
                    <div style={{border: '1px solid #E8E8E8'}}>
                        <span style={{textDecoration: 'underline',fontSize: 12}}>Display Base Line:</span>
                        <Tip title="这是啥"/>
                        <Button/>
                        <DropDownList/>
                        <ComboList/>
                        <SearchBox/>
                    </div>
                    <div style={{border: '1px solid #E8E8E8', lineHeight: '50px', marginTop: '30px'}}>
                        <span style={{textDecoration: 'underline',fontSize: 12}}>Display Base Line:</span>
                        <Button/>
                        <CheckBox label="复选框"/>
                        <Radio label="主说要有光，于是有了光"/>
                        <TextBox/>
                        <SearchBox/>
                    </div>
                    <div style={{border: '1px solid #E8E8E8', lineHeight: '80px', marginTop: '30px'}}>
                        <span style={{textDecoration: 'underline',fontSize: 12}}>Display Base Line:</span>
                        <Button/>
                        <NumberBox/>
                        <TextBox/>
                        <Select/>
                        <DropDownCalendar/>
                    </div>
                    <div style={{border: '1px solid #E8E8E8', lineHeight: '50px', marginTop: '30px'}}>
                        <span style={{textDecoration: 'underline',fontSize: 48}}>Display Base Line:</span>
                        <Button/>
                        <RangeCalendar/>
                        <DropDownRegion/>
                        <SearchBox/>
                    </div>
                </div>
            );
        }
    });
});
