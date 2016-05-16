/**
 * @file 提示组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var util = require('./core/util');
    var Layer = require('./Layer.jsx');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                title: '',
                content: '',
                icon: 'font-icon-hint-question-s'
            }
        },
        getInitialState: function () {
            return {
                layerOpen: false
            };
        },
        showLayer: function () {
            this.setState({layerOpen: true});
        },
        hideLayer: function () {
            this.setState({layerOpen: false});
        },
        offsetLayerPosition: function (result) {
            result.left += result.isLeft ? -15 : 10;
            result.top += result.isTop ? -5 : 10; 
        },
        render: function () {
            var tipProp = {
                className: this.props.className + ' fcui2-tip font-icon ' + this.props.icon,
                onMouseEnter: this.showLayer,
                onMouseLeave: this.hideLayer,
                ref: 'container'
            };
            var layerProp = {
                isOpen: this.state.layerOpen && (this.props.title || this.props.content),
                anchor: this.refs.container,
                location: 'right left top bottom',
                onOffset: this.offsetLayerPosition
            };
            return (
                <div {...tipProp}>
                    <Layer {...layerProp}>
                        <div className="fcui2-tip-layer">
                            <div className="tip-title">{this.props.title}</div>
                            <div className="tip-content" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                        </div>
                    </Layer>
                </div>
            );
        }
    });


});
