/**
 * @file 弹出层，下拉层demo
 * @author Han Bing Feng
 */

define(function (require) {

    let React = require('react');
    let Button = require('fcui/Button.jsx');
    let TitleWindow = require('fcui/TitleWindow.jsx');    

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
        closeWindow(e) {
            var state = {};
            state[e.target.value] = false;
            this.setState(state);
        },
        closerFactory(id) {
            var me = this;
            var state = {};
            state[id] = false;
            return function () {
                me.setState(state);
            };
        },
        confirmClosing(evt) {
            if (!confirm('Are you sure?')) {
                evt.returnValue = false;
            }
        },
        render() {
            return (
                <div>
                    <div className="demo-item">
                        <h3>Normal Window</h3>
                        <Button label="Open" onClick={this.openWindow} value="window1"/>
                        <TitleWindow isOpen={this.state.window1} onClose={this.closerFactory('window1')}>
                            <div style={{width: 400, height: 300}}>
                                Normal Window
                            </div>
                        </TitleWindow>
                    </div>
                    <div className="demo-item">
                        <h3>Window with title</h3>
                        <Button label="Open" onClick={this.openWindow} value="window2"/>
                        <TitleWindow isOpen={this.state.window2}
                            title="It is a Window with Title."
                            onClose={this.closerFactory('window2')}
                        >
                            <div>
                                <h1>Window with title.</h1>
                            </div>
                        </TitleWindow>
                    </div>
                    <div className="demo-item">
                        <h3>Window without close button in title bar</h3>
                        <Button label="Open" onClick={this.openWindow} value="window3"/>
                        <TitleWindow isOpen={this.state.window3} showCloseButton={false}>
                            <div style={{width: 400, height: 300}}>
                                <h1>Window without close button in title bar.</h1>
                                <Button label="close" onClick={this.closerFactory('window3')}/>
                            </div>
                        </TitleWindow>
                    </div>
                    <div className="demo-item">
                        <h3>Window with closing confirm</h3>
                        <Button label="Open" onClick={this.openWindow} value="window4"/>
                        <TitleWindow isOpen={this.state.window4}
                            onBeforeClose={this.confirmClosing}
                            onClose={this.closerFactory('window4')}
                        >
                            <div>
                                <h1>Window with closing confirm.</h1>
                            </div>
                        </TitleWindow>
                    </div>
                </div>
            );
        }
    });
});
