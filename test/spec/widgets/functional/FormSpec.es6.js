/**
 * @file Specs for Form
 * @author Brian Li (lbxxlht@163.com)
 * @date  07/03/2016
 */

define(function (require) {


    const _ = require('underscore');
    const React = require('react');
    const ReactDOM = require('react-dom');
    const TestUtils = React.addons.TestUtils;
    const Form = require('Form.jsx');
    const NumberBox = require('NumberBox.jsx');
    const Button = require('Button.jsx');
    const Radio = require('Radio.jsx');


    const Component = React.createClass({
        getDefaultProps() {
            return {
                age: '2'
            };
        },
        getInitialState() {
            return {
                age: this.props.age * 1
            };
        },
        componentWillReceiveProps(nextProps) {
            this.setState({
                age: nextProps.age * 1
            });
        },
        onFieldChange(e) {
            if (e.field === 'age') {
                this.setState({
                    age: e.dataset.age * 1
                });
            }
        },
        render() {
            return (
                <div ref="container">
                    <Form ref="form" onFieldChange={this.onFieldChange} onSubmit={this.props.onSubmit}
                        validations={{
                            maxAge: function (v) {
                                if (!v.hasOwnProperty('age')) return true;
                                return  v.age * 1 < 11 ? true : 'maxAge is 10';
                            }
                        }}
                    >
                        <NumberBox name="age" value={this.state.age} ref="numberbox"
                            validations={{
                                min: function (v) {
                                    return v * 1 > 6 ? true : 'min is 7';
                                },
                                max: function (v) {
                                    return  v * 1 < 11;
                                },
                                required: [false],
                                incorrect: '',
                                notMatchRegexp: /[a-z]j/
                            }}
                            customErrorTemplates={{
                                max: 'max is 10'
                            }}
                        />
                        <Radio name="height" value="180" ref="r180"/>
                        <Radio name="height" value="170" ref="r170"/>
                        <NumberBox name="age" value={this.state.age}/>
                        <Button type="submit" label="enter" ref="submitBtn" />
                    </Form>
                </div>
            );
        }
    });

    function realRender(Component, props) {
        return TestUtils.renderIntoDocument(<Component {...props} />);
    }

    describe('Form', () => {

        describe('Base Testing', () => {

            it('Normal Form', () => {
                let dom = realRender(Component, {age: 8});
                expect(dom.refs.numberbox.refs.inputbox.value * 1).toBe(8);
                expect(dom.refs.submitBtn.refs.container.childNodes[0].type).toBe('submit');
                ReactDOM.unmountComponentAtNode(dom.refs.container.parentNode);
            });

            it('Events', () => {
                let value = '';
                let dom = realRender(Component, {
                    age: 5,
                    onSubmit(e) {
                        value = e;
                    }
                });

                expect(dom.refs.form.validate().isValid).toBe(false);
                TestUtils.Simulate.click(dom.refs.r180.refs.container.childNodes[2]);

                let numberbox = dom.refs.numberbox;
                TestUtils.Simulate.click(numberbox.refs.container.childNodes[2].childNodes[0]);
                expect(dom.state.age * 1).toBe(6);
                TestUtils.Simulate.click(numberbox.refs.container.childNodes[2].childNodes[0]);
                expect(dom.state.age * 1).toBe(7);
                expect(dom.refs.form.validate().isValid).toBe(true);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('click', true, false);
                dom.refs.submitBtn.refs.container.childNodes[0].dispatchEvent(evt);
            });

        });

    });
});
