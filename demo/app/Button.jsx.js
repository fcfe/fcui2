define(function (require) {


    var React = require('react');
    var Button = require('fcui/Button.jsx');


    var items = [
        {
            title: 'Normal Button',
            props: {label: '确定', value: 'enter button'}
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
            props: {label: 'Button Disabled', disabled: true, value: 'disabled button'}
        },
        {
            title: 'Button with Icon and Skin',
            props: {label: 'Find', skin:'important', icon: 'font-icon-enlarge', value: 'button width icon'}
        },
        {
            title: 'Button with Style',
            props: {label: 'Width', style: {width: 300}, value: 'button with minWidth'}
        },
        {
            title: 'Button with Width',
            props: {width: 200}
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
                alert: function () {}
            };
        },
        clickHandler: function (e) {
            this.props.alert(e.target.value);
        },
        render: function () {
            return (<div>{factory(this, items)}</div>);
        }
    });
});
