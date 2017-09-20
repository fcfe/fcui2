define(function (require) {

    const React = require('react');
    const Skin = require('fcui2/Skin.jsx');
    const TextArea = require('fcui2/TextArea.jsx');


    return React.createClass({
        getInitialState() {
            return {
                value: '百度\n腾讯\n阿里\n腾讯\n阿里'
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
                            <TextArea placeholder="placeholder" value={this.state.value} onChange={this.onChange}/>&nbsp;
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                    </div>
                </div>
            );
        }
    });

});
