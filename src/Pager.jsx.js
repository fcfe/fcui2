define(function (require) {

    var Button = require('./Button.jsx');
    var language = require('./core/language');
    var React = require('react');
    
    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                className: '',
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
            var min = parseInt(this.props.min, 10);
            var max = parseInt(this.props.max, 10);
            var current = parseInt(this.state.value, 10);
            current = isNaN(current) ? min : current;
            var value = e.value;
            if (value + '' === current + '' || this.props.disable) return;
            var v = 1;
            v = value === 'prev' ? current - 1 : value;
            v = v === 'next' ? current + 1 : v;
            v = parseInt(v, 10);
            v = v < min ? min : v;
            v = v > max ? max : v;
            this.setState({value: v});
            this.props.onChange({target: this, value: v});
        },
        render: function () {
            var me = this;
            var containerProp = {
                className: 'fcui2-pager ' + this.props.className
            };
            return (<div {...containerProp}>{produceButtons(this)}</div>);
        }
    });

    function produceButtons(me) {
        var min = parseInt(me.props.min, 10);
        var max = parseInt(me.props.max, 10);
        var threshold = 3;
        var btns = [];
        var value = parseInt(me.state.value, 10);

        value = isNaN(value) ? min : value;
        value = value < min ? min : value;
        value = value > max ? max: value;
        threshold = isNaN(threshold) || threshold < 1 ? Number.POSITIVE_INFINITY : threshold;

        btns.push(
            <Button label={language.pager.previousPage} cmd="prev"
                onClick={me.clickHandler} disable={me.props.disable || value <= min} key="prev"/>
        );

        var i = min;
        var before = false;
        var after = false;
        while(i < max + 1) {
            if (i < value - threshold && i !== min) {
                if (!before) {
                    before = true;
                    btns.push(<Button {...prop} label=".." cmd={value - threshold - 1} key={value - threshold - 1}/>);
                }
                i++;
                continue;
            }
            if (i > value + threshold && i !== max) {
                if (!after) {
                    after = true;
                    btns.push(<Button {...prop} label=".." cmd={value + threshold + 1} key={value + threshold + 1}/>);
                }
                i++;
                continue;
            }
            var prop = {
                skin: i + '' === value + '' ? 'active' : '',
                minWidth: 12,
                disable: me.props.disable,
                onClick: me.clickHandler
            };
            btns.push(<Button {...prop} label={i} cmd={i} key={i}/>);
            i++;
        }

        btns.push(
            <Button label={language.pager.nextPage} cmd="next"
                onClick={me.clickHandler} disable={me.props.disable || value >= max} key="next"/>
        );

        return btns;
    }
});
