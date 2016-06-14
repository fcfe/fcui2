define(function (require) {


    return {
        formatter: require('js-formatter'),
        trans2html: function (code) {
            while (code.charAt(0) === '\n') code = code.slice(1, code.length);
            return code
                .replace(/"[function]"/g, '[function]')
                .replace(/  /g, '&nbsp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/\n/g, '<br>');
        },
        mergeHandlers: function (prop, me, state, handlers, config) {
            if (typeof handlers !== 'string' && !(handlers instanceof Array)) return;
            handlers = typeof handlers === 'string' ? [handlers] : handlers;
            for (var i = 0; i < handlers.length; i++) {
                var key = handlers[i];
                if (prop.hasOwnProperty(key) || !me.hasOwnProperty(key)) continue;
                if (key === 'onChange') {
                    prop.value = prop.hasOwnProperty('value') ? prop.value : state[config.title];
                    if (config[key] !== false) {
                        prop.onChange = function (e) {
                            var obj = {};
                            obj[config.title] = e.target.value;
                            me.setState(obj);
                            me.onChange(e);
                        };
                    }
                }
                else {
                    if (config[key] !== false) prop[key] = me[key];
                }
            }
        },
        getDisplayProps: function (props) {
            var result = JSON.parse(JSON.stringify(props));
            for (var key in props) {
                if (!props.hasOwnProperty(key)) continue;
                if (typeof props[key] === 'function') {
                    result[key] = '[Function]';
                }
            }
            return JSON.stringify(result);
        }
    };

});
