define(function (require) {

    var language = 'ch';
    var data = {
        ch: {
            pager: {
                previousPage: '上一页',
                nextPage: '下一页'
            },
            button: {
                enter: '确定',
                cancel: '取消',
                fresh: '刷新'
            },
            tableSelector: {
                selectAll: '选择全部',
                selectCurrentPage: '选择当前页'
            },
            table: {
                noData: '没有数据'
            }
        }
    };

    return data[language];
});