define(function (require) {


    var React = require('react');
    var Button = require('fcui/Button.jsx');

    var items = [
        {
            title: 'Normal Button',
            props: {label: 'Enter', value: 'enter button'}
        },
        {
            title: 'Submit Button',
            props: {label: 'Submit', type:'submit', name: 'submit1', skin: 'important', value: 'submit button'}
        },
        {
            title: 'Active Button',
            props: {label: 'Active', skin: 'active', value: 'active button'}
        },
        {
            title: 'Disabled Button',
            props: {label: 'Button Disabled', disable: true, value: 'disabled button'}
        },
        {
            title: 'Button With ICON and SKIN',
            props: {label: 'Find', skin:'important', width: 50, icon: 'font-icon-enlarge', value: 'button width icon'}
        },
        {
            title: 'Button With MinWidth',
            props: {label: 'Width', minWidth: 200, value: 'button with minWidth'}
        },
        {
            title: 'Button With MinWidth and Long Label',
            props: {label: 'The minWidth is 100, but the label is very long', minWidth: 100, value: 'button with minWidth 100'}
        },
        {
            title: 'Button Fixed Width',
            props: {label: 'Button Width setted 100', icon: 'font-icon-enlarge', width: 100, value: 'button with width'}
        }  
    ];

    function buttonFactory(me, items) {
        var btns = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var prop = item.props;
            var conf = JSON.stringify(prop);
            prop.onClick = me.clickHandler;
            btns.push(
                <div className="demo-button-item" key={'button' + i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Button {...prop}/>
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
            this.props.alert('Button \'' + e.value + '\' has been clicked!');
        },
        render: function () {
            var containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'Button' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{buttonFactory(this, items)}</div>);
        }
    });
});
