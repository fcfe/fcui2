define(function (require) {

    return {
        version : {
            button: '0.0.2',
            tip: '0.0.2',
            list: '0.0.2',
            dropdownlist: '0.0.2',
            combolist: '0.0.2',
            pager: '0.0.2',
            tab: '0.0.2',
            crumb: '0.0.2',
            wizard: '0.0.2',
            layer: '0.0.2',
            titlewindow: '0.0.2',
            shojiscreen: '0.0.2',
            checkbox: '0.0.2',
            radio: '0.0.2',
            textbox: '0.0.2',
            numberbox: '0.0.2'
        },
        demos: {
            TestBaseLine: require('./demos/BaseLineTesting.jsx'),
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
            'TestBaseLine', '',
            'Tip', 'Button', 'List', 'DropDownList', 'ComboList', 'Pager', 'Tab', 'Crumb', 'Wizard', 'Layer',
            'TitleWindow', 'ShojiScreen', '',

            'Checkbox', 'Radio', 'TextBox', 'NumberBox', 'TextArea', 'Select', 'Calendar', 'DropDownCalendar',
            'RangeCalendar', 'Schedule', 'Region', 'DropDownRegion', 'SearchBox', 'Slider', 'Tree', '',

            'Table', 'Dialog', 'Form', 'DualTreeSelector',
        ]
    };

});
