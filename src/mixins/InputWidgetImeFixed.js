/**
 * 文本输入组件输入法hack mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 * @note
 * ###说明文档
 * #####1 mixin解决的问题
 * React设计理念是单向数据流，FCUI2也遵守这一原则。即input类型组件如果配置了value（或checked）属性，未配置onChange属性，
 * 那这个组件是只读的。这种单向数据流的设计模式让应用架构变得更简单，同时让程序鲁棒性更高。但对于文本输入类组件，如
 * TextBox或TextArea，这种模式会带来一个很严重的问题，在某些情况下，无法使用IME输入法输入。
 * #####2 问题产生原因
 * React中，input组件的value要存放在外部，父级的state中、某个祖先的state中或整个应用的外部。通过props.value导入给组件，
 * 组件被操作后派发onChange回调，通知外部修改value的源头，然后回来重新渲染，这也是MVVM的要求。
 * React为了避免频繁setState带来性能问题，内部使用了异步渲染机制。但正是由于异步渲染，用户输入时派发onChange，
 * 外部经过一段时间，把value写回，这打断了IME输入法的连续性，输入法中存储的临时内容被清空，无法正常输入。
 * 上面说的“某些情况”，具体说就是最终存储value源头的地方离input组件比较远，中间React比对虚拟dom树用了相当一段时间，
 * 超出了输入法容忍的范围。下面是个抽象模型：
 *
 *      <body>
 *          <input type="text" id="inputbox"/>
 *      </body>
 *      <script type="text/javascript">
 *          var box = document.getElementById('inputbox');
 *          box.addEventListener('keyup', function (e) {
 *              var target = e.target;
 *              var value = e.target.value;
 *              console.log(value);
 *              setTimeout(function () {
 *                  e.target.value = value + '';
 *               }, 100);
 *          });
 *      </script>
 * #####3 问题解决方法
 * input有三个比较特殊的事件：compositionstart、compositionend、compositionupdate，
 * 分别表示输入法开始输入、完成输入上屏、输入更新，触发顺序是：start、update、update...update、end。
 * 解决方法是手动阻断onChange派发，在compositionstart和compositionend中修改一个开关，在onChange中判断这个开关，
 * 只在输入完毕后派发事件。
 * #####4 this实例注入
 * * this.___lastFiredValue___ {String|Number|Boolean} 组件上一次派发出去的值，避免重复派发
 * * this.___lastCursorPos___ {Number} 组件上次keyup后光标位置
 * * this.___imeStart___ {Boolean} 输入法是否处于输入状态
 * * this.___isPressing___ {Boolean} 键盘是否正在敲击
 * #####5 需要手动绑定到原生DOM的事件，mixin通过这些事件重新描述了onChange派发规则
 * * this.___onCompositionStart___，对应onCompositionStart事件
 * * this.___onCompositionEnd___，对应onCompositionEnd事件
 * * this.___onKeyDown___，对应onKeyDown事件
 * * this.___onKeyUp___，对应onKeyUp事件
 * * this.___onPaste___，对应onPaste事件
 */
define(function (require) {

    var util = require('../core/util');

    return {
        // @override
        componentDidMount: function () {
            var value = this.___getValue___();
            this.refs.inputbox.value = value;
            this.___lastFiredValue___ = value;
            this.___lastCursorPos___ = -1;
            this.___imeStart___ = false;
            this.___isPressing___ = false;
            this.___workerTimer___ = null;
        },
        // @override
        componentWillReceiveProps: function (nextProps) {
            this.___syncValue___(nextProps);  
        },
        ___syncValue___: function (props) {
            // 键盘keyup过了一段时间，但是外部还没有刷新组件，手动同步一下value
            props = props || this.props;
            var value = props.value;
            // 外部没有导入value或导入的value和输入框的相同
            if (typeof value !== 'string' || value === this.refs.inputbox.value) return;
            this.___lastFiredValue___ = value;
            this.setState({___value___: value});
            this.refs.inputbox.value = value;
            if (this.___lastCursorPos___ > -1 && this.___lastCursorPos___ < value.length) {
                util.setCursorPosition(this.refs.inputbox, this.___lastCursorPos___);
            }
        },
        ___onCompositionStart___: function (e) {
            this.___imeStart___ = true;
        },
        ___onCompositionEnd___: function (e) {
            this.___imeStart___ = false;
        },
        ___onKeyDown___: function (e) {
            this.___isPressing___ = true;
        },
        ___onKeyUp___: function (e) {
            this.___isPressing___ = false;
            this.___lastCursorPos___ = util.getCursorPosition(e.target);
            clearInterval(this.___workerTimer___);
            if (this.___imeStart___ || this.___lastFiredValue___ === this.refs.inputbox.value) return;
            var me = this;
            var lastValue = this.___lastFiredValue___;
            e.target = this.refs.container;
            e.target.value = this.___lastFiredValue___ = this.refs.inputbox.value;
            this.___dispatchChange___(e, this.___lastFiredValue___, lastValue);
            this.___workerTimer___ = setInterval(function () {
                clearInterval(me.___workerTimer___);
                me.___syncValue___();
            }, 10);
        },
        ___onPaste___: function (e) {
            // DO NOTHING
        }
    };
});
