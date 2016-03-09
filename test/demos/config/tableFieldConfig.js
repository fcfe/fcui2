define(function (require) {

    return {
        // 这些配置最终会下放到每个单元格的渲染器
        normalName: {
            label: '姓名',
            sortDisable: true,
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
            sortDisable: true,
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
            sortDisable: true,
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
        },
        numberInt: {
            label: '浮点',
            field: 'birth',
            align: 'right',
            renderType: 'float',
            fixed: 1,
            renderer: require('fcui/components/table/NumberRenderer.jsx'),
            prepare: function (props, item) {
                props.content = item.age;
            }
        },
        optMsg: {
            label: '浮动layer',
            field: 'birth',
            buttonLabel: '好的',
            renderer: require('fcui/components/table/OptRenderer.jsx'),
            prepare: function (props, item) {
                props.style = {color: 'orange'};
            }
        },
        buttonField: {
            label: '呼叫',
            field: 'birth',
            width: 150,
            content: '-',
            sortDisable: true,
            renderer: require('fcui/components/table/ButtonRenderer.jsx'),
            prepare: function (props, item, row, column) {
                if (item.name === 'Tom Chros') {
                    props.buttonIcon = 'font-icon-mobilephone';
                    props.content = '移动在线';
                    props.style = {
                        color: 'green'
                    };
                }
                else if (item.name === 'Brian Li') {
                    props.buttonIcon = 'font-icon-phone';
                    props.content = '固话可用';
                    props.style = {
                        color: 'red'
                    };
                }
            }
        }
    };
});
