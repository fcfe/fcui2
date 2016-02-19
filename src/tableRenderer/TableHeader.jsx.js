define(function (require) {

    var Tip = require('../Tip.jsx');
    var React = require('react');

    return React.createClass({
        getInitialState: function () {
            return {
                sortType: '' // 'asc', 'desc', ''
            };
        },
        sortHandler: function () {
            var sortType = this.state.sortType;
            sortType = sortType === 'desc' ? 'asc' : 'desc';
            this.setState({sortType: sortType});
            if (typeof this.props.onSort === 'function') {
                this.props.onSort({
                    field: this.props.field,
                    sortType: sortType
                });
            }
        },
        render: function () {
            var sortButtonProp = {
                className: 'sort-button font-icon ' + (
                    this.state.sortType === 'asc'
                        ? 'font-icon-largeable-arrow-up' : 'font-icon-largeable-arrow-down'
                ),
                style: {
                    display: this.props.sortAble ? 'inline-block' : 'none',
                    color: (this.props.sortField !== this.props.field || this.state.sortType === '') ? 'grey' : '#2F82F5'
                },
                onClick: this.sortHandler
            };
            var tdProp = {
                style: {
                    textAlign: this.props.align || 'left'
                }
            };
            if (typeof this.props.width === 'number') {
                tdProp.style.width = this.props.width;
            }
            return (
                <td {...tdProp}><div>
                    <span style={{fontWeight: 700}}>{this.props.label}</span>
                    <Tip title={this.props.tipTitle} content={this.props.tipContent}/>
                    <div {...sortButtonProp}></div>
                </div></td>
            );
        }
    });
}); 