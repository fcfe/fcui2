define(function (require) {

    var React = require('react');
    var util = require('./core/util.es6');

    return React.createClass({
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
                layerPosition: 'layer-left'
            };
        },
        fixedLayerPosition: function (e) {
            var layer = this.refs.layer;
            var pos = util.getDOMPosition(e.target);
            var position = pos.x + e.target.offsetWidth + layer.offsetWidth > document.body.offsetWidth
                ? 'left' : 'right';
            position += pos.y  - e.target.offsetHeight - layer.offsetHeight < 0
                ? '-bottom' : '-top';
            this.setState({layerPosition: position});
        },
        render: function () {
            var tip = {
                className: this.props.className + ' fcui2-tip font-icon ' + this.props.icon,
                style: {
                    display: (this.props.title + this.props.content).length > 0 ? 'inline-block' : 'none'
                },
                onMouseEnter: this.fixedLayerPosition
            };
            var layerProp = {
                className: 'tip-layer ' + this.state.layerPosition,
                ref: 'layer'
            };
            return (
                <div {...tip}>
                    <div {...layerProp}>
                        <div className="tip-title">{this.props.title}</div>
                        <div className="tip-content" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                    </div>
                </div>
            );
        }
    });
});
