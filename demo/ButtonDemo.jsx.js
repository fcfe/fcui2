define(function (require) {


    var React = require('react');
    var Button = require('fcui/Button.jsx');
    var Dialog = require('fcui/Dialog.jsx');
    var dialog = new Dialog();

    var props = [
        {label: 'Enter', value: 'enter button'},
        {label: 'Submit', skin: 'important', value: 'submit button'},
        {label: 'Button Disabled', disable: true, value: 'disabled button'},
        {label: 'Find', icon: 'font-icon-enlarge', value: 'button width icon'},
        {label: 'Width', minWidth: 200, value: 'button with minWidth'},
        {label: 'Button Width Max Width 100', icon: 'font-icon-enlarge', width: 100, value: 'button with maxWidth'}
    ];

    function buttonFactory(me, props) {
        var btns = [];
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            var conf = JSON.stringify(prop);
            prop.onClick = me.clickHandler;
            btns.push(
                <div className="demo-button-item" key={'button' + i}>
                    <input type="button" style={{height: 30}} value="asdasd"/>
                    <Button {...prop}/>
                    <span>{conf}</span>
                </div>
            );
        }
        return btns;
    }

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                demo: 'Button',
                alert: function () {}
            };
        },
        clickHandler: function (e) {
            dialog.alert({message: 'abc'});
            this.props.alert('Button \'' + e.value + '\' has been clicked!');
        },
        render: function () {
            var containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'Button' ? 'block' : 'none'
                }
            };
            return (
                <div className="demo-content">{buttonFactory(this, props)}</div>
            );
        }
    });
});
