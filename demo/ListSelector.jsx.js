define(function (require) {

    var React = require('react');

    function listFactory(me, className) {
        var datasource = me.props.datasource;
        var selected = me.state.selected;
        var items = [];
        for (var i = 0; i < datasource.length; i++) {
            var item = datasource[i];
            items.push(
                <div key={i} className={'item' + (selected[item.key] ? '' : ' item-notselected')} data-ui-key={item.key}>
                    <span>{item.label}</span>
                    <div onClick={me.add} className={'font-icon font-icon-plus' + (selected[item.key] ? ' disable' : '')}></div>
                    <div onClick={me.del} className="font-icon font-icon-times"></div>
                </div>
            );
        }
        return <div className={className}>{items}</div>
    }

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                datasource: []
            };
        },
        // @override
        getInitialState: function () {
            return {
                selected: {},
                value: []
            };
        },
        add: function (e) {
            var key = e.target.parentNode.dataset.uiKey;
            var selected = this.state.selected;
            selected[key] = true;
            this.sync(selected);
        },
        del: function (e) {
            var key = e.target.parentNode.dataset.uiKey;
            var selected = this.state.selected;
            delete selected[key];
            this.sync(selected);
        },
        sync: function (selected) {
            var value = [];
            for (var key in selected) {value.push(key);}
            this.setState({value: value, selected: selected});
        },
        render: function () {
            return (
                <div className="list-selector">
                    {listFactory(this, 'left-list')}
                    {listFactory(this, 'right-list')}
                </div>
            );
        }
    });
});
