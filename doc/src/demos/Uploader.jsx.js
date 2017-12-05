define(function (require) {

    var Uploader = require('fcui2/enterprise/Uploader.jsx');
    var Creater = require('./Main.jsx');

    var items = [
        {
            title: 'Normal Uploader',
            props: {}
        }
    ];

    return Creater(Uploader, items, 'onClick');

});
