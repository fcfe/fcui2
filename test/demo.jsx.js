define(function (require) {


    var React = require('react');

    var Demos = {
        Button : require('./demos/Button.jsx'), 
        TextBox : require('./demos/TextBox.jsx'),
        NumberBox : require('./demos/NumberBox.jsx'),
        Select : require('./demos/Select.jsx'),
        List : require('./demos/List.jsx'),
        TextArea : require('./demos/TextArea.jsx'),
        Pager : require('./demos/Pager.jsx'),
        Tip : require('./demos/Tip.jsx'),
        DropDownList : require('./demos/DropDownList.jsx'),
        ComboList : require('./demos/ComboList.jsx'),
        Table : require('./demos/Table.jsx'),
        Dialog : require('./demos/Dialog.jsx'),
        Form : require('./demos/Form.jsx'),
        Checkbox : require('./demos/CheckBox.jsx'),
        Radio : require('./demos/Radio.jsx'),
        Calendar : require('./demos/Calendar.jsx'),
        DropDownCalendar : require('./demos/DropDownCalendar.jsx'),
        RangeCalendar : require('./demos/RangeCalendar.jsx'),
        Schedule : require('./demos/Schedule.jsx'),
        DropDownSchedule : require('./demos/DropDownSchedule.jsx'),
        Region : require('./demos/Region.jsx'),
        DropDownRegion : require('./demos/DropDownRegion.jsx'),
        Tab : require('./demos/Tab.jsx'),
        SearchBox : require('./demos/SearchBox.jsx'),
        Wizard : require('./demos/Wizard.jsx'),
        Slider : require('./demos/Slider.jsx'),
        Crumb : require('./demos/Crumb.jsx'),
        Tree : require('./demos/Tree.jsx'),
        DualTreeSelector : require('./demos/DualTreeSelector.jsx'),
        Layer : require('./demos/Layer.jsx')
    };

    var DemoList = [
        'Tip', 'Button', 'List', 'DropDownList', 'ComboList', 'Pager', 'Tab', 'Crumb', 'Wizard', 'Layer', '',

        'Checkbox', 'Radio', 'TextBox', 'NumberBox', 'TextArea', 'Select', 'Calendar', 'DropDownCalendar',
        'RangeCalendar', 'Schedule', 'DropDownSchedule', 'Region', 'DropDownRegion', 'SearchBox', 'Slider', '',

        'Table', 'Dialog', 'Form', 'Tree', 'DualTreeSelector',
    ];

    


    var ListItem = React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                demo: '',
                label: 'Item',
                onClick: function () {}
            };
        },
        clickHandler: function () {
            this.props.onClick(this.props.label);
        },
        render: function () {
            var prop = {
                className: 'list-item' + (this.props.demo === this.props.label ? ' list-item-selectd' : ''),
                onClick: this.clickHandler
            };
            return <div {...prop}>{this.props.label}</div>;
        }
    });


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                demo: 'Layer',
                title: 'FCUI v2.0.1',
                dispatch: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                message: ''
            };
        },
        changeDemo: function (demo) {
            if (demo === this.props.demo) return;
            this.props.dispatch('changeHash', {demo: demo});
        },
        changeMessage: function (str) {
            this.setState({message: str})
        },
        listFactory: function (item) {
            if (item === '') {
                return (<hr key={Math.random()}/>);
            }
            return (<ListItem demo={this.props.demo} label={item} onClick={this.changeDemo} key={item}/>);
        },
        render: function () {
            var Demo = Demos[this.props.demo] || Demos['Button'];
            return (
                <div>
                    <div className="logo">{this.props.title}</div>
                    <div className="left-container">
                        {DemoList.map(this.listFactory)}
                    </div>
                    <div className="right-top-container">{this.state.message}</div>
                    <div className="right-middle-container">
                        <Demo alert={this.changeMessage}/>
                    </div>
                    <div className="right-bottom-container" style={{display: 'none'}}></div>
                </div>
            );
        }
    });
});
