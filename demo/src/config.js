define(function (require) {

    return {
        version : {
        },
        demos: {
            TestBaseLine: require('../demos/BaseLineTesting.jsx'),
            TestFormField: require('../demos/FormFieldTesting.jsx'),
            Button: require('../demos/Button.jsx'), 
            TextBox: require('../demos/TextBox.jsx'),
            NumberBox: require('../demos/NumberBox.jsx'),
            Select: require('../demos/Select.jsx'),
            List: require('../demos/List.jsx'),
            TextArea: require('../demos/TextArea.jsx'),
            Pager: require('../demos/Pager.jsx'),
            Tip: require('../demos/Tip.jsx'),
            DropDownList: require('../demos/DropDownList.jsx'),
            ComboList: require('../demos/ComboList.jsx'),
            Table: require('../demos/Table.jsx'),
            Dialog: require('../demos/Dialog.jsx'),
            Form: require('../demos/Form.jsx'),
            Checkbox: require('../demos/CheckBox.jsx'),
            Radio: require('../demos/Radio.jsx'),
            Calendar: require('../demos/Calendar.jsx'),
            DropDownCalendar: require('../demos/DropDownCalendar.jsx'),
            RangeCalendar: require('../demos/RangeCalendar.jsx'),
            Schedule: require('../demos/Schedule.jsx'),
            Region: require('../demos/Region.jsx'),
            DropDownRegion: require('../demos/DropDownRegion.jsx'),
            Tab: require('../demos/Tab.jsx'),
            SearchBox: require('../demos/SearchBox.jsx'),
            Wizard: require('../demos/Wizard.jsx'),
            Slider: require('../demos/Slider.jsx'),
            Crumb: require('../demos/Crumb.jsx'),
            Tree: require('../demos/Tree.jsx'),
            DualTreeSelector: require('../demos/DualTreeSelector.jsx'),
            Layer: require('../demos/Layer.jsx'),
            TitleWindow: require('../demos/TitleWindow.jsx'),
            ShojiScreen: require('../demos/ShojiScreen.jsx'),
            'Tree-Test': require('../demos/TreeTest.jsx'),
            'DualTreeSelector-test': require('../demos/DualTreeSelectorTest.jsx')
        },
        menu: [
            {
                level: 'base',
                label: 'Base Widgets',
                children: [
                    'Tip', 'Button', 'List', 'DropDownList', 'ComboList', 'Crumb', '',
                    'Pager', 'Tab', 'Wizard'
                ]
            },
            {
                level: 'input',
                label: 'Input Widgets',
                children: [
                    'Checkbox', 'Radio', 'TextBox', 'NumberBox', 'TextArea', 'Select', 'SearchBox', 'Slider', '', 
                    'Calendar', 'RangeCalendar', 'DropDownCalendar', '',
                    'Region', 'DropDownRegion'
                ]
            },
            
            {
                level: 'layout',
                label: 'Layout Widgets',
                children: [
                    'Layer', 'TitleWindow', 'ShojiScreen', 'Dialog'
                ]
            },
            {
                level: 'functional',
                label: 'Functional Widgets',
                children: [
                    'Form', 'Table'
                ]
            },
            {
                level: 'test',
                label: 'Test Demos',
                children: [
                    'TestBaseLine', 'TestFormField', 'Schedule', 'Tree', 'DualTreeSelector', '',
                    'Tree-Test', 'DualTreeSelector-test'
                ]
            }
        ]
    };

});
