define(function (require) {


    // 所有块解析器
    var DefaultParser = require('./parsers/DefaultParser.jsx');
    var Introduction = require('./parsers/Introduction.jsx');


    /**
     * 块解析器分析机
     */
    return function (item) {
        return DefaultParser;
    };

});
