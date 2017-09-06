/**
 * 字母序地域选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');

    var util = require('./core/util');
    var cTools = require('./core/componentTools');
    var factory = require('./factories/alphabetRegionFactory.jsx');

    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Function} onClick 响应回调
         */
        /**
         * @fire Import src\Button.jsx.js button onClick
         */
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                onClick: cTools.noop
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onRegionClick: function (e) {
            var dataset = util.getDataset(e.target);
            if (!dataset.uiValue || this.props.disabled) return;
            e = {target: this.refs.container};
            e.target.value = dataset.uiValue;
            typeof this.props.onClick === 'function' && this.props.onClick(e);
        },
        onAnchorClick: function (e) {
            var dataset = util.getDataset(e.target);
            if (!dataset.uiValue || this.props.disabled) return;
            var container = this.refs['alphabet-' + dataset.uiValue];
            if (!container) return;
            this.refs.contentContainer.scrollTop = container.offsetTop - this.refs['alphabet-a'].offsetTop;
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('alphabet-region', this);
            var contentProp = {
                className: 'content-container',
                ref: 'contentContainer',
                onClick: this.onRegionClick,
                style: {
                    height: containerProp.style.height
                }
            };
            delete containerProp.style.height;
            return (
                <div {...containerProp}>
                    <div className="short-cut-container" onClick={this.onAnchorClick}>
                        {factory.shortCutFactory()}
                    </div>
                    <div {...contentProp}>
                        {factory.alphaFactory()}
                    </div>
                </div>
            );
        }
    });

});

