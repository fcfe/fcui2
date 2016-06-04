/**
 *  提示组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var util = require('./core/util');
    var Layer = require('./Layer.jsx');
    var cTools = require('./core/componentTools');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
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
        offsetLayerPosition: function (result) {
            result.left += result.isLeft ? -15 : 10;
            result.top += result.isTop ? -5 : 10; 
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('tip', this, {
                merge: {
                    onMouseEnter: cTools.openLayerHandler.bind(this),
                    onMouseLeave: cTools.closeLayerHandler.bind(this),
                },
                style: (this.props.title || this.props.content) ? undefined : {display: 'none'}
            });
            var layerProp = {
                isOpen: this.state.layerOpen && (this.props.title || this.props.content) && !this.props.disabled,
                anchor: this.refs.container,
                location: 'right left top bottom',
                onOffset: this.offsetLayerPosition
            };
            containerProp.className += ' font-icon ' + this.props.icon;
            return (
                <div {...containerProp}>
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
