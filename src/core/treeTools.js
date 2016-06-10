

define(function (require) {
    
    return {
        getLeafItem: function (datasource, indexs) {
            var result = datasource;
            for (var i = 0; i < indexs.length; i++) {
                var index = parseInt(indexs[i], 10);
                if (isNaN(index)) continue;
                if (result instanceof Array) {
                    result = result[index];
                    continue;
                }
                else if (result.children instanceof Array && result.children.length > index) {
                    result = result.children[index];
                }
            }
            return result;
        }
    };   
});
