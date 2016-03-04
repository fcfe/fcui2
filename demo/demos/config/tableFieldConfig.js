define(function (require) {

    return {
        // 这些配置最终会下放到每个单元格的渲染器
        normalName: {
            label: '姓名',
            field: 'name',
            width: 100
        },
        normalAge: {
            label: '年龄',
            field: 'age',
            width: 100
        },
        normalBirth: {
            label: '日期',
            field: 'birth'
        },
        tipName: {
            label: '姓名',
            field: 'name',
            width: 100,
            tip: {title: 'It is tip\'s title', content: 'blablablabla'}
        },
        tipAge: {
            label: '年龄',
            field: 'age',
            width: 100,
            tip: {title: 'It is tip\'s title', content: 'blablablabla', icon: 'font-icon-warning'}
        },
        tipBirth: {
            label: '日期',
            field: 'birth',
            tip: {title: 'It is tip\'s title', content: '<img width="300px" src="https://www.baidu.com/img/bd_logo1.png"/>'}
        },
        styleName: {
            label: '姓名',
            field: 'name',
            width: 100,
            align: 'center',
            prepare: function (props, item, row, column) {
                if (row === 1) {
                    props.style = {
                        backgroundColor: 'green',
                        color: 'white'
                    }
                }
            }
        },
        styleAge: {
            label: '年龄',
            field: 'age',
            width: 100,
            color: '#F00',
            prepare: function (props, item, row, column) {
                if (item.name === 'Brian Li') {
                    props.style = {
                        textAlign: 'center'
                    }
                }
            }
        },
        styleBirth: {
            label: '日期',
            field: 'birth',
            width: 100,
            align: 'right',
            prepare: function (props, item, row, column) {
                if (item.name === 'Jim Jerrly') {
                    props.style = {
                        color: 'red'
                    }
                }
            }
        }
    };
/*
        {
            label: '',
            field: 'name',
            icon: 'font-icon-flag',
            iconStyle: {
                color: 'grey',
                marginRight: 5,
                position: 'relative',
                top: 5
            },
            width: 200,
            renderer: require('fcui/tableRenderer/EditorRenderer.jsx')
        },
        
        ,
        {
            label: '年龄',
            field: 'age',
            width: 60, 
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
    */
});
