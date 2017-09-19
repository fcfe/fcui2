/**
 * @file 组件公共工具
 * @author Brian Li
 * @email lbxxlht@163.com
 * @author Han Bing Feng
 */

define(function (require) {

    var Schedule = require('fcui2/Schedule.jsx');
    var Creater = require('./Main.jsx');

    function strToArray(str) {
        var arr = str.split('');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i] === '0' ? null : (arr[i] + '');
            arr[i] = arr[i] === '1' ? '' : arr[i];
        }
        return JSON.stringify(arr);
    }

    var items = [
        {
            title: 'Normal Schedule',
            props: {}
        },
        {
            title: 'Readonly Schedule',
            props: {
                value: strToArray('111000000aaaaa0006666010000077777770011110001111111111001111')
            }
        },
        {
            title: 'Disabled Schedule',
            props: {
                disabled: true,
                value: strToArray('111000000111110001011010000011111110011110001111111111001111')
            }
        },
        {
            title: 'Schedule with valuePrepare',
            props: {
                value: strToArray('111000000aaaaa0006666010000077777770011110001111111111001111'),
                prepare: function (param) {
                    if (param.text + '' === '7') {
                        param.style.backgroundColor = 'red';
                    }
                    if (param.text + '' === '6') {
                        param.style.backgroundColor = 'green';
                    }
                }
            }
        },
        {
            title: 'Schedule with selectors',
            props: {
                flags: {
                    enableRowSelector: true,
                    enableColumnSelector: true
                }
            }
        }
    ];

    return Creater(Schedule, items, 'onChange');
});
