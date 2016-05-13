define(function (require) {

    var React = require('react');
    var DropDownRegion = require('fcui/DropDownRegion.jsx');

    var items = [
        {
            title: 'Normal DropDownRegion',
            onChange: true,
            props: {}
        },
        {
            title: 'Single Selection DropDownRegion',
            onChange: true,
            props: {
                type: 'single'
            }
        },
        {
            title: 'Disabled DropDownRegion',
            onChange: true,
            props: {disabled: true}
        },
        {
            title: 'DropDownRegion with ClassName',
            onChange: true,
            props: {className: 'floatRight border2'}
        },
        {
            title: 'Readonly DropDownRegion',
            onChange: true,
            props: {value: '124,16,243,246,249,250,252,253,254,255,256,257,258,261,262,263,266,267,268,760,774,776,901'}
        },
        {
            title: 'DropDownRegion with ValueLinker',
            valueLink: true,
            props: {}
        },
        {
            title: 'Custom Link DropDownRegion',
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
                    <DropDownRegion {...prop}/>
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
