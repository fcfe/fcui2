define(function (require) {


    var React = require('react');
    var Button = require('fcui/Button.jsx');
    var Information = require('../Information.jsx');
    var Dialog = require('fcui/Dialog.jsx');
    var dialog = new Dialog();



    var SubApp = React.createClass({
        getDefaultProps: function () {
            return {
                message: ''
            };
        },
        render: function () {
            return (
                <div><span>{this.props.message}</span></div>
            );
        }
    });


    var AutoSizeApp = React.createClass({
        timer: null,
        getDefaultProps: function () {
            return {};
        },
        getInitialState: function () {
            return {width: 400, height: 300};
        },
        componentDidUpdate: function () {
            if (!this.props.resize()) {
                clearInterval(this.timer);
            }
        },
        componentWillUnmount: function () {
            clearInterval(this.timer);
        },
        componentDidMount: function () {
            var me = this;
            this.timer = setInterval(function () {
                var width = me.state.width + parseInt((-10 + 20 * Math.random()), 10);
                var height = me.state.height + parseInt((-10 + 20 * Math.random()), 10);
                me.setState({width: width, height: height});
            }, 1000);
        },
        render: function () {
            return (
                <div style={{width: this.state.width, height: this.state.height}}>
                    <h3>width: {this.state.width}</h3>
                    <h3>height: {this.state.height}</h3>
                </div>
            );
        }
    });


    var UpdatePropApp = React.createClass({
        getDefaultProps: function () {
            return {
                text: 'init'
            };
        },
        getInitialState: function () {
            return {};
        },
        render: function () {
            return (
                <div style={{width: 400, height: 300}}>
                    <h3>{'Text From Outsize:' + this.props.text}</h3>
                </div>
            );
        }
    });




    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                alert: function () {}
            };
        },
        componentDidMount: function () {
            this.updateTimer = null;
        },
        componentWillUnmount: function () {
            clearInterval(this.updateTimer);
        },
        update: function () {
            clearInterval(this.updateTimer);
            dialog.pop({
                title: 'Update Content Props after Pop',
                content: UpdatePropApp,
                contentProps: {
                    text: 'Message From Demo.'
                }
            });
            this.updateTimer = setInterval(function () {
                dialog.updatePopContentProps({
                    text: +new Date()
                })
            }, 1000);
        },
        autoResize: function (e) {
            clearInterval(this.updateTimer);
            dialog.pop({
                title: 'Auto Resize Demo',
                content: AutoSizeApp
            });
        },
        subapp: function (e) {
            clearInterval(this.updateTimer);
            var me = this;
            dialog.pop({
                title: 'SubApp Demo',
                content: SubApp,
                contentProps: {
                    message: 'it is subapp\'s content, imported from outside.'
                },
                onClose: function () {
                    me.props.alert('SubApp Demo has been closed!');
                }
            });
        },
        alert: function () {
            clearInterval(this.updateTimer);
            var me = this;
            dialog.alert({
                title: 'Alert Demo',
                message: 'Alert message',
                onClose: function () {
                    me.props.alert('Alert Dialog has been closed!');
                }
            });
        },
        confirm: function () {
            clearInterval(this.updateTimer);
            var me = this;
            dialog.confirm({
                title: 'Confirm Demo',
                message: 'Confirm message',
                onEnter: function () {
                    me.props.alert('You press enter!');
                },
                onCancel: function () {
                    me.props.alert('You press cancel!');
                }
            })
        },
        closeConfirm: function (e) {
            clearInterval(this.updateTimer);
            var me = this;
            dialog.pop({
                title: 'Close Confirm Demo',
                content: SubApp,
                contentProps: {
                    message: 'There is a confirm after you press close button in title bar.'
                },
                onBeforeClose: function (e) {
                    if (!window.confirm('Are you sure to close the dialog?')) {
                        e.returnValue = false;
                        me.props.alert('Closing operation has been canceled.');
                    }
                },
                onClose: function () {
                    me.props.alert('Dialog has been closed!');
                }
            });
        },
        fullscreen: function () {
            var me = this;
            dialog.pop({
                title: 'Fullscreen Dialog',
                content: SubApp,
                isFullScreen: true,
                contentProps: {
                    message: 'it is subapp\'s content, imported from outside.'
                },
                onClose: function () {
                    me.props.alert('Fullscreen Dialog has been closed!');
                }
            });
        },
        size: function () {
            var me = this;
            dialog.pop({
                title: 'Dialog with Size',
                content: SubApp,
                size: {width: 600, height: 300},
                contentProps: {
                    message: 'it is subapp\'s content, imported from outside.'
                },
                onClose: function () {
                    me.props.alert('Dialog with Size has been closed!');
                }
            });
        },
        render: function () {
            var config = [
                {
                    title: 'Alert',
                    onClick: this.alert,
                    content: [
                        '           var Dialog = require(\'fcui/Dialog.jsx\');',
                        '           var dialog = new Dialog();',
                        '           var me = this;',
                        '           dialog.alert({',
                        '               title: \'Alert Demo\',',
                        '               message: \'Alert message\',',
                        '               onClose: function () {',
                        '                   me.props.alert(\'Alert Dialog has been closed!\');',
                        '               }',
                        '           });'
                    ].join('\n')
                },
                {
                    title: 'Confirm',
                    onClick: this.confirm,
                    content: [
                        '           var Dialog = require(\'fcui/Dialog.jsx\');',
                        '           var dialog = new Dialog();',
                        '           var me = this;',
                        '           dialog.confirm({',
                        '               title: \'Confirm Demo\',',
                        '               message: \'Confirm message\',',
                        '               onEnter: function () {',
                        '                   me.props.alert(\'You press enter!\');',
                        '               },',
                        '               onCancel: function () {',
                        '                   me.props.alert(\'You press cancel!\');',
                        '               }',
                        '           })'
                    ].join('\n')
                },
                {
                    title: 'Sub App',
                    onClick: this.subapp,
                    content: [
                        '           var Dialog = require(\'fcui/Dialog.jsx\');',
                        '           var dialog = new Dialog();',
                        '           var me = this;',
                        '           dialog.pop({',
                        '               title: \'SubApp Demo\',',
                        '               content: SubApp,',
                        '               contentProps: {',
                        '                   message: \'it is subapp\'s content, imported from outside.\'',
                        '               },',
                        '               onClose: function () {',
                        '                   me.props.alert(\'SubApp Demo has been closed!\');',
                        '               }',
                        '           });'
                    ].join('\n')
                },
                {
                    title: 'Closing need confirm',
                    onClick: this.closeConfirm,
                    content: [
                        '            var Dialog = require(\'fcui/Dialog.jsx\');',
                        '            var dialog = new Dialog();',
                        '            var me = this;',
                        '            dialog.pop({',
                        '                title: \'Close Confirm Demo\',',
                        '                content: SubApp,',
                        '                contentProps: {',
                        '                    message: \'There is a confirm after you press close button in title bar.\'',
                        '                },',
                        '                onBeforeClose: function (e) {',
                        '                    if (!window.confirm(\'Are you sure to close the dialog?\')) {',
                        '                        e.returnValue = false;',
                        '                        me.props.alert(\'Closing operation has been canceled.\');',
                        '                    }',
                        '                },',
                        '                onClose: function () {',
                        '                    me.props.alert(\'Dialog has been closed!\');',
                        '                }',
                        '            });'
                    ].join('\n')
                },
                {
                    title: 'Auto Resize Dialog',
                    onClick: this.autoResize,
                    content:  [
                        '            var Dialog = require(\'fcui/Dialog.jsx\');',
                        '            var dialog = new Dialog();',
                        '            var AutoSizeApp = React.createClass({',
                        '                timer: null,',
                        '                getDefaultProps: function () {',
                        '                    return {};',
                        '                },',
                        '                getInitialState: function () {',
                        '                    return {width: 400, height: 300};',
                        '                },',
                        '                componentDidUpdate: function () {',
                        '                    if (!this.props.resize()) {',
                        '                        clearInterval(this.timer);',
                        '                    }',
                        '                },',
                        '                componentWillUnmount: function () {',
                        '                    clearInterval(this.timer);',
                        '                },',
                        '                componentDidMount: function () {',
                        '                    var me = this;',
                        '                    this.timer = setInterval(function () {',
                        '                        var width = me.state.width + parseInt((-10 + 20 * Math.random()), 10);',
                        '                        var height = me.state.height + parseInt((-10 + 20 * Math.random()), 10);',
                        '                        me.setState({width: width, height: height});',
                        '                    }, 1000);',
                        '                },',
                        '                render: function () {',
                        '                    return (',
                        '                        <div style={{width: this.state.width, height: this.state.height}}>',
                        '                            <h3>width: {this.state.width}</h3>',
                        '                            <h3>height: {this.state.height}</h3>',
                        '                        </div>',
                        '                    );',
                        '                }',
                        '            });',
                        '            clearInterval(this.updateTimer);',
                        '            dialog.pop({',
                        '                 title: \'Auto Resize Demo\',',
                        '                 content: AutoSizeApp',
                        '            });'
                    ].join('\n')
                },
                {
                    title: 'Update Content Props after Pop',
                    onClick: this.update,
                    content:  [
                        '           var Dialog = require(\'fcui/Dialog.jsx\');',
                        '           var dialog = new Dialog();',
                        '           clearInterval(this.updateTimer);',
                        '           dialog.pop({',
                        '               title: \'Update Content Props after Pop\',',
                        '               content: UpdatePropApp,',
                        '               contentProps: {',
                        '                   text: \'Message From Demo.\'',
                        '               }',
                        '           });',
                        '           this.updateTimer = setInterval(function () {',
                        '               dialog.updatePopContentProps({',
                        '                   text: +new Date()',
                        '               })',
                        '           }, 1000);'
                    ].join('\n')
                },
                {
                    title: 'Fullscreen Dialog',
                    onClick: this.fullscreen,
                    content:  [
                        '           var Dialog = require(\'fcui/Dialog.jsx\');',
                        '           var dialog = new Dialog();',
                        '           dialog.pop({',
                        '               title: \'Fullscreen Dialog\',',
                        '               content: SubApp,',
                        '               isFullScreen: true,',
                        '               contentProps: {',
                        '                   message: \'it is subapp\'s content, imported from outside.\'',
                        '               },',
                        '               onClose: function () {',
                        '                   me.props.alert(\'Fullscreen Dialog has been closed!\');',
                        '               }',
                        '           });'
                    ].join('\n')
                },
                {
                    title: 'Dialog with Size',
                    onClick: this.size,
                    content:  [
                        '           var Dialog = require(\'fcui/Dialog.jsx\');',
                        '           var dialog = new Dialog();',
                        '           dialog.pop({',
                        '               title: \'Dialog with Size\',',
                        '               content: SubApp,',
                        '               size: {width: 600, height: 300},',
                        '               contentProps: {',
                        '                   message: \'it is subapp\'s content, imported from outside.\'',
                        '               },',
                        '               onClose: function () {',
                        '                   me.props.alert(\'Dialog with Size has been closed!\');',
                        '               }',
                        '           });'
                    ].join('\n')
                }
            ];
            return (<div>{itemFactory(config, this)}</div>);
        }
    });


    function itemFactory(arr, me) {
        var doms = [];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            doms.push(
                <div className="demo-item" key={i}>
                    <Information title={item.title} content={item.content}/>
                    <Button label={item.title} onClick={item.onClick}/>
                </div>
            );
        }
        return doms;
    }


});
