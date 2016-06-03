define(function (require) {


    var React = require('react');
    var Form = require('fcui/Form.jsx');
    var Button = require('fcui/Button.jsx');
    var TextBox = require('fcui/TextBox.jsx');
    var NumberBox = require('fcui/NumberBox.jsx');


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
        form2FieldChange: function (e) {
            var form2 = JSON.parse(JSON.stringify(this.state.form2));
            form2[e.field] = e.dataset[e.field];
            this.setState({form2: form2});
            this.alertEventElement(e);
        },
        render: function () {
            return (
                <div className="demo-form">
                    <div className="demo-item">
                        <h3>Readonly form with initial data</h3>
                        <Form>
                            <span>name: </span><TextBox value={this.state.form1.name}/><br/>
                            <span>age: </span><NumberBox value={this.state.form1.age}/>
                        </Form>
                    </div>
                    <div className="demo-item">
                        <h3>Form with field change handler</h3>
                        <Form onFieldChange={this.form2FieldChange}>
                            <span>name: </span><TextBox name="name" value={this.state.form2.name}/><br/>
                            <span>age: </span><NumberBox name="age" value={this.state.form2.age}/>
                        </Form>
                    </div>
                    <div className="demo-item">
                        <h3>Form with field validations</h3>
                        <Form onFieldChange={this.form2FieldChange}>
                            <span>name: </span>
                            <TextBox name="name" value={this.state.form2.name}/><br/>
                            <span>age: </span>
                            <NumberBox name="age" value={this.state.form2.age}
                                validations={{
                                    maxAge: function (e) {
                                        return e < 21 ? true : '真不能大于20岁！'
                                    }
                                }}
                            />
                            <label>年龄不能大于20岁了</label>
                        </Form>
                    </div>
                </div>
            );
        }
    });
});
