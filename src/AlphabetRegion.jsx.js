/**
 * 字母序地域选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');


    var util = require('./core/util');
    var tools = require('./core/regionTools');
    var cTools = require('./core/componentTools');
    var language = require('./core/language').region;


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Function} onClick 响应回调
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
            e.target = this.refs.container;
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
            return (
                <div {...cTools.containerBaseProps('alphabet-region', this)}>
                    <div className="short-cut-container" onClick={this.onAnchorClick}>
                        {shortCutFactory()}
                    </div>
                    <div className="content-container" ref="contentContainer" onClick={this.onRegionClick}>
                        {alphaFactory()}
                    </div>
                </div>
            );
        }
    });

    
    function shortCutFactory() {
        var doms = [];
        var regionAlphabetOrder = tools.regionAlphabetOrder;
        var index = 'a';
        while (index) {
            if (regionAlphabetOrder[index].length > 0) {
                doms.push(
                    <a href="javascript:void(0)" key={'char-' + index} data-ui-value={index}>
                        {index.toUpperCase()}
                    </a>
                );
            }
            if (index === 'z') break;
            index =String.fromCharCode(index.charCodeAt(0) + 1);
        }
        return doms;
    }


    function alphaFactory() {
        var doms = [];
        var regionAlphabetOrder = tools.regionAlphabetOrder;
        var index = 'a';
        while (index) {
            if (regionAlphabetOrder[index].length > 0) {
                doms.push(
                    <div className="alphabet-container" key={'alpha-' + index} ref={'alphabet-' + index}>
                        <div className="char-container">{index.toUpperCase()}</div>
                        <div className="region-container">{regionFactory(regionAlphabetOrder[index])}</div>
                    </div>
                );
            }
            if (index === 'z') break;
            index =String.fromCharCode(index.charCodeAt(0) + 1);
        }
        return doms;
    }


    function regionFactory(arr) {
        var doms = [];
        for (var i = 0; i < arr.length; i++) {
            doms.push(
                <div className="region-content" key={'region-' + arr[i]}>
                    <div className="region-name-container">
                        <a href="javascript:void(0)" data-ui-value={arr[i]}>
                            {language.regionName[arr[i]] + (tools.filiation[arr[i]] ? ':' : '')}
                        </a>
                    </div>
                    <div className="city-container">{cityFactory(tools.filiation[arr[i]])}</div>
                </div>
            );
        }
        return doms;
    }


    function cityFactory(arr) {
        if (!(arr instanceof Array)) return (<span>&nbsp;</span>);
        var doms = [];
        for (var i = 0; i < arr.length; i++) {
            doms.push(
                <a href="javascript:void(0)" key={'city-' + arr[i]} data-ui-value={arr[i]}>
                    {language.regionName[arr[i]]}
                </a>
            );
        }
        return doms;
    }


});

