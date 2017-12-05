define(function (require) {

    var React = require('react');
    var Code = require('./components/Code.jsx');

    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                item: {}
            };
        },
        render: function () {
            var item = this.props.item;
            return (
                <div className="introduction-container">
                    <div className="parser-introduction">
                        <h3>{item.description}</h3>
                        <div style={{float: 'right', marginRight: 100}}>{'v' + item.version}</div>
                        <div>{item.author + ' (' + item.email + ')'}</div>
                    </div>
                    {item.note ? <Code codes={[item.note]}/> : null}
                </div>
            );
        }
    });
});
