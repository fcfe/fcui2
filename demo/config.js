define(function (require) {
    return {
        listSelector: [
            {key: '1', label: 'Node1'},
            {key: '2', label: 'Node2'},
            {key: '3', label: 'Node3'},
            {key: '4', label: 'Node4'},
            {key: '5', label: 'Node5'},
            {key: '6', label: 'Node6'},
            {key: '7', label: 'Node7'},
            {key: '8', label: 'Node8'},
            {key: '9', label: 'Node9'},
            {key: '10', label: 'Node10'},
            {key: '11', label: 'Node11'},
            {key: '12', label: 'Node12'}
        ],
        listDatasource: function () {
            return [
                {
                    label:'启动', value:'start',
                    datasource: [
                        {
                            label:'启动1', value:'start1', disable: Math.random() > 0.5,
                            datasource: [
                                {label:'启动11', value:'start11', disable: Math.random() > 0.5},
                                {label:'启动12', value:'start12', disable: Math.random() > 0.5},
                                {label:'启动13', value:'start13', disable: Math.random() > 0.5}
                            ]
                        },
                        {label:'启动2', value:'start2', disable: Math.random() > 0.5},
                        {label:'启动3', value:'start3', disable: Math.random() > 0.5},
                        {label:'敢不敢直接启动4', value:'start4', disable: Math.random() > 0.5}
                    ]
                },
                {
                    label:'暂停', value:'pause', disable: Math.random() > 0.5
                },
                {
                    label:'删除', value:'delete', disable: Math.random() > 0.5
                }
            ];
        },
        selectData: function () {
            return [
                {label: '选项1', value: '12'},
                {label: '选项2', value: '13'},
                {label: '选项3', value: '14'},
                {label: '这块有一个很长很长的选项4', value: '15', disable: true},
                {label: '选项5', value: '16'},
                {label: '选项6', value: '17'},
                {label: '选项7', value: '18'},
                {label: '选项8', value: '19'}
            ];
        }
    }
});
