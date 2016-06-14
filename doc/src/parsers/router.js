define(function (require) {

    return [
        {
            parser: require('./Introduction.jsx'),
            validation: function (item) {
                return item.line === 1;
            }
        },
        {
            parser: require('./Properties.jsx'),
            validation: function (item) {
                return item.hasOwnProperty('properties');
            }
        },
        {
            parser: require('./Structure.jsx'),
            validation: function (item) {
                return item.hasOwnProperty('structure');
            }
        },
        {
            parser: require('./Constructor.jsx'),
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
            parser: require('./Interface.jsx'),
            validation: function (item) {
                return item.hasOwnProperty('interface') && item.interface.length;
            }
        }
    ];

});
