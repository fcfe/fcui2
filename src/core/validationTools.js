/**
 * 校验工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 * @note
 * 此工具集被src\mixins\InputWidget.js使用
 */
define(function (require) {

    return {
        /**
         * 校验配置工厂。如果传入字符串，尝试用JSON.parse将字符串转成对象，否则什么都不做。
         * @interface validationFactory
         * @param {Object|String} validations 校验配置
         * @return {Object} 校验机对象
         */
        validationFactory: function (validations) {
            if (typeof validations !== 'string') return validations || {};
            var result = {};
            try {
                result = JSON.parse(validations);
            }
            catch (e) {
                console.error(e);
            }
            return result;
        },
        /**
         * 检查input组件的外层表单实例上有没有某个方法
         * @interface isCallbackExist
         * @param {ReactComponent} me Input类型组件，这种类型的组件引入的InputWidget mixin
         * @param {String} callback 方法名称
         * @return {Boolean} 检查结果，input组件外层没有form或input组件没有配置name属性或form中没有命为callback的方法，都返回false
         */
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
        /**
         * 校验准则工厂
         * @interface rulesFactory
         * @param {ReactComponent} me Input类型组件
         * @param {String|Array.<String>} rules 校验名称集
         * @return {Array.<String>} 校验机中存在的校验准则序列，rules中存在但组件校验机中不存在的准则名称将被过滤
         */
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
