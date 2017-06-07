/**
 * @file 侧拉门
 * @author Han Bing Feng
 */

define(function (require) {

    let React = require('react');
    let Button = require('fcui2/Button.jsx');
    let ShojiScreen = require('fcui2/ShojiScreen.jsx');
    let Information = require('../Information.jsx');  
    let DropDownRegion = require('fcui2/DropDownRegion.jsx');
    let Dialog = require('fcui2/Dialog.jsx');
    let dialog = new Dialog();

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
        onAlert: function () {
            dialog.alert({
                title: 'Dialog',
                content: 'abc'
            });
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
            return (
                <div>
                    {itemFactory(config, this)}
                    <Button label="alert" onClick={this.onAlert}/>
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
                            <div style={{height:300}}></div>
                            <DropDownRegion/>
                        </div>
                    </ShojiScreen>
                </div>
            );
        }
        return doms;
    }


});
