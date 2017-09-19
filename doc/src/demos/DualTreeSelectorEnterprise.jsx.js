define(function (require) {


    var Creater = require('./Main.jsx');
    var DualTreeSelector = require('fcui2/enterprise/DualTreeSelector.jsx');
    var treeTools = require('fcui2/core/treeTools');
    var React = require('react');


    var datasource = [
        {
            label: 'option1option1option1option1option1option1option1',
            value: 'option1',
            children: [
                {label: 'option1-1', value: 'option1-1'},
                {
                    label: 'option1-2', value: 'option1-2', children: [
                        {label: 'option1-2-1', value: 'option1-2-1'},
                        {label: 'option1-2-2', value: 'option1-2-2'},
                        {label: 'option1-2-3', value: 'option1-2-3'}
                    ]
                },
            ]
        },
        {label: 'option2', value: 'option2'},
        {label: 'option3', value: 'option3'},
        {label: 'option4', value: 'option4'},
        {label: 'option5', value: 'option5'}
    ];
    var items1 = [
        {
            title: 'Normal DualTreeSelector',
            props: {
                datasource: datasource
            }
        }
    ];
    var Example1 = Creater(DualTreeSelector, items1, ['onChange']);


    function getDisplayProps(props) {
        var result = JSON.parse(JSON.stringify(props));
        for (var key in props) {
            if (!props.hasOwnProperty(key)) continue;
            if (typeof props[key] === 'function') {
                result[key] = '[Function]';
            }
        }
        return JSON.stringify(result);
    }


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            var data = JSON.parse(JSON.stringify(datasource));
            data[0].children[1].children[1].children = [];
            data[2].children = [];
            data[3].children = [];
            return {
                asyncDatasource: data,
                asyncValue: '{"selected":{"option2":true}}',
                errorMessage: ''
            };
        },
        onAsyncTreeChange: function (e) {
            this.setState({asyncValue: e.target.value});
            this.props.alert('onChange:' + e.target.value);
        },
        onAsyncTreeAction: function (type, param) {
            if (type !== 'TreeLoadChildren' || !param.index instanceof Array || !param.index.length) return;
            if (this.refs.asyncTree.___loading___) return;
            var me = this;
            var data = JSON.parse(JSON.stringify(this.refs.asyncTree.props.datasource));
            var item = treeTools.getLeafItem(data, param.index);
            item.label = item.label + ' 加载2s';
            this.refs.asyncTree.___loading___ = true;
            this.setState({asyncDatasource: data});
            setTimeout(function () {
                var data = JSON.parse(JSON.stringify(me.refs.asyncTree.props.datasource));
                var item = treeTools.getLeafItem(data, param.index);
                item.label = item.label.replace(' 加载2s', '');
                item.children = [
                    {label: 'new option1', value: 'new option1'},
                    {label: 'new option2', value: 'new option2'},
                    {label: 'new option3', value: 'new option3'},
                ];
                me.refs.asyncTree.___loading___ = false;
                me.setState({asyncDatasource: data});
            }, 1000);
        },
        render: function () {
            var me = this;
            var asyncTreeProp = {
                ref: 'asyncTree',
                isDropDown: true,
                width: 200,
                datasource: this.state.asyncDatasource,
                value: this.state.asyncValue,
                onChange: this.onAsyncTreeChange,
                onAction: this.onAsyncTreeAction,
                labels: {
                    errorMessage: this.state.errorMessage
                },
                onBeforeLayerClose: function (e) {
                    e.returnValue = false;
                    me.setState({
                        errorMessage: '成功'
                    });
                },
                onLayerClose: function (e) {
                    setTimeout(function () {
                        me.setState({
                            errorMessage: ''
                        });
                    }, 100);
                }
            };
            return (
                <div>
                    <Example1 alert={this.props.alert}/>
                    <div className="demo-item">
                        <DualTreeSelector {...asyncTreeProp}/>
                    </div>
                </div>
            );
        }
    });


});
