
# 凤巢FE React UI组件开发规范

## 适用范围
凤巢FE 所有基于React开发的UI组件。

## 撰写
- Brian Li (lihaitao03@baidu.com)
- Han Bing Feng (hanbingfeng@baidu.com)

## 要求
- 必须：表示绝对要求这样做。
- 必须不：表示绝对不要求这样做。
- 应该/建议：表示一般情况下应该这样做，但是在某些特定情况下可以忽视这个要求。
- 应该不/不建议：表示一般情况下不应该这样做，但是在某些特定情况下可以忽视这个要求。
- 可以：表示这个要求完全是可选的，你可以这样做，也可以不这样做。

## 目录<a href="#toc"></a>
1. [基本概念] (#basic-concepts)
2. [核心依赖] (#deps)
2. [JSX书写] (#jsx)
3. [更多的通用组件规范] (#general-guide)
3. [fcui2专属规范] (#ui-guide)


## 基本概念<a href="#basic-concepts"></a>
- 实例化生命周期
    - `getDefaultProps`
    - `getInitialState`
    - `componentWillMount`
    - `render`
    - `componentDidMount`    
- 更新期生命周期
    - `getInitialState`
    - `componentWillMount`
    - `render`
    - `componentDidMount`   
- 运行期生命周期
    - `componentWillReceiveProps`
    - `shouldComponentUpdate`
    - `componentWillUpdate`
    - `render`
    - `componentDidUpdate`
- 销毁期生命周期
    - `componentWillUnmount`


## 核心依赖<a href="#deps"></a>
- **必须**在FCUI2内只依赖React，underscore。
- **必须不**在FCUI2内部任何地方使用jQuery等直接操作DOM的库


## JSX书写<a href="#jsx"></a>

> 参考：[Airbnb的style guide](https://github.com/airbnb/javascript/)。

- **必须**命名JSX文件为.jsx.js。
- **必须**使用PascalCase作为文件名。
- **必须**只包含一个React Component在一个JSX文件中。
- **必须**令文件名与React Component名字相同。
- **必须**只能使用`React.createClass()`来创建一个React Component。

    > 其他创建React Component的考量
    > ES6 Class和pure function都可以创建React Component。
    > ES6 Class不能使用mixin做扩展，与目前的扩展方法冲突。
    > Pure function较难掌握和管理。 

- **必须**使用JSX语法来生成组件的DOM片段。
- **必须不**能在JSX中出现`React.createElement()`。
- **必须**遵守下面示例中的DOM片段对齐方式。

```javascript
    // bad
    <Foo superLongParam="bar"
         anotherSuperLongParam="baz" />

    // good
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    />

    // if props fit in one line then keep it on the same line
    <Foo bar="bar" />

    // children get indented normally
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    >
      <Quux />
    </Foo>
```
- **必须**在DOM片段中使用双引号`"`。

    > Why？JSX attributes [can't contain escaped quotes](http://eslint.org/docs/rules/jsx-quotes), so double quotes make conjunctions like `"don't"` easier to type.

    > Regular HTML attributes also typically use double quotes instead of single, so JSX attributes mirror this convention.

```javascript
    // bad
    <Foo bar='bar' />

    // good
    <Foo bar="bar" />

    // bad
    <Foo style={{ left: "20px" }} />

    // good
    <Foo style={{ left: '20px' }} />
```

- **必须**在自关闭标签前加一个空格。
 
```javascript
    // bad
    <Foo/>

    // very bad
    <Foo                 />

    // bad
    <Foo
     />

    // good
    <Foo />
```

- **必须**书写propTypes，规定每个可接受属性的类型，并对propTypes加以jsdoc说明。

- **必须**使用camalCase来命名props。

```javascript
    // bad
    <Foo
      UserName="hello"
      phone_number={12345678}
    />

    // good
    <Foo
      userName="hello"
      phoneNumber={12345678}
    />
```

- **必须**当props的值为字面值true时，省略`={true}`。

```javascript
    // bad
    <Foo
      hidden={true}
    />

    // good
    <Foo
      hidden
    />
```

- **必须**在DOM片段前后加一对括号`()`，当DOM片段在一行以上时。

```javascript
    // bad
    render() {
      return <MyComponent className="long body" foo="bar">
               <MyChild />
             </MyComponent>;
    }

    // good
    render() {
      return (
        <MyComponent className="long body" foo="bar">
          <MyChild />
        </MyComponent>
      );
    }

    // good, when single line
    render() {
      const body = <div>hello</div>;
      return <MyComponent>{body}</MyComponent>;
    }
```

- **必须**将组件写成自关闭标签，当组件没有children时。

```javascript
    // bad
    <Foo className="stuff"></Foo>

    // good
    <Foo className="stuff" />
```

- **必须**将关闭标签另起一行，当组件有多个props时。

```javascript
    // bad
    <Foo
      bar="bar"
      baz="baz" />

    // good
    <Foo
      bar="bar"
      baz="baz"
    />
```

- **必须**将bind handler到this的动作放到构造函数中。

    > Why? A bind call in the render path creates a brand new function on every single render.

```javascript
    // bad
    class extends React.Component {
      onClickDiv() {
        // do stuff
      }

      render() {
        return <div onClick={this.onClickDiv.bind(this)} />
      }
    }

    // good
    class extends React.Component {
      constructor(props) {
        super(props);

        this.onClickDiv = this.onClickDiv.bind(this);
      }

      onClickDiv() {
        // do stuff
      }

      render() {
        return <div onClick={this.onClickDiv} />
      }
    }
```

- *必须*以如下的顺序排列JSX文件中的方法。
  
  1. `displayName`
  1. `propTypes`
  1. `contextTypes`
  1. `childContextTypes`
  1. `mixins`
  1. `statics`
  1. `defaultProps`
  1. `getDefaultProps`
  1. `getInitialState`
  1. `getChildContext`
  1. `componentWillMount`
  1. `componentDidMount`
  1. `componentWillReceiveProps`
  1. `shouldComponentUpdate`
  1. `componentWillUpdate`
  1. `componentDidUpdate`
  1. `componentWillUnmount`
  1. *clickHandlers or eventHandlers* like `onClickSubmit()` or `onChangeDescription()`
  1. *getter methods for `render`* like `getSelectReason()` or `getFooterContent()`
  1. *Optional render methods* like `renderNavigation()` or `renderProfilePicture()`
  1. `render`


## 更多的通用组件规范 <a href="#general-guide"></a>

*[基本的JSX书写规范] (#jsx)基础上，更多的通用的React组件开发规范。*

- **必须**将所有UI组件实现为[Pure Renderer] (https://facebook.github.io/react/docs/pure-render-mixin.html)。
- **必须**在props中存放所有外部导入的配置，包括显示控制参数、显示数据源、当前值（如果是input类型组件）、回调方法等。state相同时，对于一个特定的props，对应的组件展现结果唯一。
- **必须**在state中存放组件运行期的状态，如输入框是否通过了校验、鼠标是否悬浮在按钮上等。props相同时，对于一组特定的state，对应的组件展现效果唯一。
- **不应该**在state中存在[通过props运算来的属性] (https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html)。
- **建议**父子关系的组件间传递props时，使用[rest-spread语法] (https://facebook.github.io/react/docs/transferring-props.html)。
- **必须**仅在实例化生命周期中绑定window或body事件。
- **必须**在销毁期生命周期中解绑window或body事件。
- **必须不**允许在运行期生命周期中声明表达式函数。bind函数也不允许。

```javascript
    // bad
    render() {
        var cleverFunction = function () {};
        // ...
    }

    // good
    {
        cleverFunction() {},
        render() {
            // just use this.cleverFunction
        }
    }
```

- **不建议**在运行期生命周期中使用时间复杂度O(n<sup>2</sup>)及以上阶的算法。
- **必须不**允许出现观察者模式，如自定义`addEventListener`方法，或`on`, `fire`等。
- **必须**只能通过以下2种方法设置组件内部状态：
    - 通过父组件的`render`方法，改变子组件的props。
    - 通过子组件的`setState`方法。
- **必须不**允许为组件提供setXXX方法来改变其内部状态。
- **必须**为所有回调在`getDefaultProps`给出空函数默认值`_.noop`。
- **可以**提供与组件内部数据结构紧密相关的操作方法。这些方法可以实现为一个纯函数，即只依赖其所有的参数来得到其结果。这些方法可以放在组件的`static`域中。


## fcui2专属规范 <a href="#ui-guide"></a>

### 文件分布

- **可以**将只是某个特定组件才使用的方法，从jsx文件中提取出来，放置于`fcui2/src/core/`目录下，文件名必须为`<组件名>Tools.js`，PascalCase。
- **必须**将能被所有组件公共使用的方法，放在`fcui2/src/core/tools.js`文件中。
- **必须**将不但fcui2可以使用，任何其他项目都可以使用的方法，放在`fcui2/src/core/util.js`文件中。

### 组件

- **不建议**在组件内部直接操作window, document等全局对象。
- **必须**将组件设计为可以独立使用，不允许有abstract class。
- **必须**仅通过mixin抽取公共逻辑。
- **可以**组合组件，如Pager使用了Button。

### Input组件

- **必须**令input类型组件支持React官方的[valueLink插件] (https://facebook.github.io/react/docs/two-way-binding-helpers.html)，其基本实现是引入fcui2/mixins/InputWidgetBase.js插件。
- **必须**令input类型组件，用props.value域导入值，用props.onChange返回输入触发（注：value和onChange不能跟valueLink同时使用，兼容判断在InputWidgetBase中已经实现）。
- **必须**令input类型组件，不得阻断React规范的数据流，即：
    - 如果外部配置了props.value，必须根据props.value做响应展示；
    - 如果外界配置了props.value，但未配置props.onChange，组件是只读的，用户不能输入；
    - 如果外界配置了props.valueLink，则通过props.valueLink读取value，并通过valueLink.requestChange回调change；
    - 传递给onChange事件的参数，必须是原生的DOM event实例，即可以通过e.target.value获取到组件变动后的值；
    - 当外界没有配置props.value，且没有配置props.valueLink时，组件可以允许输入，并能通过onChange返回变更。

- **必须不**允许input类型组件的`getDefaultProps`中，给出`value`和`onChange`的默认值。
- **可以**令input类型组件的getDefaultProps中，给出valueTemplate属性作为value的初始值。
    
### mixin

- **必须**将所有mixin放在`fcui2/src/mixins/`目录中。
- **必须**保证宿主组件除声明引入mixin代码外，不需其他代码即可令mixin工作。
- **必须不**能在mixin中使用继承。
    > Why？因为React会改变每个方法的运行上下文
- **不应该**用好几个mixin完成一件事情。
- **必须**令mixin在使用组件的state或childContextTypes等公共资源时，mixin专属使用的内部变量应存在独立命名空间，建议命名`fcui2.mixin.<属性名字>`。

### 样式

- **必须**将所有CSS文件存放在`fcui2/src/css/`目录中，以less形式编写。
- **必须**令每个组件对应一个less文件，存放在`fcui2/css/widget/`目录中，并在`fcui2/src/css/main.less`中引入。
- **必须**在每个组件的less文件引入`skin.less`，并使用其中的皮肤变量编写自己的样式。
- **必须**在每个组件的根容器中含有表明组件身份的class，class建议命名`fcui2-<组件名>`，组件名按单词拆开`-`分隔。
- **必须**为容器内部样式，也加入前缀`fcui2-`。
- **建议**组件根容器应加入props.className，允许外部使用时挂载自定义class。
- **建议**若`render`时处理className的逻辑达到3行及以上，剥离className的计算逻辑到`this.getClassName`上。
- **建议**若`render`时处理style的逻辑达到3行及以上，剥离style的计算逻辑到`this.getStyle`上。

**[⬆ back to top](#toc)**
