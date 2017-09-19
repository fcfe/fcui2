define(function (require) {

    const React = require('react');
    const Skin = require('fcui2/Skin.jsx');
    const Button = require('fcui2/Button.jsx');


    return React.createClass({
        render() {
            return (
                <div>
                    <div className="demo-item">
                        <h4>OneUX 4</h4>
                        <Skin skin="oneux4">
                            <h5>Skin</h5>
                            <Button label="确定"/>&nbsp;
                            <Button label="grey" skin="grey"/>&nbsp;
                            <Button label="important" skin="important"/>&nbsp;
                            <Button label="opacity" skin="opacity"/>&nbsp;
                            <Button label="normal-blue" skin="normal-blue"/>&nbsp;
                            <Button label="grey-blue" skin="grey-blue"/>&nbsp;
                            <Button label="light-blue" skin="light-blue"/>&nbsp;
                            <Button label="disabled" skin="disabled"/>&nbsp;
                            <h5>Size</h5>
                            <Button label="确定" className="fcui2-button-small"/>&nbsp;
                            <Button label="确定"/>&nbsp;
                            <Button label="确定" className="fcui2-button-big"/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                        <Skin skin="oneux3">
                            <Button label="确定"/>&nbsp;
                            <Button label="active" skin="active"/>&nbsp;
                            <Button label="grey1" skin="grey1"/>&nbsp;
                            <Button label="grey" skin="grey"/>&nbsp;
                            <Button label="blue" skin="blue"/>&nbsp;
                            <Button label="important" skin="important"/>&nbsp;
                            <Button label="disabled" skin="disabled"/>&nbsp;
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <Button label="确定"/>&nbsp;
                            <Button label="active" skin="active"/>&nbsp;
                            <Button label="important" skin="important"/>&nbsp;
                            <Button label="disabled" skin="disabled"/>&nbsp;
                        </Skin>
                    </div>
                </div>
            );
        }
    });

});
