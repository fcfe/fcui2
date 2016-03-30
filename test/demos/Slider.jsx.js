define(function (require) {

    var React = require('react');
    var Slider = require('fcui/Slider.jsx');

    var items = [
        {
            title: 'Normal Slider',
            onChange: true,
            props: {}
        },
        {
            title: 'Slider with ShowLabel',
            onChange: true,
            props: {showLabel: true}
        },
        {
            title: 'Slider with Measure',
            onChange: true,
            props: {showLabel: true, measure: 'kg'}
        },
        {
            title: 'Readonly Slider',
            onChange: true,
            props: {value: 50}
        },
        {
            title: 'Slider with Float Value',
            onChange: true,
            props: {type: 'float'}
        },
        {
            title: 'Slider with Max',
            onChange: true,
            props: {max: 10, type: 'float', step: '0.1'}
        },
        {
            title: 'Slider with Min, and an incorrect Value',
            onChange: true,
            props: {min: 10, value: 1}
        },
        {
            title: 'Slider with Fixed',
            onChange: true,
            props: {fixed: 1, width: 100, type: 'float'}
        },
        {
            title: 'Slider with ClassName',
            onChange: true,
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Disabled Slider',
            onChange: true,
            props: {disabled: true}
        },
        {
            title: 'Slider with Width',
            onChange: true,
            props: {width: 500}
        },
        {
            title: 'Slider with ValueLinker',
            valueLink: true,
            props: {}
        },
        {
            title: 'Custom Link Slider',
            customLink: true,
            props: {}
        }
    ];

    function setter(me, field) {
        return function (e) {
            var obj = {};
            obj[field] = e.target.value;
            me.setState(obj);
        }
    }

    function factory(me, items) {
        var widgets = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var prop = item.props;
            var conf = JSON.stringify(prop);
            if (item.onChange) prop.onChange = me.changeHandler;
            if (item.valueLink) {
                prop.valueLink = me.linkState(item.title);
                conf = '{valueLink: this.linkState(\'message\')}';
            }
            if (item.customLink) {
                prop.value = me.state[item.title];
                prop.onChange = setter(me, item.title);
                conf = '{value: this.state.message, onChange: this.changeHandler}';
            }
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Slider {...prop}/>
                    <span>{me.state[item.title]}</span>
                </div>
            );
        }
        return widgets;
    }


    return React.createClass({
        mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
        // @override
        getDefaultProps: function () {
            return {
                demo: 'Slider',
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
                    display: this.props.demo === 'Slider' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
