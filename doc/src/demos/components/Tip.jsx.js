define(function (require) {


    var Creater = require('../Main.jsx');
    var Tip = require('fcui2/Tip.jsx');
    var Button = require('fcui2/Button.jsx');


    var items = [
        {
            title: 'Normal Tip',
            props: {title: '这里是一个标题', content: '这是一个非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长的文本'}
        },
        {
            title: 'Tip with Renderer',
            props: {
                title: 'It is tip\'s title',
                content: 'blablablabla',
                renderer: Button,
                renderProps:{value: 'Button in Tip'},
                layerLocation: '4',
                onOffset: function (result) {
                    result.left += 20;
                }
            }
        },
        {
            title: 'Tip with Icon',
            props: {
                title: 'It is tip\'s title', content: 'blablablabla', icon: 'fcui2-icon fcui2-icon-radio-selected',
                style: {
                    fontWeight: 200,
                    fontSize: 18
                }
            }
        },
        {
            title: 'Tip with Style',
            props: {style: {color: 'green'}, title: 'It is tip\'s title', content: 'blablablabla'}
        },
        {
            title: 'Tip with ClassName',
            props: {className: 'colorRed', title: 'It is tip\'s title', content: 'blablablabla' , skin: 'yellow'}
        },
        {
            title: 'Tip without Title',
            props: {content: 'blablablabla', skin: 'red'}
        },
        {
            title: 'Tip with html in Content',
            props: {skin: 'grey', title: 'It is tip\'s title', content: '<img width="300px" height="143" src="https://www.baidu.com/img/bd_logo1.png"/>'}
        },
        {
            title: 'Tip with empty props',
            props: {}
        }
    ];

    return Creater(Tip, items);
});
