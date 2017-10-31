define(function (require) {

    var React = require('react');
    var tools = require('../core/regionTools');
    var language = require('../core/language').region;

    return {

        shortCutFactory: function shortCutFactory() {
            var doms = [];
            var regionAlphabetOrder = tools.regionAlphabetOrder;
            var index = 'a';
            while (index) {
                if (regionAlphabetOrder[index].length > 0) {
                    doms.push(React.createElement(
                        'a',
                        { href: 'javascript:void(0)', key: 'char-' + index, 'data-ui-value': index },
                        index.toUpperCase()
                    ));
                }
                if (index === 'z') break;
                index = String.fromCharCode(index.charCodeAt(0) + 1);
            }
            return doms;
        },

        alphaFactory: function alphaFactory() {
            var doms = [];
            var regionAlphabetOrder = tools.regionAlphabetOrder;
            var index = 'a';
            while (index) {
                if (regionAlphabetOrder[index].length > 0) {
                    doms.push(React.createElement(
                        'div',
                        { className: 'alphabet-container', key: 'alpha-' + index, ref: 'alphabet-' + index },
                        React.createElement(
                            'div',
                            { className: 'char-container' },
                            index.toUpperCase()
                        ),
                        React.createElement(
                            'div',
                            { className: 'region-container' },
                            this.regionFactory(regionAlphabetOrder[index])
                        )
                    ));
                }
                if (index === 'z') break;
                index = String.fromCharCode(index.charCodeAt(0) + 1);
            }
            return doms;
        },

        regionFactory: function regionFactory(arr) {
            var doms = [];
            for (var i = 0; i < arr.length; i++) {
                doms.push(React.createElement(
                    'div',
                    { className: 'region-content', key: 'region-' + arr[i] },
                    React.createElement(
                        'div',
                        { className: 'region-name-container' },
                        React.createElement(
                            'a',
                            { href: 'javascript:void(0)', 'data-ui-value': arr[i] },
                            language.regionName[arr[i]] + (tools.filiation[arr[i]] ? ':' : '')
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'city-container' },
                        this.cityFactory(tools.filiation[arr[i]])
                    )
                ));
            }
            return doms;
        },

        cityFactory: function cityFactory(arr) {
            if (!(arr instanceof Array)) return React.createElement(
                'span',
                null,
                '\xA0'
            );
            var doms = [];
            for (var i = 0; i < arr.length; i++) {
                doms.push(React.createElement(
                    'a',
                    { href: 'javascript:void(0)', key: 'city-' + arr[i], 'data-ui-value': arr[i] },
                    language.regionName[arr[i]]
                ));
            }
            return doms;
        }
    };
});