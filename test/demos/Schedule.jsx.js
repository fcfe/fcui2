define(function (require) {

    var React = require('react');
    var Schedule = require('fcui/Schedule.jsx');

    var count = 1;

    function strFactory(l, a) {
        var s = [];
        while (l > 0) {
            if (a === 0) {
                s.push(null);
            }
            else {
                s.push('');
            }
            l--;
        }
        return JSON.stringify(s);
    }

    function strToArray(str) {
        return JSON.stringify(_.map(str.split(''), function (item) {
            if (item === '0') {
                return null;
            }
            else {
                return '';
            }
        }));
    }

    var items = [
        {
            title: 'Normal Schedule',
            onChange: true,
            props: {}
        },
        {
            title: 'Schedule with ClassName',
            onChange: true,
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Readonly Schedule',
            onChange: true,
            props: {value: strToArray('111000000111110001011010000011111110011110001111111111001111')}
        },
        {
            title: 'Readonly Schedule with preset labels',
            onChange: true,
            props: {
                value: strToArray('111000000111110001011010000011111110011110001111111111001111'),
                presetLabels: [{
                    style: {backgroundColor: '#666'},
                    value: strToArray('0000100000000000000000000000')
                }, {
                    style: {backgroundColor: '#666'},
                    value: strToArray('000001000000000000000000000')
                }]
            }
        },
        {
            title: 'Disabled Schedule',
            onChange: true,
            props: {disabled: true, value: strToArray('111000000111110001011010000011111110011110001111111111001111')}
        },
        {
            title: 'Schedule with ShortCut',
            onChange: true,
            props: {
                className: 'border2',
                shortCut: [
                    {
                        label: '全选',
                        getValues: function () {
                            return strFactory(24 * 7, 1);
                        }
                    },
                    {
                        label: '工作日',
                        getValues: function () {
                            return strFactory(24 * 5, 1) + strFactory(24 * 2, 0);
                        }
                    },
                    {
                        label: '休息日',
                        getValues: function () {
                            return strFactory(24 * 5, 0) + strFactory(24 * 2, 1);
                        }
                    }
                ]
            }
        },
        {
            title: 'Schedule with ValueLinker',
            valueLink: true,
            props: {}
        },
        {
            title: 'Custom Link Schedule',
            customLink: true,
            props: {}
        },
        {
            title: 'Schedule 加上行列选择',
            props: {
                enableColumnSelector: true,
                enableRowSelector: true
            }
        },
        {
            title: 'Schedule 定制选择',
            props: {
                onScheduleSelected: function (e, startHour, endHour, startWeekday, endWeekday, cursorDom) {
                    e.target.value = JSON.stringify(
                        _.map(JSON.parse(e.target.value), function (item) {
                            if (item == '') {
                                return count + '';
                            }
                            else {
                                return item;
                            }
                        })
                    );
                    count++;
                }
            }
        },
        {
            title: 'Schedule 定制title layer',
            props: {
                titleLayerRenderer: function (props) {
                    let scheduleTools = require('fcui/core/scheduleTools');
                    let cAxis = scheduleTools.gridAxis(props.mouseCurrentX, props.mouseCurrentY);
                    let parsedValue = scheduleTools.parseValue(props.value);
                    let labels = scheduleTools.value2label(parsedValue[cAxis.y]);
                    let hoverLabel = scheduleTools.getLabelByIndex(cAxis.x, labels);
                    console.log(labels, cAxis, hoverLabel);
                    if (hoverLabel == null) {
                        return null;
                    }
                    else {
                        let pos = {
                            width: 210,
                            height: 30,
                            left: -200,
                            top: -200
                        };
                        let style = scheduleTools.titleLayerSize(
                            cAxis,
                            hoverLabel != null && (props.mouseDownX > -1 || props.mouseCurrentX < 0),
                            pos);
                        let text = scheduleTools.value2text(hoverLabel.begin, hoverLabel.end, cAxis.y) + '， 自定义显示';
                        return (
                            <div className="title-layer" style={style}>
                                <div>{text}</div>
                            </div>
                        );
                    }
                }
            }
        },
        {
            title: 'Schedule 有图例',
            props: {
                infoText: '时段赛高',
                isShowLegend: true,
                presetLabels: [{
                    style: {backgroundColor: '#666'},
                    value: strToArray('0000000000000000000000000000111111111111111111111111111111111'),
                    name: '推荐'
                }, {
                    style: {backgroundColor: '#999'},
                    value: strToArray('1111110000000000000000000000000000000000000000000000000000000'),
                    name: '吐血推荐'
                }]
            }
        }
    ];

    function setter(me, field) {
        return function (e) {
            var obj = {};
            obj[field] = e.target.value;
            me.setState(obj);
        };
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
                    <Schedule {...prop}/>
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
