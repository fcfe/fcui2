define(function (require) {

    var React = require('react');
    var Crumb = require('fcui/Crumb.jsx');

    var items = [
        {
            title: 'Normal Crumb',
            props: {
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', target: "_blank"},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
                ]
            }
        },
        {
            title: 'Disabled Crumb',
            props: {
                disabled: true,
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', target: "_blank"},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
                ]
            }
        },
        {
            title: 'Crumb with Disabled Item',
            props: {
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', disabled: true},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
                ]
            }
        },
        {
            title: 'Crumb with ClassName',
            props: {
                className: 'border2',
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', disabled: true},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
                ]
            }
        },
        {
            title: 'Crumb with Separator',
            props: {
                separator: '|',
                datasource: [
                    {label: 'option1', href: 'option1', target: "_blank"},
                    {label: 'option2', href: 'option2', disabled: true},
                    {label: 'option3', href: 'option3', target: "_blank"},
                    {label: 'option4', href: 'option4', target: "_blank"},
                    {label: 'option5', href: 'option5', target: "_blank"}
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
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Crumb {...prop}/>
                    <span>{me.state[item.title]}</span>
                </div>
            );
        }
        return widgets;
    }


    return React.createClass({
        mixins: [React.addons.PureRenderMixin],
        // @override
        getDefaultProps: function () {
            return {
                demo: 'Crumb',
                alert: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            var containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'Crumb' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
