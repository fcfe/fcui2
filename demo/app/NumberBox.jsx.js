define(function (require) {

    var React = require('react');
    var NumberBox = require('fcui/NumberBox.jsx');

    var items = [
        {
            title: 'Normal NumberBox',
            onChange: true,
            props: {}
        },
        {
            title: 'NumberBox without SpinButton',
            onChange: true,
            props: {showSpinButton: false}
        },
        {
            title: 'Readonly NumberBox',
            onChange: true,
            props: {value: 235}
        },
        {
            title: 'NumberBox can input Integer only',
            onChange: true,
            props: {type: 'int'}
        },
        {
            title: 'NumberBox with Max',
            onChange: true,
            props: {max: 10}
        },
        {
            title: 'NumberBox with Min, and an incorrect Value',
            onChange: true,
            props: {min: 10, value: 1}
        },
        {
            title: 'NumberBox with Step',
            onChange: true,
            props: {min: -100, max: 100, step: 10}
        },
        {
            title: 'NumberBox with Fixed',
            onChange: true,
            props: {fixed: 3, width: 100}
        },
        {
            title: 'NumberBox with ClassName',
            onChange: true,
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Disabled NumberBox',
            onChange: true,
            props: {disabled: true}
        },
        {
            title: 'NumberBox with Width',
            onChange: true,
            props: {width: 500}
        },
        {
            title: 'NumberBox with ValueLinker',
            valueLink: true,
            props: {}
        },
        {
            title: 'Custom Link NumberBox',
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
                    <div><NumberBox {...prop}/></div>
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
            return (<div>{factory(this, items)}</div>);
        }
    });
});
