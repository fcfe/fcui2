define(function (require) {

    const React = require('react');
    const TextArea = require('fcui2/TextArea.jsx');
    const Skin = require('fcui2/Skin.jsx');

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
                            <TextArea placeholder="placeholder"/>&nbsp;
                            <TextArea skin="reject"/>&nbsp;
                            <TextArea disabled={true}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                        <Skin skin="oneux3">
                            <TextArea placeholder="placeholder" value={this.state.value} onChange={this.onChange}/>&nbsp;
                            <TextArea skin="reject" value={this.state.value}/>&nbsp;
                            <TextArea disabled={true} value={this.state.value}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <TextArea placeholder="placeholder"/>&nbsp;
                            <TextArea skin="reject"/>&nbsp;
                            <TextArea disabled={true}/>
                        </Skin>
                    </div>
                </div>
            );
        }
    });


});

