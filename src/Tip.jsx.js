/**
 * @file 提示组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var util = require('./core/util');


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
        layerTimer: null,
        layer: null,
        layerShow: function (e) {
            if (!this.layer) {
                this.layer = document.createElement('div');
                this.layer.className = 'fcui2-layer fcui2-tip-layer';
            }
            clearInterval(this.layerTimer);
            var layer = this.layer;
            var container = this.refs.container;
            var layerHTML = [
                '<div class="tip-title">',
                this.props.title,
                '</div>',
                '<div class="tip-content">',
                this.props.content,
                '</div>'
            ];
            layer.innerHTML = layerHTML.join('');
            document.body.appendChild(layer);
            var pos = util.getDOMPosition(container);
            var pWidth = container.offsetWidth;
            var pHeight = container.offsetHeight;
            var lWidth = layer.offsetWidth;
            var lHeight = layer.offsetHeight;
            layer.style.top = ((pos.y - lHeight < 0) ? (pos.top + pHeight) : (pos.top - lHeight)) + 'px';
            layer.style.left =
                ((pos.x + pWidth + lWidth < document.body.offsetWidth) ? (pos.left + pWidth) : (pos.left - lWidth))
                + 'px';
        },
        layerHide: function () {
            if (!this.layer) return;
            var layer = this.layer;
            this.layerTimer = setTimeout(function () {
                try {
                    layer.style.top = '-9999px';
                    document.body.removeChild(layer);
                } catch (e) {

                } 
            }, 200);
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
