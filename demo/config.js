define(function (require) {
    return {
        listDatasource: function () {
            return [
                {
                    label:'启动', cmd:'start',
                    datasource: [
                        {
                            label:'启动1', cmd:'start1', disable: Math.random() > 0.5,
                            datasource: [
                                {label:'启动11', cmd:'start11', disable: Math.random() > 0.5},
                                {label:'启动12', cmd:'start12', disable: Math.random() > 0.5},
                                {label:'启动13', cmd:'start13', disable: Math.random() > 0.5}
                            ]
                        },
                        {label:'启动2', cmd:'start2', disable: Math.random() > 0.5},
                        {label:'启动3', cmd:'start3', disable: Math.random() > 0.5},
                        {label:'敢不敢直接启动4', cmd:'start4', disable: Math.random() > 0.5}
                    ]
                },
                {
                    label:'暂停', cmd:'pause', disable: Math.random() > 0.5
                },
                {
                    label:'删除', cmd:'delete', disable: Math.random() > 0.5
                }
            ];
        }
    }
});
