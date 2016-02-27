# FCUI2开发规范

## 适用范围
    凤巢FE团队所有参与FCUI2开发的同学

## 撰写
    Brian Li (lihaitao03@baidu.com)
## 要求
    MUST：表示绝对要求这样做
    MUST NOT：表示绝对不要求这样做
    SHOULD：表示一般情况下应该这样做，但是在某些特定情况下可以忽视这个要求
    SHOULD NOT：表示一般情况下不应该这样做，但是在某些特定情况下可以忽视这个要求
    MAY：表示这个要求完全是可选的，你可以这样做，也可以不这样做
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
* <B>MUST：</B> FCUI2最核心依赖为react，underscore, 放在dep目录中，若引入其他依赖，需经技协UI负责人集体讨论
* <B>MUST NOT：</B>  不允许在FCUI2内部任何地方使用jQuery等直接操作DOM的库


## 架构组织
* <B>MUST：</B> 组件源码以*.jsx.js形式命名，存放在fcui2/src/目录中
* <B>MUST：</B> 所有组件必须能独立使用，src目录下的所有文件平等，但可以存在组合关系，如Pager使用了Button，不允许存在继承关系，所有涉及到公共的东西，用mixin做，简化一切不必要的抽象，鼓励组合设计模式和装饰者设计模式
* <B>MUST: </B> 组件内部使用到的其他子部分，如果不能剥离成组件，要么放在当前.jsx.js文件内部，要么放在fcui2/src/plugin/目录中。放入plugin的代码，原则上所有组件都可以使用，但外部无法直接使用
* <B>MUST: </B> 能被所有组件公共使用的方法，放在fcui2/src/core/tools.js文件中
* <B>MUST: </B> 不但fcui2可以使用，任何其他项目都可以使用的方法，放在fcui2/src/core/util.js文件中
* <B>MUST: </B> 只是某个特定组件才使用的方法，如果需要从jsx文件中提取出来，请自行在fcui2/src/core/目录中建立自己的附属文件，并在文件名中注明是哪个组件的附属，若抽离出的文件过多，请在core/中建立二级目录

## 组件编写
* <B>MUST：</B> props中存放所有外部导入的配置，包括显示控制参数、显示数据源、当前值（如果是input类型组件）、回调方法等，要求给出一个特定的props，对应的组件展现结果唯一（如果不考虑state）
* <B>MUST：</B> state中存放组件运行期的状态，如输入框是否通过了校验、鼠标是否悬浮在按钮上等
* <B>MUST NOT：</B> 为保证组件质量，严禁在任何生命周期把数据从props拷贝到state使用，深拷贝也不允许
* <B>SHOULD NOT：</B> 鉴于上一点，不建议组件开发中大规模使用componentWillReceiveProps钩子
* <B>SHOULD NOT：</B> 除极特殊组件如Dialog外，不建议在组件内部直接操作window, document等全局对象
* <B>MUST：</B> 若组件需要在window或body上绑定事件，必须在销毁期生命周期解绑，且绑定行为不能出现在运行期生命周期中，如render
* <B>MUST NOT：</B>为保证组件运行效率，禁止在运行期生命周期使用复杂度很高的算法（需要考虑引入库的时间复杂度），禁止在运行期生命周期中声明表达式函数，如在render中var a = function () {};
* <B>MUST: </B> 组件应以数据驱动的思维开发，不允许出现观察者模式，如自定义addEventListener方法，或on, fire等。
* <B>SHOULD: </B> 接上一点，开发组件时不建议考虑过多的API暴露，如写出.setWidth(), setDatasource()、setValue()这种接口，因为组件所有的信息都存放在props和state中，修改组件的属性应从外部直接设置props，读取组件的数据直接访问props或state。组件显示结果应主要依赖props，应尽量少依赖于state，原因之前已讲过
* <B>SHOULD: </B> 接上一点，组件this上的方法，应当以响应内部DOM事件为主，组件的外部一般不使用这些方法；纯数据操作类的方法，不建议写在this的属性中，建议写在组件外部，但可以在同一个.jsx.js文件内
* <B>SHOULD: </B> 对于比较复杂的组件，可能在props传入很多回调函数，建议使用一个回调接口，以路由模式回传操作，方便用户对组件的使用，如this.props.onCallback(type, param);
* <B>MUST：</B> 所有回调，除onChange外，都应该在getDefaultProps给出空函数默认值，避免在代码中使用if (typeof this.props.onXXX === 'function')这种形式判断
* <B>MUST：</B> 组件必须书写propTypes，规定每个默认属性的类型，方面React校验，并对propTypes加以必要说明，方便使用者和其他开发者理解

## input类型组件编写
* <B>MUST：</B> input类型组件，必须支持React官方的valueLink插件，其基本实现是引入fcui2/mixins/InputWidgetBase.js插件
* <B>MUST：</B> input类型组件，必须用props.value域导入值，用props.onChange返回输入触发（注：value和onChange不能跟valueLink同时使用，兼容判断在InputWidgetBase中已经实现）
* <B>MUST：</B> input类型组件，不得阻断React规范的数据流，即：
     
        如果外部配置了props.value，必须根据props.value做响应展示；
        如果外界配置了props.value，但未配置props.onChange，组件是只读的，用户不能输入；
        如果外界配置了props.valueLink，则通过props.valueLink读取value，并通过valueLink.requestChange回调change；
        传递给onChange事件的参数，必须是原生的DOM event实例，即可以通过e.target.value获取到组件变动后的值
        当外界没有配置props.value，且没有配置props.valueLink时，组件可以允许输入，并能通过onChange返回变更
* <B>MUST NOT：</B> 鉴于以上，input类型组件的getDefaultProps中，一定不要给出value和onChange的默认值
* <B>MUST：</B> 接上一点，input类型组件的getDefaultProps中，应当给出valueTemplate属性，当外界不配置value或value配置有问题时，使用此属性作为value的初始值
        


## mixin编写
* <B>MUST：</B> 所有mixin放在fcui2/src/mixins/目录中
* <B>SHOULD：</B> 每个mixin尽量完成独立的功能，不依赖其他mixin，但可以依赖几个基础的mixin，mixin应尽量简单、独立，职责单一
* <B>SHOULD NOT：</B> 不建议写mixin时使用继承，因为React会改变每个方法的运行上下文，不建议用好几个mixin完成一件事情
* <B>SHOULD：</B> 除了基础mixin，其他mixin不能影响宿主组件的正常工作，且除了mixin的引入，不应在宿主组件中添加其他代码，确保宿主组件在引入和没有引入该mixin时，都能正常工作，且前后表现一致。如必须添加额外代码才能让该mixin工作，需经讨论在基础mixin中添加
* <B>SHOULD：</B> 不建议mixin使用getDefaultProps，因为用户往往根据这个方法学习组件的用法，一般不会在mixin中找其他属性。相应的，如果使用到某个特殊属性，应当在使用时自行判断该属性是否存在且类型是否合法。
* <B>SHOULD：</B> mixin在使用state或childContextTypes等公共资源时，mixin专属使用的内部变量应存在独立命名空间，或命名前缀，以防止被其他mixin或组件自身行为干扰


## CSS编写
* <B>MUST：</B> 所有CSS文件存放在fcui2/src/css/目录中，以less形式编写
* <B>MUST：</B> 每个组件对应一个less文件，存放在css/widget/目录中，并在main.less中引入
* <B>SHOULD：</B> 每个组件的less文件应引入skin.less，并使用其中的皮肤变量编写自己的样式
* <B>MUST：</B> 每个组件的根容器必须含有表明组件身份的class，且该class应含有前缀，如.fcui2-button
* <B>SHOULD：</B> 容器内部样式，为避免干扰，建议也加入前缀
* <B>SHOULD：</B> 组件根容器应加入props.className，允许外部使用时挂载自定义class，方便使用者自定义样式或对组件内部样式进行hack