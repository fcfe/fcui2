define(function (require) {

    const React = require('react');
    const TextLine = require('fcui2/TextLine.jsx');
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
                            <TextLine placeholder="placeholder"/>&nbsp;
                            <TextLine skin="reject"/>&nbsp;
                            <TextLine disabled={true}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                        <Skin skin="oneux3">
                            <TextLine placeholder="placeholder" value={this.state.value} onChange={this.onChange}/>&nbsp;
                            <TextLine skin="reject" value={this.state.value}/>&nbsp;
                            <TextLine disabled={true} value={this.state.value}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <TextLine placeholder="placeholder"/>&nbsp;
                            <TextLine skin="reject"/>&nbsp;
                            <TextLine disabled={true}/>
                        </Skin>
                    </div>
                </div>
            );
        }
    });


});

