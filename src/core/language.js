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
                cancel: '取消'
            }
        }
    };

    return data[language];
});