define(function (require) {
    var Button = require('./Button.jsx');
    var language = require('./core/language');
    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                min: 1,
                max: 10,
                value: 1,
                disable: false,
                onChange: function () {}
            };
        },
        // @override
        componentWillReceiveProps: function (props) {
            this.setState({disable: props.disable});
        },
        // @override
        getInitialState: function () {
            return {
                disable: this.props.disable,
                value: parseInt(this.props.value, 10)
            };
        },
        clickHandler: function (e) {
            var v = parseInt(e.value, 10);
            var current = this.state.value;
            if (v === current) return;
            var min = parseInt(this.props.min, 10);
            var max = parseInt(this.props.max, 10);
            if (v > 0) {
                current = v;
            }
            else {
                if (v === -1) v = current - 1;
                if (v === -2) v = current + 1;
            }
            v = v < min ? min : v;
            v = v > max ? max : v;
            this.setState({value: v});
            this.props.onChange({target: this, value: v});
        },
        render: function () {
            var me = this;
            var containerProp = {className: 'ui-pager'};
            return (
                <div {...containerProp}>{produceButtons()}</div>
            );
            function produceButtons() {
                var min = parseInt(me.props.min, 10);
                var max = parseInt(me.props.max, 10);
                var value = parseInt(me.state.value, 10);
                var btns = [];
                var i = min;
                var before = false;
                var after = false;
                if (value > min) {
                    btns.push(
                        <Button label={language.pager.previousPage} cmd="-1"
                            onClick={me.clickHandler} disable={me.state.disable}/>
                    );
                }
                while(i < max + 1) {
                    var prop = {
                        skin: i === value ? 'active' : '',
                        maxWidth: 10,
                        disable: me.state.disable,
                        onClick: me.clickHandler
                    };
                    if (i < value - 3 && i !== min) {
                        if (!before) {
                            before = true;
                            btns.push(<Button {...prop} label="..." cmd={value - 4}/>);
                        }
                        i++;
                        continue;
                    }
                    if (i > value + 3 && i !== max) {
                        if (!after) {
                            after = true;
                            btns.push(<Button {...prop} label="..." cmd={value + 4}/>);
                        }
                        i++;
                        continue;
                    }
                    btns.push(<Button {...prop} label={i} cmd={i}/>);
                    i++;
                }
                if (value < max) {
                    btns.push(
                        <Button label={language.pager.nextPage} cmd="-2"
                            onClick={me.clickHandler} disable={me.state.disable}/>
                    );
                }
                return btns;
            }
        }
    });
});
