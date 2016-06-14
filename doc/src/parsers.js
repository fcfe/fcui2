define(function (require) {

    return [
        {
            parser: require('./parsers/Introduction.jsx'),
            validation: function (item) {
                return item.line === 1;
            }
        },
        {
            parser: require('./parsers/Properties.jsx'),
            validation: function (item) {
                return item.hasOwnProperty('properties');
            }
        },
        {
            parser: require('./parsers/Structure.jsx'),
            validation: function (item) {
                return item.hasOwnProperty('structure');
            }
        },
        {
            parser: require('./parsers/Constructor.jsx'),
            validation: function (item) {
                return item.is_constructor;
            }
        },
        {
            parser: null,
            validation: function (item) {
                if (
                    (item.hasOwnProperty('name') && item.hasOwnProperty('classname'))
                    || item.hasOwnProperty('fire')
                ) {
                    return true;
                }
                return false;
            }
        },
        {
            parser: require('./parsers/Interface.jsx'),
            validation: function (item) {
                return item.hasOwnProperty('interface') && item.interface.length;
            }
        }
    ];

});
