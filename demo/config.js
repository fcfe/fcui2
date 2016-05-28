define(function (require) {

    return {
        version : {
            button: '0.0.2',
            tip: '0.0.2'
        },
        demos: {
            Button: require('./demos/Button.jsx'), 
            TextBox: require('./demos/TextBox.jsx'),
            NumberBox: require('./demos/NumberBox.jsx'),
            Select: require('./demos/Select.jsx'),
            List: require('./demos/List.jsx'),
            TextArea: require('./demos/TextArea.jsx'),
            Pager: require('./demos/Pager.jsx'),
            Tip: require('./demos/Tip.jsx'),
            DropDownList: require('./demos/DropDownList.jsx'),
            ComboList: require('./demos/ComboList.jsx'),
            Table: require('./demos/Table.jsx'),
            Dialog: require('./demos/Dialog.jsx'),
            Form: require('./demos/Form.jsx'),
            Checkbox: require('./demos/CheckBox.jsx'),
            Radio: require('./demos/Radio.jsx'),
            Calendar: require('./demos/Calendar.jsx'),
            DropDownCalendar: require('./demos/DropDownCalendar.jsx'),
            RangeCalendar: require('./demos/RangeCalendar.jsx'),
            Schedule: require('./demos/Schedule.jsx'),
            Region: require('./demos/Region.jsx'),
            DropDownRegion: require('./demos/DropDownRegion.jsx'),
            Tab: require('./demos/Tab.jsx'),
            SearchBox: require('./demos/SearchBox.jsx'),
            Wizard: require('./demos/Wizard.jsx'),
            Slider: require('./demos/Slider.jsx'),
            Crumb: require('./demos/Crumb.jsx'),
            Tree: require('./demos/Tree.jsx'),
            DualTreeSelector: require('./demos/DualTreeSelector.jsx'),
            Layer: require('./demos/Layer.jsx'),
            TitleWindow: require('./demos/TitleWindow.jsx'),
            ShojiScreen: require('./demos/ShojiScreen.jsx')
        },
        list: [
            'Tip', 'Button', 'List', 'DropDownList', 'ComboList', 'Pager', 'Tab', 'Crumb', 'Wizard', 'Layer',
            'TitleWindow', 'ShojiScreen', '',

            'Checkbox', 'Radio', 'TextBox', 'NumberBox', 'TextArea', 'Select', 'Calendar', 'DropDownCalendar',
            'RangeCalendar', 'Schedule', 'Region', 'DropDownRegion', 'SearchBox', 'Slider', 'Tree', '',

            'Table', 'Dialog', 'Form', 'DualTreeSelector',
        ]
    };

});
