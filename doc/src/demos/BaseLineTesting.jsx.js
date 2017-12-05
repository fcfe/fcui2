define(function (require) {


    var React = require('react');

    // 下面所有组件都是inline-block
    var Button = require('fcui2/Button.jsx');
    var TextBox = require('fcui2/TextBox.jsx');
    var NumberBox = require('fcui2/NumberBox.jsx');
    var Select = require('fcui2/Select.jsx');
    var CheckBox = require('fcui2/CheckBox.jsx');
    var Radio = require('fcui2/Radio.jsx');
    var DropDownList= require('fcui2/DropDownList.jsx');
    var DropDownCalendar = require('fcui2/DropDownCalendar.jsx');
    var RangeCalendar = require('fcui2/RangeCalendar.jsx');
    var DropDownRegion = require('fcui2/DropDownRegion.jsx')
    var ComboList = require('fcui2/ComboList.jsx');
    var SearchBox = require('fcui2/SearchBox.jsx');
    var Tip = require('fcui2/Tip.jsx');
    var Switch = require('fcui2/Switch.jsx');

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
                        <Button label="按钮也是对不齐"/>
                        <DropDownList label="为啥一到业务里就对不齐"/>
                        <ComboList/>
                        <TextBox/>
                        <SearchBox/>
                        <Switch/>
                    </div>
                    <div style={{border: '1px solid #E8E8E8', lineHeight: '50px', marginTop: '30px'}}>
                        <span style={{textDecoration: 'underline',fontSize: 12}}>Display Base Line:</span>
                        <Button/>
                        <CheckBox label="复选框" checked={true}/>
                        <Radio label="主说要有光，于是有了光"/>
                        <TextBox value="abd" onChange={new Function()}/>
                        <SearchBox/>
                        <Switch/>
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
