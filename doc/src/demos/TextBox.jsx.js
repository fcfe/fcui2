define(function (require) {

    const React = require('react');
    const Skin = require('fcui2/Skin.jsx');
    const TextBox = require('fcui2/TextBox.jsx');

    return React.createClass({
        getInitialState() {
            return {
                value: 'a'
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
                            <TextBox/>&nbsp;
                            <TextBox placeholder="placeholder"/>&nbsp;
                            <TextBox skin="reject"/>&nbsp;
                            <TextBox disabled={true} value="value"/>&nbsp;
                            <TextBox disabled={true} placeholder="placeholder"/>&nbsp;
                            <TextBox disabled={true}/>
                            <h5>Counter</h5>
                            <TextBox value={this.state.value} count={this.state.value.length + '/100'} onChange={this.onChange}/>&nbsp;
                            <TextBox skin="reject" count="205/200"/>&nbsp;
                            <h5>Size</h5>
                            <TextBox className="fcui2-textbox-small" placeholder="placeholder" count="0/0"/>&nbsp;
                            <TextBox/>&nbsp;
                            <TextBox className="fcui2-textbox-big" placeholder="placeholder" count="0/0"/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                        <Skin skin="oneux3">
                            <TextBox value="value"/>&nbsp;
                            <TextBox placeholder="placeholder"/>&nbsp;
                            <TextBox skin="reject"/>&nbsp;
                            <TextBox disabled={true} value="value"/>&nbsp;
                            <TextBox disabled={true} placeholder="placeholder"/>&nbsp;
                            <TextBox disabled={true}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <TextBox value="value"/>&nbsp;
                            <TextBox placeholder="placeholder"/>&nbsp;
                            <TextBox skin="reject"/>&nbsp;
                            <TextBox disabled={true} value="value"/>&nbsp;
                            <TextBox disabled={true} placeholder="placeholder"/>&nbsp;
                            <TextBox disabled={true}/>
                        </Skin>
                    </div>
                </div>
            );
        }
    });

});
