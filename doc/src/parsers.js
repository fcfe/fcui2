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
        }
    ];

});
