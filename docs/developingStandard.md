# FCUI2开发规范

## 适用范围
    凤巢FE团队所有参与FCUI2开发的同学

## 撰写
    - Brian Li (lihaitao03@baidu.com)
    - Han Bing Feng (hanbingfeng@baidu.com)
## 要求
    MUST：表示绝对要求这样做。
    MUST NOT：表示绝对不要求这样做。
    SHOULD：表示一般情况下应该这样做，但是在某些特定情况下可以忽视这个要求。
    SHOULD NOT：表示一般情况下不应该这样做，但是在某些特定情况下可以忽视这个要求。
    MAY：表示这个要求完全是可选的，你可以这样做，也可以不这样做。
## 概念

    实例化生命周期
        getDefaultProps
        getInitialState
        componentWillMount
        render
        componentDidMount
        
    更新期生命周期
        getInitialState
        componentWillMount
        render
        componentDidMount
        
    运行期生命周期
        componentWillReceiveProps
        shouldComponentUpdate
        componentWillUpdate
        render
        componentDidUpdate

    销毁期生命周期
        componentWillUnmount


## 核心依赖
- **MUST：** FCUI2最核心依赖为react，underscore, 放在dep目录中，若引入其他依赖，需经技协UI负责人集体讨论
- **MUST NOT：**  不允许在FCUI2内部任何地方使用jQuery等直接操作DOM的库


## 架构组织
- **MUST：** 组件源码以*.jsx.js形式命名，存放在fcui2/src/目录中。
- **MUST：**  组件内部使用到的其他子部分，如果不能剥离成组件，要么放在当前.jsx.js文件内部，要么放在fcui2/src/plugin/目录中。放入plugin的代码，原则上所有组件都可以使用，但外部无法直接使用。
- **MUST：** 能被所有组件公共使用的方法，放在fcui2/src/core/tools.js文件中
- **MUST：** 不但fcui2可以使用，任何其他项目都可以使用的方法，放在fcui2/src/core/util.js文件中。
- **MUST：** 只是某个特定组件才使用的方法，如果需要从jsx文件中提取出来，请自行在fcui2/src/core/目录中建立自己的附属文件，并在文件名中注明是哪个组件的附属，若抽离出的文件为3个或3个以上，请在core/中建立二级目录。


## 组件编写
### props 和 state
- **MUST：** 所有UI组件必须实现为Pure Renderer（https://facebook.github.io/react/docs/pure-render-mixin.html）。
- **MUST：** props中存放所有外部导入的配置，包括显示控制参数、显示数据源、当前值（如果是input类型组件）、回调方法等。state相同时，对于一个特定的props，对应的组件展现结果唯一。
- **MUST：** state中存放组件运行期的状态，如输入框是否通过了校验、鼠标是否悬浮在按钮上等。props相同时，对于一组特定的state，对应的组件展现效果唯一。
- **SHOULD NOT：** state中不应该存在通过props运算来的属性，参考 https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html 。

### DOM操作
- **MUST：** 若组件需要在window或body上绑定事件，必须仅在实例化生命周期中进行。
- **MUST：** 若组件需要在window或body上绑定事件，必须在销毁期生命周期解绑。
- **SHOULD NOT：** 除极特殊组件如Dialog外，不建议在组件内部直接操作window, document等全局对象。

### 性能考量
- **MUST NOT：** 不允许在运行期生命周期中声明表达式函数，如在render中var a = function () {};
- **SHOULD NOT：** 不应该在运行期生命周期中使用时间复杂度O(n^2)及以上阶的算法。

### 组件间的设计考量
- **MUST：** 所有组件必须能独立使用，不允许出现abstract class及继承关系。
- **MUST：** 公共逻辑抽取仅可通过mixin实现。
- **SHOULD：** 父子关系的组件间传递props时，应该使用React推荐的实践：https://facebook.github.io/react/docs/transferring-props.html 。即使用rest-spread语法获取或直接传递父组件的所有props给子组件。
- **MAY：** 组件间可以发生组合，如Pager使用了Button。

### 组件内的设计考量
- **MUST：** 组件必须书写propTypes，规定每个默认属性的类型，方面React校验，并对propTypes加以jsdoc说明，方便使用者和其他开发者理解。
- **MUST NOT：** 组件不允许出现观察者模式，如自定义addEventListener方法，或on, fire等。
- **MUST：** 组件必须只能通过以下2种方法设置内部状态：
    - 通过父组件的`render`方法，改变子组件的props。
    - 通过子组件的`setState`方法。
- **MUST NOT：** 不允许为组件提供setXXX方法来改变其内部状态。
- **MAY：** 组件可以提供与内部数据结构紧密相关的操作方法。这些方法可以实现为一个纯函数，即只依赖其所有的参数来得到其结果。这些方法可以放在组件的`static`域中。
- **SHOULD：** 当props传入的回调函数在3个或3个以上时，应该使用一个回调接口，以路由模式回传操作，方便用户对组件的使用。如使用路由模式，统一的回调接口名字应为onEvent。
```
    void onEvent(
        string eventType, ...params
    )
```
- **MUST：** 所有回调，除onChange外，都应该在getDefaultProps给出空函数默认值`_.noop`，避免在代码中使用`if (typeof this.props.onXXX === 'function')`这种形式判断。


## input类型组件编写
- **MUST：** input类型组件，必须支持React官方的valueLink插件，其基本实现是引入fcui2/mixins/InputWidgetBase.js插件。参考 https://facebook.github.io/react/docs/two-way-binding-helpers.html。
- **MUST：** input类型组件，必须用props.value域导入值，用props.onChange返回输入触发（注：value和onChange不能跟valueLink同时使用，兼容判断在InputWidgetBase中已经实现）。
- **MUST：** input类型组件，不得阻断React规范的数据流，即：
     
        如果外部配置了props.value，必须根据props.value做响应展示；
        如果外界配置了props.value，但未配置props.onChange，组件是只读的，用户不能输入；
        如果外界配置了props.valueLink，则通过props.valueLink读取value，并通过valueLink.requestChange回调change；
        传递给onChange事件的参数，必须是原生的DOM event实例，即可以通过e.target.value获取到组件变动后的值
        当外界没有配置props.value，且没有配置props.valueLink时，组件可以允许输入，并能通过onChange返回变更
- **MUST NOT：** 鉴于以上，input类型组件的getDefaultProps中，一定不要给出value和onChange的默认值
- **MUST：** 接上一点，input类型组件的getDefaultProps中，应当给出valueTemplate属性，当外界不配置value或value配置有问题时，使用此属性作为value的初始值
        

## mixin编写
- **MUST：** 所有mixin放在fcui2/src/mixins/目录中。
- **SHOULD：** 每个mixin尽量完成独立的功能，不依赖其他mixin，但可以依赖几个基础的mixin，mixin应尽量简单、独立，职责单一。
- **SHOULD NOT：** 不建议写mixin时使用继承，因为React会改变每个方法的运行上下文，不建议用好几个mixin完成一件事情
- **SHOULD：** 除了基础mixin，其他mixin不能影响宿主组件的正常工作，且除了mixin的引入，不应在宿主组件中添加其他代码，确保宿主组件在引入和没有引入该mixin时，都能正常工作，且前后表现一致。如必须添加额外代码才能让该mixin工作，需经讨论在基础mixin中添加
- **SHOULD：** 不建议mixin使用getDefaultProps，因为用户往往根据这个方法学习组件的用法，一般不会在mixin中找其他属性。相应的，如果使用到某个特殊属性，应当在使用时自行判断该属性是否存在且类型是否合法。
- **SHOULD：** mixin在使用state或childContextTypes等公共资源时，mixin专属使用的内部变量应存在独立命名空间，或命名前缀，以防止被其他mixin或组件自身行为干扰


## CSS编写
- **MUST：** 所有CSS文件存放在fcui2/src/css/目录中，以less形式编写。
- **MUST：** 每个组件对应一个less文件，存放在css/widget/目录中，并在main.less中引入。
- **SHOULD：** 每个组件的less文件应引入skin.less，并使用其中的皮肤变量编写自己的样式。
- **MUST：** 每个组件的根容器必须含有表明组件身份的class，且该class应含有前缀fcui2，如.fcui2-button。
- **MUST：** 容器内部样式，为避免干扰，必须也加入前缀。
- **SHOULD：** 组件根容器应加入props.className，允许外部使用时挂载自定义class，方便使用者自定义样式或对组件内部样式进行hack。
- **SHOULD：** 若`render`时处理className的逻辑较复杂，如达到3行及以上，建议剥离className的计算逻辑到`this.getClassName`上。
- **SHOULD：** 若`render`时处理style的逻辑较复杂，如达到3行及以上，建议剥离style的计算逻辑到`this.getStyle`上。
