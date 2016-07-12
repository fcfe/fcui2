/**
 * @file Specs for Table
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {

    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Table = require('Table.jsx');

    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    let  datasource = [
        {name: 'Brian Li', age: 18, birth: '1900-10-1'},
        {name: 'Tom Chros', age: 18, birth: '1900-10-1'},
        {name: 'Jim Jerrly', age: 18, birth: '1900-10-1'}
    ];

    let fieldConfig = {
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
            tip: {title: 'It is tip\'s title', content: '<img width="300px" src="https://www.baidu.com/img/bd_logo1.png"/>'}
        },
        tipAge: {
            label: '年龄',
            field: 'age',
            width: 100,
            tip: {title: 'It is tip\'s title', content: '<img width="300px" src="https://www.baidu.com/img/bd_logo1.png"/>', icon: 'font-icon-warning'}
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
            renderer: require('components/table/NumberRenderer.jsx'),
            prepare: function (props, item) {
                props.content = item.age;
            }
        },
        buttonField: {
            label: '呼叫',
            field: 'birth',
            width: 150,
            content: '-',
            sortDisable: true,
            renderer: require('components/table/ButtonRenderer.jsx'),
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

    describe('Table', () => {

        describe('Base Testing', () => {

            it('Normal Table', () => {
                let dom = realRender(Table, {
                    datasource: datasource,
                    fieldConfig: [
                        fieldConfig.normalName,
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ]
                });
                expect(dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes.length).toBe(3);
                expect(dom.refs.container.childNodes[1].childNodes[0].childNodes[1].childNodes.length).toBe(3);
                let element1 = React.createElement(Table, {
                    datasource: datasource,
                    fieldConfig: [
                        fieldConfig.normalName,
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ]
                });
                ReactDOM.render(element1, dom.refs.container.parentNode);
                ReactDOM.unmountComponentAtNode(dom.refs.container.parentNode);
                expect(dom.refs.container).toBe();
            });

            it('Summary and Header', () => {
                let dom = realRender(Table, {
                    flags: {
                        showHeader: true,
                        showSummary: true
                    },
                    summarg: {
                        name: '-',
                        age: '-',
                        birth: '-'
                    },
                    datasource: datasource,
                    fieldConfig: [
                        fieldConfig.normalName,
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ]
                });
                expect(dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes.length).toBe(5);
                expect(dom.refs.container.childNodes[1].childNodes[0].childNodes[1].childNodes.length).toBe(5);
            });

            it('message', () => {
                let actionType = '';
                let dom = realRender(Table, {
                    flags: {
                        showHeader: true,
                        showMessage: true
                    },
                    message: {
                        content: '这是一条信息',
                        buttonLabel: '知道了'
                    },
                    datasource: datasource,
                    fieldConfig: [
                        fieldConfig.normalName,
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ],
                    onAction(e) {
                        actionType = e;
                    }
                });
                expect(dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes.length).toBe(5);
                expect(dom.refs.container.childNodes[1].childNodes[0].childNodes[1].childNodes.length).toBe(5);
                let msgBar = dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes[1];
                expect(msgBar.childNodes.length).toBe(1);
                expect(msgBar.childNodes[0].childNodes[0].innerHTML).toBe('这是一条信息');
                TestUtils.Simulate.click(msgBar.childNodes[0].childNodes[1]);
                expect(actionType).toBe('TableMessageBarClick');
            });

            it('no data', () => {
                let dom = realRender(Table, {
                    fieldConfig: [
                        fieldConfig.normalName,
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ]
                });
                expect(dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes.length).toBe(1);
                expect(dom.refs.container.childNodes[1].childNodes[0].childNodes[1].childNodes.length).toBe(1);
            });

            it('no fieldConfig', () => {
                let dom = realRender(Table, {});
                expect(dom.refs.container).toBe();
            });

            it('selector', () => {
                let value = '';
                let dom = realRender(Table, {
                    flags: {
                        showHeader: true,
                        showSelector: '1'
                    },
                    datasource: datasource,
                    fieldConfig: [
                        fieldConfig.normalName,
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ],
                    onChange(e) {
                        value = JSON.parse(e.target.value).selected;
                    }
                });
                expect(dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes.length).toBe(4);
                expect(dom.refs.container.childNodes[1].childNodes[0].childNodes[1].childNodes.length).toBe(4);
                let tr1 = dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes[1];
                expect(tr1.childNodes.length).toBe(4);
                expect(tr1.childNodes[0].childNodes[0].className).toBe('fcui2-checkbox fcui2-checkbox-normal');
                expect(tr1.childNodes[0].childNodes[0].childNodes[0].type).toBe('checkbox');
                let target = tr1.childNodes[0].childNodes[0].childNodes[0];
                target.checked = true;
                TestUtils.Simulate.change(tr1.childNodes[0].childNodes[0].childNodes[0], {
                    target: target
                });
                expect(value.join(',')).toBe('0');

                let selector = dom.refs.container.childNodes[0].childNodes[0].childNodes[1]
                    .childNodes[0].childNodes[0].childNodes[0];
                TestUtils.Simulate.click(selector.childNodes[1]);
                expect(value.join(',')).toBe('0,1,2');

                let element1 = React.createElement(Table, {
                    flags: {
                        showHeader: true,
                        showSelector: '2'
                    },
                    datasource: datasource,
                    fieldConfig: [
                        fieldConfig.normalName,
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ],
                    onChange(e) {
                        value = JSON.parse(e.target.value).selected;
                    }
                });
                ReactDOM.render(element1, dom.refs.container.parentNode);
                selector = dom.refs.container.childNodes[0].childNodes[0].childNodes[1]
                    .childNodes[0].childNodes[0].childNodes[0];
                expect(selector.className).toBe('td-selector');
                expect(selector.type).toBe('checkbox');
                TestUtils.Simulate.click(selector);
                expect(value.join(',')).toBe('');
                TestUtils.Simulate.click(selector);
                expect(value.join(',')).toBe('0,1,2');
            });

            it('sorter', () => {
                let value = '';
                let dom = realRender(Table, {
                    flags: {
                        showHeader: true,
                        sortEnable: true
                    },
                    value: JSON.stringify({}),
                    datasource: datasource,
                    fieldConfig: [
                        _.extend({}, fieldConfig.normalName, {sortDisable: true}),
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ],
                    onChange(e) {
                        var obj = JSON.parse(e.target.value)
                        value = obj.sortField + ';' + obj.sortType;
                    }
                });
                let header = dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
                expect(header.childNodes[0].childNodes[2].style.display).toBe('none');
                expect(header.childNodes[1].childNodes[2].style.display).toBe('inline-block');
                expect(header.childNodes[1].childNodes[2].className.indexOf('arrow-down') > -1).toBe(true);
                expect(header.childNodes[1].childNodes[2].className.indexOf('arrow-up') > -1).toBe(false);
                expect(header.childNodes[2].childNodes[2].className.indexOf('arrow-down') > -1).toBe(true);
                TestUtils.Simulate.click(header.childNodes[1].childNodes[2]);
                expect(value).toBe('age;desc');
                TestUtils.Simulate.click(header.childNodes[2].childNodes[2]);
                expect(value).toBe('birth;desc');
                let element1 = React.createElement(Table, {
                    flags: {
                        showHeader: true,
                        sortEnable: true
                    },
                    value: JSON.stringify({
                        sortField: 'age',
                        sortType: 'desc'
                    }),
                    datasource: datasource,
                    fieldConfig: [
                        _.extend({}, fieldConfig.normalName, {sortDisable: true}),
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ],
                    onChange(e) {
                        var obj = JSON.parse(e.target.value)
                        value = obj.sortField + ';' + obj.sortType;
                    }
                });
                ReactDOM.render(element1, dom.refs.container.parentNode);
                header = dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
                expect(header.childNodes[0].childNodes[2].style.display).toBe('none');
                expect(header.childNodes[1].childNodes[2].style.display).toBe('inline-block');
                expect(header.childNodes[1].childNodes[2].className.indexOf('arrow-down') > -1).toBe(true);
                expect(header.childNodes[1].childNodes[2].className.indexOf('arrow-up') > -1).toBe(false);
                expect(header.childNodes[2].childNodes[2].className.indexOf('arrow-down') > -1).toBe(true);              
                TestUtils.Simulate.click(header.childNodes[1].childNodes[2]);
                expect(value).toBe('age;asc');
                TestUtils.Simulate.click(header.childNodes[2].childNodes[2]);
                expect(value).toBe('birth;desc');
            });

            it('disabled', () => {
                let value = '';
                let dom = realRender(Table, {
                    flags: {
                        showHeader: true,
                        showSelector: '1'
                    },
                    disabled: true,
                    datasource: datasource,
                    fieldConfig: [
                        fieldConfig.normalName,
                        fieldConfig.normalAge,
                        fieldConfig.normalBirth
                    ],
                    onChange(e) {
                        value = JSON.parse(e.target.value).selected;
                    }
                });
                let tr1 = dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes[1];
                let target = tr1.childNodes[0].childNodes[0].childNodes[0];
                target.checked = true;
                TestUtils.Simulate.change(tr1.childNodes[0].childNodes[0].childNodes[0], {
                    target: target
                });
                expect(value).toBe('');
            });

            it('td renderer', () => {
                let actionType = '';
                let dom = realRender(Table, {
                    datasource: datasource,
                    fieldConfig: [
                        fieldConfig.numberInt,
                        fieldConfig.buttonField,
                        _.extend({}, fieldConfig.buttonField, {align: 'right'}),
                        _.extend({}, fieldConfig.numberInt, {renderType: 'float', fixed: 'a'}),
                        _.extend({}, fieldConfig.numberInt, {renderType: 'int'}),
                        _.extend({}, fieldConfig.numberInt, {renderType: 'percent'}),
                        _.extend({}, fieldConfig.numberInt, {renderType: ''}),
                        _.extend({}, fieldConfig.numberInt, {renderType: '', prepare(item){item.content='a';}})
                    ],
                    onAction(type) {
                        actionType = type;
                    }
                });
                let tr1 = dom.refs.container.childNodes[0].childNodes[0].childNodes[1].childNodes[1];
                expect(tr1.childNodes[1].childNodes[3].className.indexOf('font-icon')).toBe(0);
                TestUtils.Simulate.click(tr1.childNodes[1].childNodes[3]);
                expect(actionType).toBe('ButtonRendererClick');
                expect(tr1.childNodes[3].innerHTML).toBe('18.00');
                expect(tr1.childNodes[4].innerHTML).toBe('18');
                expect(tr1.childNodes[5].innerHTML).toBe('1800.00%');
                expect(tr1.childNodes[6].innerHTML).toBe('18');
                expect(tr1.childNodes[7].innerHTML).toBe('-');
            });
        });

    });
});
