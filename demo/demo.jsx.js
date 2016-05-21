define(function (require) {


    var React = require('react');

    var Demos = {
        Button: require('./app/Button.jsx'), 
        TextBox: require('./app/TextBox.jsx'),
        NumberBox: require('./app/NumberBox.jsx'),
        Select: require('./app/Select.jsx'),
        List: require('./app/List.jsx'),
        TextArea: require('./app/TextArea.jsx'),
        Pager: require('./app/Pager.jsx'),
        Tip: require('./app/Tip.jsx'),
        DropDownList: require('./app/DropDownList.jsx'),
        ComboList: require('./app/ComboList.jsx'),
        Table: require('./app/Table.jsx'),
        Dialog: require('./app/Dialog.jsx'),
        Form: require('./app/Form.jsx'),
        Checkbox: require('./app/CheckBox.jsx'),
        Radio: require('./app/Radio.jsx'),
        Calendar: require('./app/Calendar.jsx'),
        DropDownCalendar: require('./app/DropDownCalendar.jsx'),
        RangeCalendar: require('./app/RangeCalendar.jsx'),
        Schedule: require('./app/Schedule.jsx'),
        Region: require('./app/Region.jsx'),
        DropDownRegion: require('./app/DropDownRegion.jsx'),
        Tab: require('./app/Tab.jsx'),
        SearchBox: require('./app/SearchBox.jsx'),
        Wizard: require('./app/Wizard.jsx'),
        Slider: require('./app/Slider.jsx'),
        Crumb: require('./app/Crumb.jsx'),
        Tree: require('./app/Tree.jsx'),
        DualTreeSelector: require('./app/DualTreeSelector.jsx'),
        Layer: require('./app/Layer.jsx'),
        TitleWindow: require('./app/TitleWindow.jsx'),
        ShojiScreen: require('./app/ShojiScreen.jsx')
    };

    var DemoList = [
        'Tip', 'Button', 'List', 'DropDownList', 'ComboList', 'Pager', 'Tab', 'Crumb', 'Wizard', 'Layer',
        'TitleWindow', 'ShojiScreen', '',

        'Checkbox', 'Radio', 'TextBox', 'NumberBox', 'TextArea', 'Select', 'Calendar', 'DropDownCalendar',
        'RangeCalendar', 'Schedule', 'Region', 'DropDownRegion', 'SearchBox', 'Slider', 'Tree', '',

        'Table', 'Dialog', 'Form', 'DualTreeSelector',
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
                title: 'FCUI v2.0.2',
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
