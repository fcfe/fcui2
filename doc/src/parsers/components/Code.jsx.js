define(function (require) {


    var React = require('react');


    function trans(code) {
        while (code.charAt(0) === '\n') code = code.slice(1, code.length);
        return code
            .replace(/  /g, '&nbsp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/\n/g, '<br>');
    }


    function factory(codes) {
        var doms = [];
        for (var i = 0; i < codes.length; i++) {
            doms.push(<div key={i} dangerouslySetInnerHTML={{__html: trans(codes[i])}}></div>);
        }
        return doms;
    }


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                codes: []
            };
        },
        render: function () {
            return (<div className="code-container">{factory(this.props.codes)}</div>);
        }
    });
});
