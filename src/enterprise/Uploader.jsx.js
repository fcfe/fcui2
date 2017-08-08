/**
 * 文件上传组件
 * @author Sun Wenfei
 * @email sunwenfei@baidu.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var _ = require('underscore');

    var InputWidget = require('../mixins/InputWidget');
    var cTools = require('../core/componentTools');
    var util = require('../core/util');


    // 上传表单默认配置
    var defaultFormProps = {
        action: '/upload.do',
        method: 'post',
        encType: 'multipart/form-data'
    };

    // 上传选择器默认配置
    var defaultInputFileProps = {
        accept: ''
    };

    // 默认上传按钮
    function DefaultUploaderRenderer(props) {
        var url = '';
        try {
            value = JSON.parse(props.value);
            url = value.data.url;
        }
        catch (e) {
            // DO NOTHING
        }
        return (
            <div className="default-uploader">
                {url || '浏览'}
            </div>
        );
    }

    // 实际负责上传的子组件，添加到body中，不可见
    var Upload = React.createClass({
        getDefaultProps: function () {
            return {
                onUploaded: _.noop,
                formData: {},
                uploadConfig: {}
            };
        },
        onUploadInputChange: function (e) {
            if (!e.target.value) return;
            this.refs.uploadForm.submit();
        },
        onIframeLoad: function () {
            var iframe = this.refs.iframe;
            var docBody = iframe.contentDocument.body;
            this.props.onUploaded(docBody.textContent || docBody.innerText);
        },
        componentWillMount: function () {
            this.iframeName = util.uuid();
        },
        render: function () {
            var formProps = {
                ref: 'uploadForm',
                target: this.iframeName,
                action: this.props.uploadConfig.action || defaultFormProps.action,
                method: this.props.uploadConfig.method || defaultFormProps.method,
                encType: this.props.uploadConfig.encType || defaultFormProps.encType
            };
            var uploadInputProps = {
                ref: 'uploadInput',
                name: 'upfile',
                type: 'file',
                onChange: this.onUploadInputChange,
                accept: this.props.uploadConfig.accept || defaultInputFileProps.accept
            };
            var iframeProps = {
                name: this.iframeName,
                ref: 'iframe',
                onLoad: this.onIframeLoad
            };
            var otherField = [];
            if (this.props.formData) {
                for (var key in this.props.formData) {
                    if (!this.props.formData.hasOwnProperty(key)) continue;
                    otherField.push(<input key={key} type="hidden" name={key} value={this.props.formData[key]}/>);
                }
            }
            return (
                <div style={{display: 'none'}}>
                    <form {...formProps}>
                        <input {...uploadInputProps}/>
                        {otherField.length ? otherField : null}
                    </form>
                    <iframe {...iframeProps}></iframe>
                </div>
            );
        }
    });

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
                renderer: DefaultUploaderRenderer,
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
                ReactDOM.render(element, me.uploadContainer, function () {
                    me.uploadElement = this;
                    this.refs.uploadInput.click();
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
            var Renderer = typeof this.props.renderer === 'function' ? this.props.renderer : DefaultUploaderRenderer;
            return (
                <div {...uploaderContainerProps}>
                    <Renderer value={this.___getValue___()} />
                </div>
            );
        }
    });
});
