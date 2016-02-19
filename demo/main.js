define(function (require) {
    var ReactDOM = require('react-dom');
    var React = require('react');
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
        tableSummary: {
            name: 'NAME',
            age: 1024
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
                    ui = ReactDOM.render(
                        React.createElement(app, this),
                        document.getElementById('react-container')
                    );
                    return;
                default:
                    ui.setState({outputmsg: e.toString()});
                    return;
            };
        }
    };
    ui = ReactDOM.render(
        React.createElement(app, props),
        document.getElementById('react-container')
    );
    // setTimeout(function () {
    //     ReactDOM.unmountComponentAtNode(document.getElementById('react-container'));
    // }, 2000);
});