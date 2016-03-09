define(function (require) {

    var React = require('react');
    var List = require('fcui/List.jsx');

    var items = [
        {
            title: 'Normal List',
            props: {
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'Disabled List',
            props: {
                disable: true,
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2'},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'List with Disabled Item',
            props: {
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4'},
                    {label: 'option5', value: 'option5'}
                ]
            }
        },
        {
            title: 'List with Multilevel',
            props: {
                width: 200,
                datasource: [
                    {label: 'option1', value: 'option1'},
                    {label: 'option2', value: 'option2', disable: true},
                    {label: 'option3', value: 'option3'},
                    {label: 'option4', value: 'option4', children: [
                        {label: 'option11', value: 'option11'},
                        {label: 'option12', value: 'option12', disable: true},
                        {label: 'option13', value: 'option13', children: [
                            {label: 'option131', value: 'option131'},
                            {label: 'option132', value: 'option132'},
                            {label: 'option133', value: 'option133'},
                            {label: 'option134', value: 'option134'}
                        ]},
                    ]},
                    {label: 'option5', value: 'option5'}
                ]
            }
        }
    ];

    function factory(me, items) {
        var widgets = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var prop = item.props;
            var conf = JSON.stringify(prop);
            prop.onClick = me.changeHandler;
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <div style={{width: (isNaN(item.props.width) ? undefined : item.props.width),border: '1px solid #000'}}>
                        <List {...prop}/>
                    </div>
                    <span>{me.state[item.title]}</span>
                </div>
            );
        }
        return widgets;
    }


    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        // @override
        getDefaultProps: function () {
            return {
                demo: 'List',
                alert: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        changeHandler: function (e) {
            this.props.alert(e.target.value);
        },
        render: function () {
            var containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'List' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
