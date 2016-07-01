define(function (require) {

    var dataset = require('../dataset/dataset');
    var items = {};
    var components = {
        level: 'component',
        label: 'Components',
        children: []
    };
    var tools = {
        level: 'tool',
        label: 'Tools',
        children: []
    };
    var mixins = {
        level: 'mixin',
        label: 'Mixins', 
        children: []
    };
    var menu = [
        {
            level: 'base',
            label: 'Base Widgets',
            children: [
                {id: 'src\\Button.jsx.js', label: 'Button'},
                {id: 'src\\Tip.jsx.js', label: 'Tip'},
                {id: 'src\\List.jsx.js', label: 'List'},
                {id: 'src\\DropDownList.jsx.js', label: 'DropDownList'},
                {id: 'src\\Tree.jsx.js', label: 'Tree'},
                {id: 'src\\Crumb.jsx.js', label: 'Crumb'},
                {id: 'src\\Pager.jsx.js', label: 'Pager'},
                {id: 'src\\Tab.jsx.js', label: 'Tab'},
                {id: 'src\\Wizard.jsx.js', label: 'Wizard'}
            ]
        },
        {
            level: 'input',
            label: 'Input Widgets',
            children: [
                {id: 'src\\CheckBox.jsx.js', label: 'CheckBox'},
                {id: 'src\\Radio.jsx.js', label: 'Radio'},
                {id: 'src\\TextBox.jsx.js', label: 'TextBox'},
                {id: 'src\\NumberBox.jsx.js', label: 'NumberBox'},
                {id: 'src\\TextArea.jsx.js', label: 'TextArea'},
                {id: 'src\\Select.jsx.js', label: 'Select'}
            ]
        },
        {
            level: 'layout',
            label: 'Layout Widgets',
            children: [
                {id: 'src\\Layer.jsx.js', label: 'Layer'},
                {id: 'src\\TitleWindow.jsx.js', label: 'TitleWindow'},
                {id: 'src\\ShojiScreen.jsx.js', label: 'ShojiScreen'},
                {id: 'src\\Dialog.jsx.js', label: 'Dialog'}
            ]
        },
        {
            level: 'functional',
            label: 'Functional Widgets',
            children: [
                {id: 'src\\ComboList.jsx.js', label: 'ComboList'},
                {id: 'src\\SearchBox.jsx.js', label: 'SearchBox'},
                {id: 'src\\Slider.jsx.js', label: 'Slider'},
                {id: 'src\\DualTreeSelector.jsx.js', label: 'DualTreeSelector'},
                '',
                {id: 'src\\Region.jsx.js', label: 'Region'},
                {id: 'src\\AlphabetRegion.jsx.js', label: 'AlphabetRegion'},
                {id: 'src\\DropDownRegion.jsx.js', label: 'DropDownRegion'},
                '',
                {id: 'src\\Calendar.jsx.js', label: 'Calendar'},
                {id: 'src\\RangeCalendar.jsx.js', label: 'RangeCalendar'},
                {id: 'src\\DropDownCalendar.jsx.js', label: 'DropDownCalendar'},
                '',
                {id: 'src\\Schedule.jsx.js', label: 'Schedule'},
                {id: 'src\\Form.jsx.js', label: 'Form'},
                {id: 'src\\Table.jsx.js', label: 'Table'}
            ]
        },
        {
            level: 'enterprise',
            label: 'Enterprise Widgets',
            children: [
                {id: 'src\\enterprise\\DualTreeSelector.jsx.js', label: 'DualTreeSelector'},
            ]
        },
        components,
        tools,
        mixins,
        {
            level: 'testing',
            label: 'Testing',
            children:[
                {id: 'BaseLineTesting.jsx.js', label: 'Display Base Line Test'},
                {id: 'FormFieldTesting.jsx.js', label: 'Form Field Test'}
            ]
        }
    ];
    var demos = {
        'src\\Button.jsx.js': require('./demos/components/Button.jsx'),
        'src\\Tip.jsx.js': require('./demos/components/Tip.jsx'),
        'src\\List.jsx.js': require('./demos/components/List.jsx'),
        'src\\DropDownList.jsx.js': require('./demos/components/DropDownList.jsx'),
        'src\\ComboList.jsx.js': require('./demos/components/ComboList.jsx'),
        'src\\Crumb.jsx.js': require('./demos/components/Crumb.jsx'),
        'src\\Pager.jsx.js': require('./demos/components/Pager.jsx'),
        'src\\Tab.jsx.js': require('./demos/components/Tab.jsx'),
        'src\\Wizard.jsx.js': require('./demos/components/Wizard.jsx'),
        'src\\CheckBox.jsx.js': require('./demos/components/CheckBox.jsx'),
        'src\\Radio.jsx.js': require('./demos/components/Radio.jsx'),
        'src\\TextBox.jsx.js': require('./demos/components/TextBox.jsx'),
        'src\\NumberBox.jsx.js': require('./demos/components/NumberBox.jsx'),
        'src\\TextArea.jsx.js': require('./demos/components/TextArea.jsx'),
        'src\\Select.jsx.js': require('./demos/components/Select.jsx'),
        'src\\SearchBox.jsx.js': require('./demos/components/SearchBox.jsx'),
        'src\\Slider.jsx.js': require('./demos/components/Slider.jsx'),
        'src\\Calendar.jsx.js': require('./demos/components/Calendar.jsx'),
        'src\\RangeCalendar.jsx.js': require('./demos/components/RangeCalendar.jsx'),
        'src\\DropDownCalendar.jsx.js': require('./demos/components/DropDownCalendar.jsx'),
        'src\\Region.jsx.js': require('./demos/components/Region.jsx'),
        'src\\DropDownRegion.jsx.js': require('./demos/components/DropDownRegion.jsx'),
        'src\\Layer.jsx.js': require('./demos/components/Layer.jsx'),
        'src\\TitleWindow.jsx.js': require('./demos/components/TitleWindow.jsx'),
        'src\\ShojiScreen.jsx.js': require('./demos/components/ShojiScreen.jsx'),
        'src\\Dialog.jsx.js': require('./demos/components/Dialog.jsx'),
        'src\\Form.jsx.js': require('./demos/components/Form.jsx'),
        'src\\Table.jsx.js': require('./demos/components/Table.jsx'),
        'src\\AlphabetRegion.jsx.js': require('./demos/components/AlphabetRegion.jsx'),
        'src\\Tree.jsx.js': require('./demos/components/Tree.jsx'),
        'src\\DualTreeSelector.jsx.js': require('./demos/components/DualTreeSelector.jsx'),
        'src\\Schedule.jsx.js': require('./demos/components/Schedule.jsx'),
        'BaseLineTesting.jsx.js': require('./demos/components/BaseLineTesting.jsx'),
        'FormFieldTesting.jsx.js': require('./demos/components/FormFieldTesting.jsx'),
        'src\\enterprise\\DualTreeSelector.jsx.js': require('./demos/components/DualTreeSelectorEnterprise.jsx'),
    };

    for (var key in dataset.files) {
        if (!dataset.files.hasOwnProperty(key)) continue;
        items[key] = [];
        if (key.indexOf('src\\components\\') === 0) {
            components.children.push({
                id: key,
                label: key.replace(/src\\components\\|.jsx.js|.es6.js|.js/g, '')
            });
        }
        else if (key.indexOf('src\\core\\') === 0) {
            tools.children.push({
                id: key,
                label: key.replace(/src\\core\\|.jsx.js|.es6.js|.js/g, '')
            });
        }
        else if (key.indexOf('src\\mixins\\') === 0) {
            mixins.children.push({
                id: key,
                label: key.replace(/src\\mixins\\|.jsx.js|.es6.js|.js/g, '')
            });
        }
    }
    for (var i = 0; i < dataset.classitems.length; i++) {
        var item = dataset.classitems[i];
        if (!item.file || !items.hasOwnProperty(item.file)) continue;
        items[item.file].push(item);
    }

    return {
        menu: menu,
        demos: demos,
        items: items
    };


    function sorter(a, b) {
        return a.line > b.line;
    }


});
