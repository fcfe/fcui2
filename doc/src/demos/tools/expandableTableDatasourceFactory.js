define(function (require) {

    var datasource = require('./tableDatasource');

    return function (filter) {
        var header = datasource[0];
        var data = [];
        for (var i = 0; i < 4; i++) {
            var newHeader = JSON.parse(JSON.stringify(header));
            newHeader.expandId = i + '';
            data.push(newHeader);
            if (i + '' !== filter) continue;
            var newItems = JSON.parse(JSON.stringify(datasource));
            for (var j = 0; j < newItems.length; j++) {
                newItems[j].expandId = i + '-' + j;
                data.push(newItems[j]);
            }
        }
        return data;
    }

});
