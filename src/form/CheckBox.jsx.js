define(function (require) {
    var React = require('react');
    var mixins = require('./mixins');

    var CheckBox = React.createClass({
        mixins: [mixins],

        render: function () {
            var {
                type,
                title,
                ...inputProps
            } = this.props;

            var checkBoxClasses = ['fcui2-form-checkbox'];
            if (this.props.disabled) {
                checkBoxClasses.push('fcui2-form-checkbox-disabled');
            }

            return (
                <span className={checkBoxClasses.join(' ')}>
                    <input {...inputProps} type='checkbox' ref='focusNode'/>
                    <span onClick={this.handleTitleClick}>{this.props.title}</span>
                </span>
            );
        },

        handleTitleClick: function (e) {
            this.refs.focusNode.click();
        }
    });

    return CheckBox;
});