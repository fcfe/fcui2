define(function (require) {

    var React = require('react');
    var Radio = require('fcui/Radio.jsx');

    var items = [
        {
            title: 'Normal Radio',
            onChange: true,
            props: {}
        },
        {
            title: 'Radio with ClassName',
            onChange: true,
            props: {label: '请选择：', className: 'marginLeft100 border2'}
        },
        {
            title: 'Radio with Label',
            onChange: true,
            props: {label: '请选择：'}
        },
        {
            title: 'Radio with right Label',
            onChange: true,
            props: {label: '这是啥', labelPosition: 'right'}
        },
        {
            title: 'Disabled Radio',
            onChange: true,
            props: {disabled: true, label: '请选择'}
        },
        {
            title: 'Readonly Radio',
            onChange: true,
            props: {checked: false}
        },
        {
            title: 'Radio with ValueLink',
            valueLink: true,
            props: {}
        }
    ];

    function setter(me, field) {
        return function (e) {
            var obj = {};
            obj[field] = e.target.checked + '';
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
            prop.name = 'demo-radio';
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Radio {...prop}/>
                    <span>{me.state[item.title] === undefined ? '' : me.state[item.title] + ''}</span>
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
            this.props.alert(e.target.value+ '');
        },
        render: function () {
            return (<div>{factory(this, items)}</div>);
        }
    });
});
