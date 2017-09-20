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
                            <Button label="disabled" disabled={true}/>&nbsp;
                            <h5>Size</h5>
                            <Button label="确定" className="fcui2-button-small"/>&nbsp;
                            <Button label="确定"/>&nbsp;
                            <Button label="确定" className="fcui2-button-big"/>
                            <br/><br/>
                            <Button label="确定" className="fcui2-button-small" skin="important"/>&nbsp;
                            <Button label="确定" skin="important"/>&nbsp;
                            <Button label="确定" className="fcui2-button-big" skin="important"/>
                            <br/><br/>
                            <Button label="确定" className="fcui2-button-small" skin="opacity"/>&nbsp;
                            <Button label="确定" skin="opacity"/>&nbsp;
                            <Button label="确定" className="fcui2-button-big" skin="opacity"/>
                            <h5>Only Icon</h5>
                            <Button icon="fcui2-icon fcui2-icon-arrow-left-2" width="28" iconLeft={4} label=""/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-arrow-left-2" width="28" iconLeft={4} label="" skin="grey"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-arrow-left-2" width="28" iconLeft={4} label="" skin="important"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-arrow-left-2" width="28" iconLeft={4} label="" skin="opacity"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-arrow-left-2" width="28" iconLeft={4} label="" skin="normal-blue"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-arrow-left-2" width="28" iconLeft={4} label="" skin="grey-blue"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-arrow-left-2" width="28" iconLeft={4} label="" skin="light-blue"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-arrow-left-2" width="28" iconLeft={4} label="" disabled={true}/>
                            <br/><br/>
                            <Button icon="fcui2-icon fcui2-icon-search" width="28" iconLeft={4} label="" className="fcui2-button-nocolor"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-search" width="28" iconLeft={4} label="" skin="normal-blue" className="fcui2-button-nocolor"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-search" width="28" iconLeft={4} label="" disabled={true} className="fcui2-button-nocolor"/>
                            <br/><br/>
                            <Button icon="fcui2-icon fcui2-icon-plus" label="    新建物料"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-arrow-right-2" label="查看更多    " iconLeft={70} skin="important"/>&nbsp;
                            <Button icon="fcui2-icon fcui2-icon-arrow-right-2" label="查看更多    " iconLeft={70} skin="opacity"/>
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
                            <Button label="disabled" disabled={true}/>&nbsp;
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <Button label="确定"/>&nbsp;
                            <Button label="important" skin="important"/>&nbsp;
                            <Button label="disabled" disabled={true}/>&nbsp;
                        </Skin>
                    </div>
                </div>
            );
        }
    });

});
