define(function (require) {


    const React = require('react');
    const Skin = require('fcui2/Skin.jsx');
    const Slider = require('fcui2/Slider.jsx');


    return React.createClass({
        render() {
            return (
                <div>
                    <div className="demo-item">
                        <h4>OneUX 4</h4>
                        <Skin skin="oneux4">
                            <Slider width={300}/><br/><br/><br/>
                            <Slider width={300} showLabel={true} value={50}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                        <Skin skin="oneux3">
                            <Slider width={300}/><br/><br/><br/>
                            <Slider width={300} showLabel={true} value={50}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <Slider width={300}/><br/><br/><br/>
                            <Slider width={300} showLabel={true} value={50}/>
                        </Skin>
                    </div>
                </div>
            );
        }
    });
});
