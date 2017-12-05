define(function (require) {

    const React = require('react');
    const NumberBox = require('fcui2/NumberBox.jsx');
    const Skin = require('fcui2/Skin.jsx');

    return React.createClass({
        getInitialState() {
            return {
                value: 12
            };
        },
        onChange(e) {
            this.setState({value: e.target.value});
        },
        render() {
            return (
                <div>
                    <div className="demo-item">
                        <h4>OneUX 4</h4>
                        <Skin skin="oneux4">
                            <h5>Skin</h5>
                            <NumberBox placeholder="placeholder"/>&nbsp;
                            <NumberBox skin="reject"/>&nbsp;
                            <NumberBox disabled={true}/>&nbsp;
                            <NumberBox showSpinButton={true}/>
                            <h5>Size</h5>
                            <NumberBox placeholder="placeholder" showSpinButton={true} className="fcui2-numberbox-small"/>&nbsp;
                            <NumberBox placeholder="placeholder" showSpinButton={true}/>&nbsp;
                            <NumberBox placeholder="placeholder"showSpinButton={true} className="fcui2-numberbox-big"/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                        <Skin skin="oneux3">
                            <NumberBox placeholder="placeholder" value={this.state.value} onChange={this.onChange}/>&nbsp;
                            <NumberBox skin="reject" value={this.state.value}/>&nbsp;
                            <NumberBox disabled={true} value={this.state.value}/>&nbsp;
                            <NumberBox showSpinButton={true}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <NumberBox placeholder="placeholder"/>&nbsp;
                            <NumberBox skin="reject"/>&nbsp;
                            <NumberBox disabled={true}/>&nbsp;
                            <NumberBox showSpinButton={true}/>
                        </Skin>
                    </div>
                </div>
            );
        }
    });


});

