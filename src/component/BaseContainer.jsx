/**
 * @file 所有组件的跟节点，负责套className和style
 */


import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as util from '../core/util';


export default class Main extends Component {

    static contextTypes = {
        // 系统级别皮肤
        skin: PropTypes.string
    }

    static defaultProps = {
        // 组件皮肤
        skin: 'normal',
        // 组件尺寸
        size: 'normal',
        // 组件根容器外挂样式
        className: '',
        // 组件根容器行内样式
        style: {},
        // 组件state
        state: {},
        // 组件可用状态
        disabled: false,
        // 鼠标移入容器
        onMouseEnter: null,
        // 鼠标移除容器
        onMouseLeave: null,
        // 鼠标按下
        onMouseDown: null,
        // 鼠标抬起
        onMouseUp: null,
        // 鼠标点击
        onClick: null
    }

    getClassName() {
        const ui = this.props.ui ? this.props.ui : 'widget';
        const size = this.props.size ? this.props.size : 'normal';
        const className = [];
        // 基础样式
        className.push('fcui2-' + ui);
        // 尺寸样式
        className.push('fcui2-' + ui + '-size-' + size);
        // 皮肤样式
        const appSkin = this.context.skin ? this.context.skin : 'oneux4';
        const skinClass = ['fcui2', ui, appSkin];
        if (this.props.state.reject) {
            skinClass.push('reject');
        }
        else if (this.props.disabled) {
            skinClass.push('disabled');
        }
        else if (this.props.skin) {
            skinClass.push(this.props.skin)
        }
        else {
            skinClass.push('normal');
        }
        // 导入样式
        className.push(skinClass.join('-'));
        this.props.className && className.push(this.props.className);
        // 导入浏览器
        className.push('browser-' + util.getBrowserType());
        return className.join(' ');
    }

    render() {
        const {style, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onClick} = this.props;
        const props = {
            ref: 'container',
            className: this.getClassName(),
            ...{style, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onClick}     
        };
        return (
            <div {...props}>
                {this.props.children}
            </div>
        );
    }
}
