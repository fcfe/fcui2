define(function (require) {


    var React = require('react');
    var Button = require('fcui/Button.jsx');

    var items = [
        {
            title: 'Normal Button',
            props: {label: 'Enter', value: 'enter button'}
        },
        {
            title: 'Button with Title',
            props: {label: 'Button', value: 'title button', title: 'Button With Title'}
        },
        {
            title: 'Button with ClassName',
            props: {label: 'Button', value: 'class button', className: 'marginLeft100 border2'}
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
            title: 'Button with Icon and Skin',
            props: {label: 'Find', skin:'important', width: 50, icon: 'font-icon-enlarge', value: 'button width icon'}
        },
        {
            title: 'Button with MinWidth',
            props: {label: 'Width', minWidth: 200, value: 'button with minWidth'}
        },
        {
            title: 'Button with MinWidth and a Long Label',
            props: {label: 'The minWidth is 100, but the label is very long', minWidth: 100, value: 'button with minWidth 100'}
        },
        {
            title: 'Button with Width',
            props: {label: 'Button Width setted 100', icon: 'font-icon-enlarge', width: 100, value: 'button with width'}
        }  
    ];

    function factory(me, items) {
        var widgets = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var prop = item.props;
            var conf = JSON.stringify(prop);
            prop.onClick = me.clickHandler;
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Button {...prop}/>
                </div>
            );
        }
        return widgets;
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
            this.props.alert(e.target.value);
        },
        render: function () {
            var containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'Button' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
