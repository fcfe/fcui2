define(function (require) {


    var React = require('react');
    var Form = require('fcui2/Form.jsx');
    var Button = require('fcui2/Button.jsx');
    var TextBox = require('fcui2/TextBox.jsx');
    var NumberBox = require('fcui2/NumberBox.jsx');


    var demos = {
        'Readonly form with initial data': [
            '<Form>',
            '    <span>name: </span><TextBox name="name" value={this.state.form1.name}/><br/>',
            '    <span>age: </span><NumberBox age="age" value={this.state.form1.age}/>',
            '</Form>'
        ],
        'Form with field change handler': [
            '<Form onFieldChange={this.formFieldChangeFactory(\'form2\')}>',
            '    <span>name: </span><TextBox name="name" value={this.state.form2.name}/><br/>',
            '    <span>age: </span><NumberBox name="age" value={this.state.form2.age}/>',
            '</Form>'
        ],
        'Form with field validations': [
            '<Form onFieldChange={this.formFieldChangeFactory(\'form3\')}>',
            '    <span>name: </span>',
            '    <TextBox name="name" value={this.state.form3.name} validations={{',
            '         required: true',
            '    }}/><br/>',
            '    <span>age: </span>',
            '    <NumberBox name="age" value={this.state.form3.age}',
            '        validations={{',
            '            maxAge: function (e) {',
            '                return e < 21 ? true : \'真不能大于20岁！\'',
            '            }',
            '        }}',
            '    />',
            '    <label>年龄不能大于20岁了</label>',
            '</Form>'
        ],
        'Form with cross validations': [
            '<Form onFieldChange={this.formFieldChangeFactory(\'form4\')}  validations={{',
            '    maxAge: function (e) {',
            '        if (',
            '            e.hasOwnProperty(\'name\')',
            '            && e.hasOwnProperty(\'age\')',
            '            && e.name === \'Brian Li\'',
            '            && e.age > 18',
            '        ) {',
            '            return \'这输入违反表单校验规则\';',
            '        }',
            '        return true;',
            '    }',
            '}}>',
            '    <label>Brian Li永远不超过18岁，点确定校验。</label><br/><br/>',
            '    <span>name: </span>',
            '    <TextBox name="name" value={this.state.form4.name}/><br/>',
            '    <span>age: </span>',
            '    <NumberBox name="age" value={this.state.form4.age}/><br/>',
            '    <Button label="确定" type="submit"/>',
            '</Form>'
        ]

    };

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        getInitialState: function () {
            return {
                form1: {
                    name: 'Brian Li',
                    age: 18
                },
                form2: {
                    name: 'Brian Li',
                    age: 18
                },
                form3: {
                    name: '',
                    age: 18
                },
                form4: {
                    name: 'Brian Li',
                    age: 20
                }
            };
        },
        alertEventElement: function (e) {
            this.props.alert(JSON.stringify({
                field: e.field,
                dataset: e.dataset,
                validationResults: e.validationResults
            }));
        },
        formFieldChangeFactory: function (form) {
            var me = this;
            return function (e) {
                var formdata = JSON.parse(JSON.stringify(me.state[form]));
                formdata[e.field] = e.dataset[e.field];
                var obj = {};
                obj[form] = formdata;
                me.setState(obj);
                me.alertEventElement(e);
            }
        },
        render: function () {
            return (
                <div className="demo-form">
                    <div className="demo-item">
                        <Form>
                            <span>name: </span><TextBox name="name" value={this.state.form1.name}/><br/>
                            <span>age: </span><NumberBox age="age" value={this.state.form1.age}/>
                        </Form>
                    </div>
                    <div className="demo-item">
                        <Form onFieldChange={this.formFieldChangeFactory('form2')}>
                            <span>name: </span><TextBox name="name" value={this.state.form2.name}/><br/>
                            <span>age: </span><NumberBox name="age" value={this.state.form2.age}/>
                        </Form>
                    </div>
                    <div className="demo-item">
                        <Form onFieldChange={this.formFieldChangeFactory('form3')}>
                            <span>name: </span>
                            <TextBox name="name" value={this.state.form3.name} validations={{
                                required: true
                            }}/><br/>
                            <span>age: </span>
                            <NumberBox name="age" value={this.state.form3.age}
                                validations={{
                                    maxAge: function (e) {
                                        return e < 21 ? true : '真不能大于20岁！'
                                    }
                                }}
                            />
                            <label>年龄不能大于20岁了</label>
                        </Form>
                    </div>
                    <div className="demo-item">
                        <Form onFieldChange={this.formFieldChangeFactory('form4')}  validations={{
                            maxAge: function (e) {
                                if (
                                    e.hasOwnProperty('name')
                                    && e.hasOwnProperty('age')
                                    && e.name === 'Brian Li'
                                    && e.age > 18
                                ) {
                                    return '这输入违反表单校验规则';
                                }
                                return true;
                            }
                        }}>
                            <label>Brian Li永远不超过18岁，点确定校验。</label><br/><br/>
                            <span>name: </span>
                            <TextBox name="name" value={this.state.form4.name}/><br/>
                            <span>age: </span>
                            <NumberBox name="age" value={this.state.form4.age}/><br/>
                            <Button label="确定" type="submit"/>
                        </Form>
                    </div>
                </div>
            );
        }
    });
});
