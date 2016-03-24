/**
 * @file 地域选择组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');
    var CheckBox = require('./CheckBox.jsx');
    var RegionProvince = require('./components/RegionProvince.jsx');


    var util = require('./core/util');
    var tools = require('./core/regionTools');
    var language = require('./core/language').region;


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                disable: false,
                valueTemplate: '742,743,744,745,746,747,748,749,750,751,752,753,'
                    + '754,755,756,757,758,759,1,760,761,763,765,766,767,768,769,'
                    + '770,771,772,773,774,776,777,900,3,413,414,415,416,417,418,'
                    + '419,421,422,423,424,425,426,427,23,307,309,146'
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            var value = this.___getValue___();
            // var cAxis = tools.gridAxis(this.state.mouseCurrentX, this.state.mouseCurrentY);
            // var dragLayerProp = {
            //     onMouseDown: this.optDownHandler,
            //     onMouseUp: this.optUpHandler,
            //     onMouseMove: this.optMoveHandler,
            //     onMouseLeave: this.optLeaveHandler
            // };
            // var titleProp = {
            //     style: tools.titleLayerSize(cAxis, this.state.mouseDownX > -1 || this.state.mouseCurrentX < 0)
            // };
            return (
                <div className={'fcui2-region ' + this.props.className} ref="container">
                    {countryFactory([90, 999, 0], value, this)}
                </div>
            );
        }
    });


    function countryFactory(arr, value, me) {
        value = tools.parseValue(value);
        var doms = [];
        for (var i = 0; i < arr.length; i++) {
            doms.push(
                <div key={arr[i]} className="country-area">
                    <div className="country-title">
                        <CheckBox label={language.regionName[arr[i]]} labelPosition="right" />
                    </div>
                    <div>
                        {regionFactory(tools.config[arr[i]], value, me)}
                    </div>
                </div>
            );
        }
        return doms;
    }


    function regionFactory(arr, value, me) {
        if (!arr) return '';
        var doms = [];
        for (var i = 0; i < arr.length; i++) {
            doms.push(
                <div key={arr[i]} className="region-area">
                    <div className="region-left-container">
                        <CheckBox label={language.regionName[arr[i]]} labelPosition="right" />
                    </div>
                    <div className="region-right-container">
                        {provinceFactory(tools.config[arr[i]], value, me)}
                    </div>
                </div>
            );
        }
        return doms;
    }


    function provinceFactory(arr, value, me) {
        if (!arr) return '';
        var doms = [];
        for (var i = 0; i < arr.length; i++) {
            doms.push(<RegionProvince key={arr[i]} id={arr[i]}/>);
        }
        return doms;
    }


});
