define(function (require) {
    var app = require('./app.jsx');
    var ui = null;
    var fixedHelper = require('fcui/core/fixedHelper');
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
        tableData: [
            {name: 'Brian Li', age: 18, birth: '1900-10-1'},
            {name: 'Tom Chros', age: 18, birth: '1900-10-1'},
            {name: 'Jim Jerrly', age: 18, birth: '1900-10-1'},
            {name: '这是个啥', age: 18, birth: '1900-10-1'},
            {name: '是啥？', age: 18, birth: '1900-10-1'},
            {name: '到底是个啥', age: 18, birth: '1900-10-1'},
            {name: 'Brian Li', age: 18, birth: '1900-10-1'},
            {name: 'Tom Chros', age: 18, birth: '1900-10-1'},
            {name: 'Jim Jerrly', age: 18, birth: '1900-10-1'},
            {name: '这是个啥', age: 18, birth: '1900-10-1'},
            {name: '是啥？', age: 18, birth: '1900-10-1'},
            {name: '到底是个啥', age: 18, birth: '1900-10-1'},
            {name: 'Brian Li', age: 18, birth: '1900-10-1'},
            {name: 'Tom Chros', age: 18, birth: '1900-10-1'},
            {name: 'Jim Jerrly', age: 18, birth: '1900-10-1'},
            {name: '这是个啥', age: 18, birth: '1900-10-1'},
            {name: '是啥？', age: 18, birth: '1900-10-1'},
            {name: '到底是个啥', age: 18, birth: '1900-10-1'},
            {name: '是啥？', age: 18, birth: '1900-10-1'},
            {name: '到底是个啥', age: 18, birth: '1900-10-1'},
            {name: 'Brian Li', age: 18, birth: '1900-10-1'},
            {name: 'Tom Chros', age: 18, birth: '1900-10-1'},
            {name: 'Jim Jerrly', age: 18, birth: '1900-10-1'},
            {name: '这是个啥', age: 18, birth: '1900-10-1'},
            {name: '是啥？', age: 18, birth: '1900-10-1'},
            {name: '到底是个啥', age: 18, birth: '1900-10-1'}
        ],
        dispatch: function (e) {
            switch (e) {
                case 'change textbox':
                    this.textBoxProp.label = '还能不能输入内容了？';
                    this.textBoxProp.width = this.textBoxProp.width === 200 ? 300 : 200;
                    ui.setProps(this);
                    return;
                default:
                    ui.setState({outputmsg: e.toString()});
                    return;
            };
        }
    };
    ui = React.render(
        React.createElement(app, props),
        document.body
    );
    fixedHelper.add('.fcui2-table .fcui2-fixed-header', 80, 100);
});