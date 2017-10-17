/**
 * 实际负责上传的子组件，添加到body中，不可见
 * @author Sun Wenfei
 * @email sunwenfei@baidu.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var util = require('../../core/util');


    // 上传表单默认配置
    var defaultFormProps = {
        action: '/upload.do',
        method: 'post',
        encType: 'multipart/form-data'
    };


    return React.createClass({
        getDefaultProps: function () {
            return {
                onUploaded: util.noop,
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
                accept: this.props.uploadConfig.accept || ''
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


});
