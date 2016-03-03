/**
 * @file Form.js
 * @author Hu Jian <hujian02@baidu.com>
 */

define(function (require) {
    var React = require('react');
    var defaultValidations = require('./validations');
    var _ = require('underscore');

    function format(template, data) {
        if (!template) {
            return '';
        }

        if (data == null) {
            return template;
        }

        return template.replace(
            /\$\{(.+?)\}/g,
            function (match, key) {
                var keys = key.split('.');
                var replacer = data[keys.shift()] || '';
                for (var i = 0; i < keys.length && replacer; i++) {
                    replacer = replacer[keys[i]] || ''
                }
                return replacer;
            }
        );
    }

    var Form = React.createClass({
        getDefaultProps: function () {
            return {
                onSubmit: function () {}
            };
        },

        childContextTypes: {
            form: React.PropTypes.object
        },

        getChildContext: function () {
            return {
                form: {
                    attachToForm: this.attachToForm,
                    detachFromForm: this.detachFromForm,
                    validate: this.validate,
                    isValidValue: (component, options) => {
                        return !this.runRules(component, options).length;
                    }
                }
            }
        },

        // Add a map to store the inputs of the form
        componentWillMount: function () {
            this.inputs = {};
        },

        render: function () {
            var {
                onSubmit,
                ...formProps
            } = this.props;

            return (
                <form {...formProps} onSubmit={this.submit}>
                    {this.props.children}
                </form>
            );
        },

        submit: function (event) {
            event && event.preventDefault();

            var callback = function (isAllValid) {
                if (isAllValid) {
                    var values = this.getValues();
                    this.props.onSubmit(values);
                }
            }.bind(this);
            this.validateForm(null, callback);
        },

        // Method put on each input component to register
        // itself to the form
        attachToForm: function (component) {
            var name = component.props.name;
            if (this.inputs[name]) {
                console.warn('input component with name "' + name + '" already attached');
            }
            else {
                this.inputs[name] = component;
            }
        },

        // Method put on each input component to unregister
        // itself from the form
        detachFromForm: function (component) {
            var name = component.props.name;
            delete this.inputs[name];
        },

        // change this.state.values
        getValues: function () {
            return Object.keys(this.inputs).reduce((data, name) => {
                var component = this.inputs[name];
                data[name] = component.props.value;

                return data;
            }, {});
        },

        setExternalValidationErrors: function (externalValidationErrors) {
            Object.keys(this.inputs).forEach(name => {
                var component = this.inputs[name];
                component.setState({
                    externalValidationError: typeof externalValidationErrors[name] === 'string'
                        ? [externalValidationErrors[name]]
                        : externalValidationErrors[name]
                });
            });
        },

        // Validate the form by going through all child input components
        // and check their state
        validateForm: function (rules, callback) {
            var names = Object.keys(this.inputs);

            // We need a callback as we are validating all inputs again. This will
            // run when the last component has set its state
            var onValidationComplete = function () {
                var allIsValid = names.every(name => {
                    var component = this.inputs[name];
                    return component.state.isValid;
                });

                callback && callback(allIsValid);
            }.bind(this);

            // Run validation again in case affected by other inputs. The
            // last component validated will run the onValidationComplete callback
            names.forEach((name, index) => {
                var component = this.inputs[name];
                var failedvalidationResults = this.runRules(component, {
                    rules: rules
                });
                component.setState({
                    isValid: !failedvalidationResults.length,
                    validationError: failedvalidationResults,
                    externalError: null
                }, index === names.length - 1 ? onValidationComplete : null);
            });
        },

        // Use the binded values and the actual input value to
        // validate the input and set its state. The check the
        // state of the form itself
        validate: function (component, rules) {
            var failedvalidationResults = this.runRules(component, {
                rules: rules
            });
            component.setState({
                isValid: !failedvalidationResults.length,
                validationError: failedvalidationResults,
                externalValidationError: null
            });
        },

        runRules: function (component, options) {
            var failedvalidationResults = [];
            var validations = component.validations || {};
            options = options || {};

            var rules = Object.keys(validations);
            if (options.rules && options.rules.length > 0) {
                rules = _.intersection(rules, options.rules);
            }

            if (rules.length) {
                var value = options.value || component.props.value;
                var values = this.getValues();
                var customErrorTemplates = component.props.customErrorTemplates;

                rules.forEach(rule => {
                    if (!defaultValidations[rule] && typeof validations[rule] !== 'function') {
                        throw new Error('Form does not have the validation for rule: ' + rule);
                    }

                    var validation = defaultValidations[rule] || validations[rule];
                    var args = defaultValidations[rule] 
                        ? [values, value, validations[rule]]
                        : [values, value];
                    var validationResult = validation.apply(null, args);
                    if (!validationResult.isValid) {
                        var template = customErrorTemplates[rule] || validationResult.template || '';
                        failedvalidationResults.push(format(template, component));
                    }
                });
            }

            return failedvalidationResults;
        }
    });

    return Form;
});
