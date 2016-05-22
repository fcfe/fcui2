/**
 * @file 弹出层，下拉层demo
 * @author Han Bing Feng
 */

define(function (require) {

    let React = require('react');
    let Button = require('fcui/Button.jsx');
    let TitleWindow = require('fcui/ShojiScreen.jsx');    

    return React.createClass({
        // @override
        getDefaultProps() {
            return {};
        },
        getInitialState() {
            return {};
        },
        openWindow(e) {
            var state = {};
            state[e.target.value] = true;
            this.setState(state);
        },
        onAction1(type, param) {
            if (type !== 'CancelButtonClick') return;
            this.setState({window1: false});
        },
        onAction2(type, param) {
            if (type !== 'CancelButtonClick') return;
            this.setState({window2: false});
        },
        render() {
            return (
                <div>
                    <div className="demo-item">
                        <h3>Normal ShojiScreen</h3>
                        <Button label="Open" onClick={this.openWindow} value="window1"/>
                        <TitleWindow isOpen={this.state.window1} onAction={this.onAction1}>
                            <div style={{width: 400, height: 2000}}>
                                <h1>Normal ShojiScreen</h1>
                            </div>
                        </TitleWindow>
                    </div>
                    <div className="demo-item">
                        <h3>ShojiScreen with closing confirm.</h3>
                        <Button label="Open" onClick={this.openWindow} value="window2"/>
                        <TitleWindow isOpen={this.state.window2} onAction={this.onAction2}>
                            <div style={{width: 400, height: 2000}}>
                                <h1>ShojiScreen with closing confirm</h1>
                            </div>
                        </TitleWindow>
                    </div>
                    <div style={{width: 30, height: 2000}}></div>
                </div>
            );
        }
    });
});
