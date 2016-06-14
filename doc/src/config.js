define(function (require) {

    var dataset = require('./dataset/dataset.js');
    var items = {};
    var warnings = {};
    var menu = [
        {
            level: 'base',
            label: 'Base Widgets',
            children: [
                {id: 'src\\Tip.jsx.js', label: 'Tip'},
                {id: 'src\\Button.jsx.js', label: 'Button'},
                {id: 'src\\List.jsx.js', label: 'List'},
                {id: 'src\\DropDownList.jsx.js', label: 'DropDownList'},
                {id: 'src\\ComboList.jsx.js', label: 'ComboList'},
                {id: 'src\\Crumb.jsx.js', label: 'Crumb'},
                '',
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
                {id: 'src\\Select.jsx.js', label: 'Select'},
                {id: 'src\\SearchBox.jsx.js', label: 'SearchBox'},
                {id: 'src\\Slider.jsx.js', label: 'Slider'},
                '',
                {id: 'src\\Calendar.jsx.js', label: 'Calendar'},
                {id: 'src\\RangeCalendar.jsx.js', label: 'RangeCalendar'},
                {id: 'src\\DropDownCalendar.jsx.js', label: 'DropDownCalendar'},
                '',
                {id: 'src\\Region.jsx.js', label: 'Region'},
                {id: 'src\\DropDownRegion.jsx.js', label: 'DropDownRegion'}
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
                {id: 'src\\Form.jsx.js', label: 'Form'},
                {id: 'src\\Table.jsx.js', label: 'Table'}
            ]
        },
        {
            level: 'component',
            label: 'Components',
            children: []
        },
        {
            level: 'tool',
            label: 'Tools',
            children: []
        },
        {
            level: 'mixin',
            label: 'Mixins', 
            children: []
        }
    ];
    var demos = {
        'src\\Button.jsx.js': require('./demos/components/Button.jsx')
    }

    for (var key in dataset.files) {
        if (!dataset.files.hasOwnProperty(key)) continue;
        items[key] = [];
        warnings[key] = [];
        if (key.indexOf('src\\components\\') === 0) {
            menu[4].children.push({
                id: key,
                label: key.replace(/src\\components\\|.jsx.js|.es6.js|.js/g, '')
            });
        }
        else if (key.indexOf('src\\core\\') === 0) {
            menu[5].children.push({
                id: key,
                label: key.replace(/src\\core\\|.jsx.js|.es6.js|.js/g, '')
            });
        }
        else if (key.indexOf('src\\mixins\\') === 0) {
            menu[6].children.push({
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
    for (var i = 0; i < dataset.warnings.length; i++) {
        var item = dataset.warnings[i];
        item.file = item.line.split(':')[0].trim();
        item.line = +item.line.split(':')[1];
        if (!item.file || !warnings.hasOwnProperty(item.file)) continue;
        warnings[item.file].push(item);
    }
    for (var key in items) {
        if (!items.hasOwnProperty(key)) continue;
        items[key] = items[key].sort(sorter);
    }
    for (var key in warnings) {
        if (!warnings.hasOwnProperty(key)) continue;
        warnings[key] = warnings[key].sort(sorter);
    }


    return {
        menu: menu,
        demos: demos,
        items: items,
        warnings: warnings
    };


    function sorter(a, b) {
        return a.line > b.line;
    }


});
