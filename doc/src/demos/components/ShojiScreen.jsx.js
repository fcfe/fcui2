/**
 * @file 侧拉门
 * @author Han Bing Feng
 */

define(function (require) {

    let React = require('react');
    let Button = require('fcui/Button.jsx');
    let ShojiScreen = require('fcui/ShojiScreen.jsx');
    let Information = require('../Information.jsx');  

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
            this.refs.sjc2.close();
        },
        onBeforeClose: function (e) {
            e.returnValue = window.confirm('Close it now ?');
        },
        onClose: function () {
            this.setState({window2: false});
        },
        render() {
            let config = [
                {
                    title: 'Normal ShojiScreen',
                    props: {
                        isOpen: this.state.window1,
                        onAction: this.onAction1
                    }
                },
                {
                    title: 'ShojiScreen with closing confirm',
                    props: {
                        ref: 'sjc2',
                        isOpen: this.state.window2,
                        onAction: this.onAction2,
                        onBeforeClose: this.onBeforeClose,
                        onClose: this.onClose
                    }
                }
            ];
            return (<div>{itemFactory(config, this)}</div>);
            return (
                <div>
                    <div className="demo-item">
                        <h3>Normal ShojiScreen</h3>
                        <Button label="Open" onClick={this.openWindow} value="window1"/>
                        <ShojiScreen isOpen={this.state.window1} onAction={this.onAction1}>
                            <div style={{width: 400, height: 2000}}>
                                <h1>Normal ShojiScreen</h1>
                            </div>
                        </ShojiScreen>
                    </div>
                    <div className="demo-item">
                        <h3>ShojiScreen with closing confirm.</h3>
                        <Button label="Open" onClick={this.openWindow} value="window2"/>
                        <ShojiScreen {...sjc2Prop}>
                            <div style={{width: 400, height: 2000}}>
                                <h1>ShojiScreen with closing confirm</h1>
                            </div>
                        </ShojiScreen>
                    </div>
                    <div style={{width: 30, height: 2000}}></div>
                </div>
            );
        }
    });

    
    function itemFactory(arr, me) {
        var doms = [];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            doms.push(
                <div className="demo-item" key={i}>
                    <Information title={item.title} props={item.props}/>
                    <Button label="Open" onClick={me.openWindow} value={'window' + (i + 1)}/>
                    <ShojiScreen {...item.props}>
                        <div style={{width: 400, height: 2000}}>
                            <h1>{item.title}</h1>
                        </div>
                    </ShojiScreen>
                </div>
            );
        }
        return doms;
    }


});
