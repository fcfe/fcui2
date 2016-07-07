define(function (require) {

    var React = require('react');
    var tools = require('../core/regionTools');
    var language = require('../core/language').region;

    return {

        shortCutFactory: function () {
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
        },

        alphaFactory: function () {
            var doms = [];
            var regionAlphabetOrder = tools.regionAlphabetOrder;
            var index = 'a';
            while (index) {
                if (regionAlphabetOrder[index].length > 0) {
                    doms.push(
                        <div className="alphabet-container" key={'alpha-' + index} ref={'alphabet-' + index}>
                            <div className="char-container">{index.toUpperCase()}</div>
                            <div className="region-container">{this.regionFactory(regionAlphabetOrder[index])}</div>
                        </div>
                    );
                }
                if (index === 'z') break;
                index =String.fromCharCode(index.charCodeAt(0) + 1);
            }
            return doms;
        },

        regionFactory: function (arr) {
            var doms = [];
            for (var i = 0; i < arr.length; i++) {
                doms.push(
                    <div className="region-content" key={'region-' + arr[i]}>
                        <div className="region-name-container">
                            <a href="javascript:void(0)" data-ui-value={arr[i]}>
                                {language.regionName[arr[i]] + (tools.filiation[arr[i]] ? ':' : '')}
                            </a>
                        </div>
                        <div className="city-container">{this.cityFactory(tools.filiation[arr[i]])}</div>
                    </div>
                );
            }
            return doms;
        },

        cityFactory: function (arr) {
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
    };

});

