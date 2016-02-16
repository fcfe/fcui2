/**
 * @file
 * @author Brian Li(lbxxlht@163.com)
 */

define(function (require) {
    var checker = require('fcui/core/checker');
    return [
        {
            label: '注册',
            field: 'name',
            width: 200,
            renderer: require('fcui/tableRenderer/EditorRenderer.jsx'),
            editorProp: {
                label: '请输入姓名',
                checkout: [
                    checker.minLength(1, '不能为空')
                ]
            }
        },
        {
            label: '姓名',
            field: 'name',
            width: 100, //这一项必须配置，否则table header吸顶时会出现问题
            sortAble: true
        },
        {
            label: '格式姓名',
            field: 'name',
            width: 100, //这一项必须配置，否则table header吸顶时会出现问题
            align: 'center',
            color: '#4593FF',
            sortAble: true
        },
        {
            label: '年龄',
            field: 'age',
            width: 50, //这一项必须配置，否则table header吸顶时会出现问题
            sortAble: true,
            renderer: require('fcui/tableRenderer/NumberRenderer.jsx')
        },
        {
            label: '生日',
            field: 'birth',
            width: 100,
            tipTitle: '为啥要有生日？',
            tipContent: '为啥要有生日这一列其实我也不知道。'
        },
        {
            label: '浮点数字',
            field: 'age',
            width: 100,
            sortAble: true,
            renderType: 'float',
            renderer: require('fcui/tableRenderer/NumberRenderer.jsx')
        },
        {
            label: '百分比',
            field: 'age',
            width: 100,
            sortAble: true,
            renderType: 'percent',
            renderer: require('fcui/tableRenderer/NumberRenderer.jsx')
        },
        {
            label: '行内按钮',
            field: 'name',
            width: 100,
            button: 'font-icon-edit',
            renderer: require('fcui/tableRenderer/ButtonRenderer.jsx'),
            content: function (a) {
                return a.indexOf('啥') > 0 ? '关闭' : '开启';
            }
        },
        {
            label: '注意',
            field: 'name',
            width: 50,
            renderer: require('fcui/tableRenderer/OptRenderer.jsx'),
            buttonLabel: '确定',
            color: function (v) {
                return Math.random() > 0.7 ? 'red' : 'orange';
            },
            content: function (v) {
                return v.name;
            }
        }
    ];
});
