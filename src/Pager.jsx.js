/**
 * @file 页码组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var Button = require('./Button.jsx');
    var language = require('./core/language');
    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');


    return React.createClass({
        // #override
        mixins: [InputWidgetBase],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                min: 1,
                max: 10,
                threshold: Number.POSITIVE_INFINITY,
                disable: false,
                valueTemplate: Number.POSITIVE_INFINITY
            };
        },
        // @override
        getInitialState: function () {
            return {
                beOperated: false
            };
        },
        clickHandler: function (e) {

            var min = parseInt(this.props.min, 10);
            var max = parseInt(this.props.max, 10);
            var current = parseInt(this.___getValue___(), 10);
            current = isNaN(current) ? min : current;
           
            var value = e.target.value;
            if (value + '' === current + '' || this.props.disable) return;
            
            var v = 1;
            v = value === 'prev' ? current - 1 : value;
            v = v === 'next' ? current + 1 : v;
            v = parseInt(v, 10);
            v = v < min ? min : v;
            v = v > max ? max : v;

            e.target = this.refs.container;
            e.target.value = v;
            this.___dispatchChange___(e);
            this.setState({beOperated: true});
        },
        render: function () {
            var containerProp = {
                className: 'fcui2-pager ' + this.props.className,
                ref: 'container'
            };
            return (<div {...containerProp}>{produceButtons(this)}</div>);
        }
    });


    function produceButtons(me) {
        var min = parseInt(me.props.min, 10);
        var max = parseInt(me.props.max, 10);
        var threshold = parseInt(me.props.threshold, 10);
        var btns = [];
        var value = parseInt(me.___getValue___(), 10);

        value = isNaN(value) ? min : value;
        value = value < min ? min : value;
        value = value > max ? max: value;
        threshold = isNaN(threshold) || threshold < 1 ? Number.POSITIVE_INFINITY : threshold;

        btns.push(
            <Button label={language.pager.previousPage} value="prev"
                onClick={me.clickHandler} disable={me.props.disable || value <= min} key="prev"/>
        );

        var i = min;
        var before = false;
        var after = false;
        while(i < max + 1) {
            if (i < value - threshold && i !== min) {
                if (!before) {
                    before = true;
                    btns.push(<Button {...prop} label=".." value={value - threshold - 1} key={value - threshold - 1}/>);
                }
                i++;
                continue;
            }
            if (i > value + threshold && i !== max) {
                if (!after) {
                    after = true;
                    btns.push(<Button {...prop} label=".." value={value + threshold + 1} key={value + threshold + 1}/>);
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
            btns.push(<Button {...prop} label={i} value={i} key={i}/>);
            i++;
        }

        btns.push(
            <Button label={language.pager.nextPage} value="next"
                onClick={me.clickHandler} disable={me.props.disable || value >= max} key="next"/>
        );

        return btns;
    }


});
