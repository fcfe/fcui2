define(function (require) {

    var Button = require('fcui2/Message.jsx');
    var Creater = require('./Main.jsx');

    var items = [
        {
            title: 'Message Line',
            props: {
                skin: 'red',
                message: '提示文案',
                icon: 'fcui2-icon fcui2-icon-remove',
                status: 'new-refresh',
                buttonProps: {
                    label: '操作'
                }
            }
        },
        {
            title: 'Message Line',
            props: {
                skin: 'red',
                message: '提示文案',
                icon: 'fcui2-icon fcui2-icon-remove'
            }
        },
        {
            title: 'Message Line',
            props: {
                skin: 'red',
                message: '<span class="fcui2-icon fcui2-icon-failed-2" style="color:#FF5b5b;margin-right:10px;font-weight:700;"></span>内嵌的html',
                icon: 'fcui2-icon fcui2-icon-remove'
            }
        },
        {
            title: 'Message Line',
            props: {
                skin: 'red',
                style: {
                    width: 400
                },
                message: [
                    '<div class="fcui2-message-multi-lines">',
                    '<div class="message-title">',
                    '<span class="fcui2-icon fcui2-icon-failed-2" style="color:#FF5b5b;font-weight:700;"></span>',
                    '这是标题啊',
                    '</div>',
                    '<div class="message-content">',
                    '这是一堆非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的内容',
                    '</div>',
                    '</div>'
                ].join(''),
                icon: 'fcui2-icon fcui2-icon-remove'
            }
        },
        {
            title: 'Message Line',
            props: {
                skin: 'yellow',
                style: {
                    width: 400
                },
                message: [
                    '<div class="fcui2-message-multi-lines">',
                    '<div class="message-title">',
                    '<span class="fcui2-icon fcui2-icon-exclamation" style="color:#fe9700;font-weight:700;"></span>',
                    '这是标题啊',
                    '</div>',
                    '<div class="message-content">',
                    '这是一堆非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的内容',
                    '</div>',
                    '</div>'
                ].join(''),
                icon: 'fcui2-icon fcui2-icon-remove'
            }
        },
        {
            title: 'Message Line',
            props: {
                skin: 'yellow',
                message: '提示文案',
                icon: '',
                status: 'new-refresh',
                buttonProps: {
                    label: '操作'
                }
            }
        },
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
