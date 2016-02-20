define(function (require) {

    var React = require('react');
    var util = require('./core/util.es6');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                title: '',
                content: '',
                icon: 'font-icon-hint-question-s',
                layer: document.createElement('div')
            }
        },
        // @override
        componentDidMount: function () {
            this.props.layer.className = 'fcui2-layer fcui2-tip-layer';
        },
        layerShow: function (e) {
            var layer = this.props.layer;
            var container = this.refs.container;
            layer.innerHTML = ''
                + '<div class="tip-title">'
                + this.props.title
                + '</div>'
                + '<div class="tip-content">'
                + this.props.content
                + '</div>';
            document.body.appendChild(layer);
            setTimeout(show, 200);
            function show() {
                var pos = util.getDOMPosition(container);
                var pWidth = container.offsetWidth;
                var pHeight = container.offsetHeight;
                var lWidth = layer.offsetWidth;
                var lHeight = layer.offsetHeight;
                layer.style.top =
                    ((pos.y - lHeight < 0) ? (pos.y + pHeight) : (pos.y - lHeight))
                    + 'px';
                layer.style.left =
                    ((pos.x + pWidth + lWidth < document.body.offsetWidth) ? (pos.x + pWidth) : (pos.x - lWidth))
                    + 'px';
            }  
        },
        layerHide: function () {
            var layer = this.props.layer;
            layer.style.top = '-9999px';
            try {
                document.body.removeChild(this.props.layer);
            } catch (e) {

            } 
        },
        render: function () {
            var tip = {
                className: this.props.className + ' fcui2-tip font-icon ' + this.props.icon,
                style: {
                    display: (this.props.title + this.props.content).length > 0 ? 'inline-block' : 'none'
                },
                onMouseEnter: this.layerShow,
                onMouseLeave: this.layerHide,
                ref: 'container'
            };
            return (<div {...tip}></div>);
        }
    });
});
