/**
 * @file 弹出层，下拉层demo
 * @author Han Bing Feng
 */

define(function (require) {

    let React = require('react');
    let DeployablePanel = require('fcui2/DeployablePanel.jsx');    
    let Button = require('fcui2/Button.jsx');

    return React.createClass({
        // @override
        getDefaultProps() {
            return {};
        },
        getInitialState() {
            return {
                window2: 'expand'
            };
        },
        changeFactory(id) {
            let me = this;
            return function (e) {
                let state = {};
                state[id] = e.target.value;
                me.setState(state);
            };
        },
        render() {
            let config = [
                {
                    title: 'Normal DeployablePanel',
                    props: {}
                },
                {
                    title: 'Expanded DeployablePanel',
                    props: {
                        value: this.state.window2
                    }
                },
                {
                    title: 'DeployablePanel with closing confirm',
                    props: {
                        onBeforeClose: this.confirmClosing
                    }
                }
            ];
            for (let i = 0; i < config.length; i++) {
                config[i].props.onChange = this.changeFactory('window' + (i + 1))
            }
            return (<div>{itemFactory(config, this)}</div>);
        }
    });

    function itemFactory(arr, me) {
        let doms = [];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            doms.push(
                <div className="demo-item" key={i}>
                    <DeployablePanel {...item.props}>
                        <Button/><Button/><Button/><Button/><Button/><br/>
                        <Button/><Button/><Button/><Button/><Button/>
                    </DeployablePanel>
                </div>
            );
        }
        return doms;
    }

});
