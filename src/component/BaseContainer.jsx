/**
 * @file 所有组件的跟节点，负责套className和style
 */


import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class Main extends Component {

    static contextTypes = {
        skin: PropTypes.string
    }

    static defaultProps = {
        skin: 'normal',
        size: 'normal',
        className: '',
        style: {}
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
        const appSkin = this.context.skin ? this.context.skin : 'default';
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
        return className.join(' ');
    }

    render() {
        return (
            <div className={this.getClassName()} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}
