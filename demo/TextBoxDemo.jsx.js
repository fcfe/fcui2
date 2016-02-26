define(function (require) {


    var React = require('react');
    var TextBox = require('fcui/TextBox.jsx');

    var items = [];

    // function buttonFactory(me, items) {
    //     var btns = [];
    //     for (var i = 0; i < items.length; i++) {
    //         var item = items[i];
    //         var prop = item.props;
    //         var conf = JSON.stringify(prop);
    //         prop.onClick = me.clickHandler;
    //         btns.push(
    //             <div className="demo-button-item" key={'button' + i}>
    //                 <h3>{item.title}</h3>
    //                 <div className="props">{conf}</div>
    //                 <Button {...prop}/>
    //             </div>
    //         );
    //     }
    //     return btns;
    // }


    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        // @override
        getDefaultProps: function () {
            return {
                demo: 'TextBox',
                alert: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                message: '',
                message1: ''
            };
        },
        clickHandler: function (e) {
            console.log(e.target.value);
        },
        render: function () {
            var containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'TextBox' ? 'block' : 'none'
                }
            };
            return (
                <div {...containerProp}>
                    <div>{this.state.message}</div>
                    <div>{this.state.message1}</div>
                    <TextBox valueLink={this.linkState('message')}/>
                </div>
            );
        }
    });
});
