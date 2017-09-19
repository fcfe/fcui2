/**
 * 文件上传组件
 * @author Sun Wenfei
 * @email sunwenfei@baidu.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');

    var Button = require('../Button.jsx');
    var Upload = require('../components/uploader/UploaderCore.jsx');
    var InputWidget = require('../mixins/InputWidget');
    var cTools = require('../core/componentTools');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js className style disabled skin
         * @param {ReactComponent} renderer value的渲染组件
         * @param {Object} formData 随文件一同传回服务器的数据对象
         * @param {Object} uploadConfig 文件上传配置
         * @param {String} uploaderConfig.action 服务器上传脚本路径，等同于form的action属性，默认/upload.do
         * @param {String} uploaderConfig.method 上传方式，等同于form的method属性，默认post
         * @param {String} uploaderConfig.encType 上传类型，等同于form的encType属性，默认multipart/form-data
         * @param {String} uploaderConfig.accept 可选择文件类型，等同于input的accept属性，默认''
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        mixins: [InputWidget],

        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                valueTemplate: '',
                renderer: defaultUploaderRenderer,
                formData: {},
                uploadConfig: {}
            };
        },

        getInitialState: function () {
            return {};
        },

        componentDidMount: function () {
            this.uploadElement = null;
            this.uploadContainer = null;
        },

        onUploaderClick: function (e) {
            if (this.props.disabled) return;
            var me = this;
            if (!me.uploadElement || !me.uploadContainer) {
                var element = React.createElement(Upload, {
                    formData: this.props.formData,
                    onUploaded: this.onUploaded,
                    uploadConfig: this.props.uploadConfig || {}
                });
                me.uploadContainer = document.createElement('div');
                document.body.appendChild(me.uploadContainer);
                me.uploadElement = ReactDOM.render(element, me.uploadContainer, function () {
                    if (this) me.uploadElement = this;
                    setTimeout(function () {
                        me.uploadElement.refs.uploadInput.click();
                    }, 0);
                });
            }
            else {
                this.uploadElement.refs.uploadInput.click();
            }
        },

        onUploaded: function (result) {
            if (!result) {return;}
            this.refs.container.value = result;
            this.___dispatchChange___({target: this.refs.container});
            ReactDOM.unmountComponentAtNode(this.uploadContainer);
            document.body.removeChild(this.uploadContainer);
            this.uploadElement = null;
            this.uploadContainer = null;
        },

        render: function () {
            var uploaderContainerProps = cTools.containerBaseProps('uploader', this, {
                merge: {
                    onClick: this.onUploaderClick
                }
            });
            var Renderer = typeof this.props.renderer === 'function' ? this.props.renderer : defaultUploaderRenderer;
            return (
                <div {...uploaderContainerProps}>
                    <Renderer value={this.___getValue___()} {...this.props}/>
                </div>
            );
        }
    });


    function defaultUploaderRenderer(props) {
        var url = '';
        try {
            value = JSON.parse(props.value);
            url = value.data.url;
        }
        catch (e) {
            // DO NOTHING
        }
        var buttonProps = {
            icon: 'fcui2-icon fcui2-icon-upload',
            label: '    文件上传'
        };
        return (
            <div>
                {url ? url : <Button {...buttonProps}/>}
            </div>
        );
    }


});
