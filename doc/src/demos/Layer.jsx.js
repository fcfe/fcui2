/**
 * @file 弹出层，下拉层demo
 * @author Han Bing Feng
 */

define(function (require) {


    let React = require('react');
    let Button = require('fcui2/Button.jsx');
    let Layer = require('fcui2/Layer.jsx');


    return React.createClass({
        getInitialState() {
            return {};
        },
        // 大闭包工厂
        layerHandlerFactory(id, isopen) {
            let me = this;
            return function () {
                let obj = {};
                obj[id] = isopen;
                me.setState(obj);
            };
        },
        render() {
            let config = [
                {
                    title: 'Normal Layer',
                    props: {
                        skin: 'oneux3-normal'
                    }
                },
                {
                    title: 'Layer with ClassName',
                    props: {
                        skin: 'oneux3-blue',
                        className: 'border2'
                    }
                },
                {
                    title: 'Layer width Location',
                    props: {
                        skin: 'oneux3-yellow',
                        location: '4'
                    }
                },
                {
                    title: 'Layer that can be closed by window click event',
                    props: {
                        skin: 'oneux3-normal',
                        closeWithBodyClick: true,
                        onCloseByWindow: this.layerHandlerFactory('layer3', false)
                    }
                },
                {
                    title: 'Layer that can be located manully',
                    props: {
                        skin: 'oneux3-red',
                        onOffset(result) {
                            result.top += 10;
                            result.left -= 30;
                        }
                    }
                }
            ];
            for (let i = 0; i < config.length; i++) {
                config[i].props.isOpen = this.state['layer' + i]
            }
            return (<div>{itemFactory(config, this)}</div>);
        }
    });


    function itemFactory(arr, me) {
        let doms = [];
        for (let i = 0; i < arr.length; i++) {
            let title = arr[i].title;
            let props = arr[i].props;
            let openProp = {
                label: 'open',
                onClick: me.layerHandlerFactory('layer' + i, true)
            };
            let closeProp = {
                label: 'close',
                onClick: me.layerHandlerFactory('layer' + i, false)
            };
            let anchorProp = {
                ref: 'anchor' + i,
                className: 'anchor'
            };
            doms.push(
                <div className="demo-item" key={i}>
                    <Button {...openProp}/>
                    <Button {...closeProp}/>
                    <span {...anchorProp}>{'Anchor' + i}</span>
                    <Layer {...props} anchor={me.refs ? me.refs['anchor' + i]: null}>
                        <div style={{height: 200, width: 200}}>{'Layer' + i}</div>
                    </Layer>
                </div>
            );
        }
        return doms;
    }

});
