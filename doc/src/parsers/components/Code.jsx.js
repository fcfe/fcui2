define(function (require) {


    var React = require('react');
    var markdown = require('markdown');
    var tools = require('../../demos/tools');


    function factory(codes, isNotMD) {
        var doms = [];
        for (var i = 0; i < codes.length; i++) {
            var content = isNotMD ? tools.trans2html(codes[i]) : markdown.toHTML(codes[i]);
            doms.push(<div key={i} dangerouslySetInnerHTML={{__html: content}}></div>);
        }
        return doms;
    }


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                codes: [],
                isNotMD: false
            };
        },
        render: function () {
            if (this.props.hasOwnProperty('___isRowSelected___')) {
                return (
                    <td className="td-button" style={this.props.style}>
                        {factory([this.props.content], this.props.isNotMD)}
                    </td>
                );
            }
            return (
                <div className="code-container">
                    {factory(this.props.codes, this.props.isNotMD)}
                </div>
            );
        }
    });
});
