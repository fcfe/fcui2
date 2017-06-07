define(function (require) {

    var Button = require('fcui2/Message.jsx');
    var Creater = require('../Main.jsx');

    var items = [
        {
            title: 'Loading',
            props: {status: 'loading'}
        },
        {
            title: 'Refresh',
            props: {status: 'refresh'}
        },
        {
            title: 'New Refresh',
            props: {status: 'new-refresh'}
        },
        {
            title: 'Success',
            props: {status: 'success'}
        },
        {
            title: 'Fail',
            props: {status: 'fail'}
        }
    ];

    return Creater(Button, items, 'onClick');

});
