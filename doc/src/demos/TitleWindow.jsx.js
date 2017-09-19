/**
 * @file 弹出层，下拉层demo
 * @author Han Bing Feng
 */

define(function (require) {

    let React = require('react');
    let Button = require('fcui2/Button.jsx');
    let TitleWindow = require('fcui2/TitleWindow.jsx');    


    return React.createClass({
        // @override
        getDefaultProps() {
            return {};
        },
        getInitialState() {
            return {};
        },
        openWindow(e) {
            let state = {};
            state[e.target.value] = true;
            this.setState(state);
        },
        closeWindow(e) {
            let state = {};
            state[e.target.value] = false;
            this.setState(state);
        },
        closerFactory(id) {
            let me = this;
            let state = {};
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
            let config = [
                {
                    title: 'Normal Window',
                    props: {}
                },
                {
                    title: 'Window with title',
                    props: {
                        title: 'It is a Window with Title'
                    }
                },
                {
                    title: 'Window without close button in title bar',
                    props: {
                        showCloseButton: false
                    }
                },
                {
                    title: 'Window with closing confirm',
                    props: {
                        onBeforeClose: this.confirmClosing
                    }
                },
                {
                    title: 'Window with size',
                    props: {
                        size: {width: 600, height: 300},
                    }
                },
                {
                    title: 'FullScreen TitleWindow',
                    props: {
                        isFullScreen: true
                    }
                }
            ];
            for (let i = 0; i < config.length; i++) {
                config[i].props.isOpen = this.state['window' + (i + 1)],
                config[i].props.onClose = this.closerFactory('window' + (i + 1))
            }
            return (<div>{itemFactory(config, this)}</div>);
        }
    });

    function itemFactory(arr, me) {
        let doms = [];
        let style = {width: 400, height: 300};
        let absStyle = {position: 'absolute', left: 10, right: 10, top: 10, bottom: 10, backgroundColor: 'orange'}
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            doms.push(
                <div className="demo-item" key={i}>
                    <Button label="Open" onClick={me.openWindow} value={'window' + (i + 1)}/>
                    <TitleWindow {...item.props}>
                        <div style={item.props.isFullScreen ? absStyle : style}>
                            {item.title}
                            {
                                item.title === 'Window without close button in title bar'
                                    ? <Button label="close" onClick={me.closerFactory('window' + (i + 1))}/> : null
                            }
                        </div>
                    </TitleWindow>
                </div>
            );
        }
        return doms;
    }

});
