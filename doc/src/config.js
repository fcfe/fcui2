define(function (require) {

    var dataset = require('./dataset/dataset.js');
    var menu = [
        {level: 'widget', label: 'Widgets', children: []},
        {level: 'component', label: 'Components', children: []},
        {level: 'tool', label: 'Tools', children: []},
        {level: 'mixin', label: 'Mixins', children: []}
    ];
    var items = {};
    var warnings = {};

    for (var key in dataset.files) {
        if (!dataset.files.hasOwnProperty(key)) continue;
        items[key] = [];
        warnings[key] = [];
        if (key.indexOf('src\\components\\') === 0) {
            menu[1].children.push({
                id: key,
                label: key.replace(/src\\components\\|.jsx.js|.es6.js|.js/g, '')
            });
        }
        else if (key.indexOf('src\\core\\') === 0) {
            menu[2].children.push({
                id: key,
                label: key.replace(/src\\core\\|.jsx.js|.es6.js|.js/g, '')
            });
        }
        else if (key.indexOf('src\\mixins\\') === 0) {
            menu[3].children.push({
                id: key,
                label: key.replace(/src\\mixins\\|.jsx.js|.es6.js|.js/g, '')
            });
        }
        else {
            menu[0].children.push({
                id: key,
                label: key.replace(/src\\|.jsx.js|.es6.js|.js/g, '')
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
        items: items,
        warnings: warnings
    };


    function sorter(a, b) {
        return a.line > b.line;
    }


});
