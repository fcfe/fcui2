/**
 * table无数据渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {

    var React = require('react');
    var language = require('../../core/language');

    return React.createClass({
        render: function () {
            return (<div className="table-nodata">{language.table.noData}</div>);
        }
    });

});
