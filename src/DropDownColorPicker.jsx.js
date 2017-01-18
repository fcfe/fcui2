/**
 * 下拉颜色选择器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.2
 */
define(function (require) {


    var React = require('react');
    var Layer = require('./Layer.jsx');
    var ColorPicker = require('./ColorPicker.jsx');
    var Button = require('./Button.jsx');
    var NormalRenderer = require('./components/dropdownColorPicker/NormalRenderer.jsx');
    var language = require('./core/language');
    var cTools = require('./core/componentTools');
    var tools = require('./core/colorPickerTools');
    var InputWidget = require('./mixins/InputWidget');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {ReactClass} renderer 显示区渲染器
         * @param {String} mode 选择器的工作模式：'font'前景颜色，'background'背景颜色
         * @param {String} layerLocation 下拉框的展开方式，见layer.props.location
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                renderer: NormalRenderer,
                layerLocation: ''
            };
        },
        getInitialState: function () {
            return {
                pickerValue: this.___getValue___(),
                layerOpen: false
            };
        },
        onMainBtnClick: function () {
            this.setState({
                layerOpen: true
            });
        },
        onColorPickerChange: function (e) {
            this.setState({
                pickerValue: e.target.value
            });
        },
        onCancelClick: function () {
            this.setState({
                layerOpen: false
            });
        },
        onEnterClick: function (e) {
            e.target = this.refs.container;
            e.target.value = this.state.pickerValue;
            this.___dispatchChange___(e);
            this.setState({layerOpen: false});
        },
        render: function () {
            var me = this;
            var containerProp = cTools.containerBaseProps('dropdownlist', this);
            var layerProp = {
                isOpen: this.state.layerOpen && !this.props.disabled,
                anchor: this.refs.container,
                location: this.props.layerLocation,
                closeWithBodyClick: true,
                onCloseByWindow: this.onCancelClick,
                skin: this.context.appSkin ? (this.context.appSkin + '-normal') : 'normal'
            };
            containerProp.onClick = this.onMainBtnClick;
            var skin = this.props.skin ? this.props.skin : 'normal';
            skin = this.context.appSkin ? (this.context.appSkin + '-' + skin) : skin;
            containerProp.className += layerProp.isOpen ? (' fcui2-dropdownlist-' + skin + '-hover') : '';
            var Renderer = typeof this.props.renderer === 'function' ? this.props.renderer : NormalRenderer;
            return (
                <div {...containerProp}>
                    <Renderer value={this.___getValue___()} mode={this.props.mode}/>
                    <Layer {...layerProp}>
                        <div className="fcui2-dropdowncolorpicker-container">
                            <ColorPicker value={this.state.pickerValue} onChange={this.onColorPickerChange}/>
                            <Button label={language.arraySelector.enter} skin="important" style={{margin: '0 0 10px 10px'}} onClick={this.onEnterClick}/>
                            <Button label={language.arraySelector.cancel} style={{marginLeft: 10}} onClick={this.onCancelClick}/>
                        </div>
                    </Layer>
                </div>
            );
        }
    });
});
