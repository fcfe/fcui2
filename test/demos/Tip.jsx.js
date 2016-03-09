define(function (require) {


    var React = require('react');
    var Tip = require('fcui/Tip.jsx');

    var items = [
        {
            title: 'Normal Tip',
            props: {title: 'It is tip\'s title', content: 'blablablabla'}
        },
        {
            title: 'Tip with Icon',
            props: {title: 'It is tip\'s title', content: 'blablablabla', icon: 'font-icon-warning'}
        },
        {
            title: 'Tip with ClassName',
            props: {className: 'colorRed', title: 'It is tip\'s title', content: 'blablablabla'}
        },
        {
            title: 'Tip without Title',
            props: {content: 'blablablabla'}
        },
        {
            title: 'Tip without Content',
            props: {title: 'It is tip\'s title'}
        },
        {
            title: 'Tip with html in Content',
            props: {title: 'It is tip\'s title', content: '<img width="300px" src="https://www.baidu.com/img/bd_logo1.png"/>'}
        },
        {
            title: 'Tip without props',
            props: {}
        }
    ];

    function factory(me, items) {
        var widgets = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var prop = item.props;
            var conf = JSON.stringify(prop);
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Tip {...prop}/>
                </div>
            );
        }
        return widgets;
    }

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                demo: 'Tip',
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
                    display: this.props.demo === 'Tip' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
