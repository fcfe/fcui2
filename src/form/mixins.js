/**
 * @file mixins.js
 * @author Hu Jian <hujian02@baidu.com>
 */
define(function (require) {
    var React = require('react');

    function convertValidationToObject(validations) {
        if (typeof validations !== 'string') {
            return validations || {};
        }

        return validations.split(/\,(?![^{\[]*[}\]])/g).reduce(function (validations, validation) {
            var args = validation.split(':');
            var rule =args.shift();

            args = args.map(function (arg) {
                try {
                    return JSON.parse(arg);
                } catch (e) {
                    // It is a string if it can not parse it
                    return arg;
                }
            });

            if (args.length > 1) {
                throw new Error('Form does not support multiple args on string validation.'
                    + 'Use object format of validations instead.');
            }

            validations[rule] = args.length ? args[0] : true;
            return validations;
        }, {});
    }

    var mixins = {
        getInitialState: function () {
            return {
                isValid: true,
                validationError: [],
                externalValidationError: null
            };
        },

        getDefaultProps: function () {
            return {
                customErrorTemplates: {}
            };
        },

        contextTypes: {
            form: React.PropTypes.object
        },

        componentWillMount: function () {
            if (!this.props.name) {
                throw new Error('Form field requires a name property when used');
            }
            this.setValidations(this.props.validations);

            var form = this.context.form;
            form && form.attachToForm(this);
        },

        componentWillReceiveProps: function(nextProps) {
            this.setValidations(nextProps.validations);
        },

        // Detach it when component unmounts
        componentWillUnmount: function () {
            var form = this.context.form;
            form && form.detachFromForm(this);
        },

        setValidations: function(validations) {
            // Add validations to the store itself as the props object can not be
            // modified
            this.validations = convertValidationToObject(validations) || {};
        },

        getErrorMessage: function () {
            var messages = this.getErrorMessages();
            return messages.length ? messages[0] : null;
        },

        getErrorMessages: function () {
            if (this.state.externalValidationError && this.state.externalValidationError.length > 0) {
                return this.state.externalValidationError;
            }

            return !this.state.isValid ? (this.state.validationError || []) : [];
        },

        validate: function (rules) {
            this.context.form.validate(this, rules);
        },

        isValidValue: function (options) {
            var isValid = true;

            var form = this.context.form;
            if (form) {
                isValid = form.isValidValue.call(null, this, options);
            }
            return isValid;
        }
    };

    return mixins;
});
