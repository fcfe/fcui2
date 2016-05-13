/**
 * @file 列表组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var util = require('./core/util');
    var MouseWidgetBase = require('./mixins/MouseWidgetBase');

    /**
     * 下拉列表默认内容
     * @param {Object} props the props
     * @return {ReactElement} rendered element
     */
    var NormalRenderer = function (props) {
        return (
            <span {...props.style}>{props.label}</span>
        );
    };

    return React.createClass({
        // @override
        mixins: [MouseWidgetBase],
        propTypes: {
            /**
             * 下拉列表内容
             * @param {Object} props the props
             * @return {ReactElement} rendered element
             */
            'optionRenderer': React.PropTypes.func
        },
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                width: NaN,
                datasource: [],  // {label: <string>, value: <string>, disabled: <boolean>, children: [self]}
                disabled: false,
                onClick: function () {},
                onMouseLeave: function () {},
                optionRenderer: NormalRenderer
            };
        },
        // @override
        componentDidMount: function () {
            if (
                this.props.parent
                && this.props.parent.refs.container
                && this.props.parent.refs.container.offsetWidth
            ) {
                this.refs.container.style.minWidth = this.props.parent.refs.container.offsetWidth - 2 + 'px';
            }
        },
        // @override
        getInitialState: function () {
            return {};
        },
        clickHandler: function (e) {
            while (e.target && !e.target.getAttribute('data-ui-cmd')) {
                e.target = e.target.parentNode;
            }
            var dataset = util.getDataset(e.target);
            if (dataset.uiDisabled + '' === 'true' || !dataset.uiCmd || this.props.disabled) return;
            e.target.value = dataset.uiCmd;
            this.props.onClick(e);
            // 必须stop掉，否则外部如果用了onClick，会触发两次
            e.stopPropagation();
        },
        render: function () {
            var me = this;
            var containerProps = {
                ref: 'container',
                className: 'fcui2-list ' + me.props.className,
                onMouseEnter: this.___mouseenterHandler___,
                onMouseLeave: this.___mouseleaveHandler___,
                onClick: this.clickHandler
            };
            if (!isNaN(this.props.width)) {
                containerProps.style = {width: this.props.width};
            }
            return (
                <div {...containerProps}>
                    {listFactory(this.props.datasource, '0', this.props.disabled, this.props.width, me)}
                </div>
            );
        }
    });


    function listFactory(datasource, level, disabled, width, target) {
        if (datasource.length === 0) return <div></div>;
        var result = [];
        for (var index = 0; index < datasource.length; index++) {
            var treeIndex = level + '-' + index;
            var item = datasource[index];
            if (item.hr) {
                result.push(<hr key={treeIndex}/>);
                continue;
            }
            var children = item.children instanceof Array ? item.children : [];
            var itemProp = {
                className: 'item' + (item.disabled || disabled ? ' disabled' : ''),
                key: treeIndex,
                'data-ui-disabled': item.disabled || disabled,
                'data-ui-cmd': item.value,
                'data-tree-index': treeIndex
            };
            var spanProp = {
                'data-ui-disabled': item.disabled || disabled,
                'data-ui-cmd': item.value,
                'data-tree-index': treeIndex
            };
            var rightArrowProp = {
                className: 'icon-right font-icon font-icon-largeable-caret-right',
                style: {
                    visibility: children.length > 0 ? 'visible' : 'hidden'
                }
            };
            var rightLayerProp = {
                className: 'layer ' + (children.length > 0 ? 'right-layer' : 'disabled-layer')
            };
            if (children.length > 0) {
                spanProp.style = {
                    marginRight: 20
                }
            }
            if (!isNaN(width)) {
                itemProp.style = {width: width};
            }
            var OptionRenderer = target.props.optionRenderer;
            result.push(
                <div {...itemProp}>
                    <div {...rightArrowProp}></div>
                    <OptionRenderer {...item} {...spanProp} />
                    <div {...rightLayerProp}>{listFactory(children, treeIndex, disabled, width, target)}</div>
                </div>
            );
        }
        return result;
    }


});
