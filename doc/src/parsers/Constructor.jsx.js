define(function (require) {


    var React = require('react');
    var Params = require('./components/Params.jsx');
    var classitems = require('../config').items;


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                item: {}
            };
        },
        render: function () {
            return (
                <div className="parser-constructor">
                    constructor
                </div>
            );
        }
    });
});
