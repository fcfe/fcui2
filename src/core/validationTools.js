define(function (require) {

    return {
        // 将校验配置转成校验对象
        validationFactory: function (validations) {
            if (typeof validations !== 'string') return validations || {};
            var result = {};
            var arr = validations.split(/\,(?![^{\[]*[}\]])/g); // 这个正则是啥意思？
            for (var i = 0; i < arr.length; i++) {
                var args = arr[i].split(':');
                if (args.length < 2) continue;
                var rule = args[0];
                var arg = args[1];
                try {
                    arg = JSON.parse(arg);
                }
                catch (e) {
                    console.error(e);
                }
                result[rule] = arg;
            }
            return result;
        },
        // 检查输入域所在的form是否存在某个回调方法
        isCallbackExist: function (me, callback) {
            var name = me.props.name;
            var form = me.context.___form___;
            if (
                typeof name !== 'string'
                || name.length === 0
                || typeof form !== 'object'
                || typeof form[callback] !== 'function'
            ) {
                return false;
            }
            return true;
        },
        // 根据输入配置和自带配置计算将要校验的配置，取交集；如果不输入，返回所有自带配置
        rulesFactory: function (me, rules) {
            var result = [];
            var validations = me.___validations___; 
            if (typeof rules === 'string') {
                rules = [rules];
            }
            if (rules instanceof Array) {
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    if (validations.hasOwnProperty(rule)) result.push(rule);
                }
            }
            else {
                for (var key in validations) {
                    if (validations.hasOwnProperty(key)) result.push(key);
                }
            }
            return result;
        }
    };

});
