define(function (require) {
    var app = require('./app.jsx');
    var ui = null;
    var props = {
        textBoxProp: {
            label: '请输入内容',
            value: '',
            width: 300
        },
        button1: {
            label: 'change width',
            cmd: 'change textbox'
        },
        dispatch: function (e) {
            switch (e) {
                case 'change textbox':
                    this.textBoxProp.label = '还能不能输入内容了？';
                    this.textBoxProp.width = this.textBoxProp.width === 200 ? 300 : 200;
                    ui.setProps(this);
                    return;
                default:
                    console.log(e);
                    return;
            };
        }
    };
    ui = React.render(
        React.createElement(app, props),
        document.body
    );
});