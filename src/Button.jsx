/**
 * 按钮
 * @author Brian Li
 * @version 2.5.0.0
 */
import React, {Component} from 'react';
import BaseContainer from './component/BaseContainer.jsx';
import * as util from './core/util';
import './css/widget/button.less';


export default class Main extends Component {

    static defaultProps = {
        ui: 'button',
        label: 'button',
        title: '',
        icon: '',
        iconLeft: 10,
        type: 'button',
        name: '',
        value: 'asd',
        onClick: util.noop
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        if (this.props.disabled) return;
        e = {target: this.refs.container.refs.container};
        e.target.value = this.props.value;
        this.props.onClick(e);
    }

    render() {
        const containerProps = {
            ref: 'container',
            onClick: this.onClick
        };
        const iconProps = {
            className: 'fcui2-icon ' + this.props.icon,
            style: {
                left: this.props.iconLeft
            }
        };
        const inputProp = {
            type: 'button;submit;reset;'.indexOf(this.props.type + ';') > -1 ? this.props.type : 'button',
            name: this.props.name,
            value: this.props.label,
            disabled: this.props.disabled,
            title: this.props.title
        };
        return (
            <BaseContainer {...this.props} state={this.state} {...containerProps}>
                {this.props.icon.length > 0 ? <div {...iconProps}></div> : null}
                <input {...inputProp}/>
            </BaseContainer>
        );
    }

}
