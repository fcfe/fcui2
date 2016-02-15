define(function (require) {

    var util = require('./core/util');

    return React.createClass({
        getDefaultProps: function () {
            return {
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
            var layer = this.refs.layer.getDOMNode();
            var pos = util.getDOMPosition(e.target);
            var position = pos.x + e.target.offsetWidth + layer.offsetWidth > document.body.offsetWidth
                ? 'left' : 'right';
            position += pos.y  - e.target.offsetHeight - layer.offsetHeight < 0
                ? '-bottom' : '-top';
            this.setState({layerPosition: position});
        },
        render: function () {
            var tip = {
                className: 'fcui2-tip font-icon ' + this.props.icon,
                style: {
                    display: (this.props.title + this.props.content).length > 0 ? 'inline-block' : 'none'
                },
                onMouseEnter: this.fixedLayerPosition
            };
            var layer = {
                className: 'tip-layer ' + this.state.layerPosition,
                ref: 'layer'
            };
            return (
                <div {...tip}>
                    <div {...layer}>
                        <div className="tip-title">{this.props.title}</div>
                        <div className="tip-content" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                    </div>
                </div>
            );
        }
    });
});
