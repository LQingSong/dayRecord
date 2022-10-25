### React 基础

#### JSX

JavaScript XML，充分利用 JS 自身的可编程能力创建 HTML 结构

JSX 并不是标准的 JS 语法，浏览器是不识别的，需要通过 Babel 来转换，creat-react-app 脚手架中内置了 @babel/plugin-transform-react-jsx 包，用来解析 jsx 语法。

语法: { js 表达式 } , 和 Vue 不一样，React 是单括号

可以使用的表达式：

1. string、number、boolean、null、undefined、object ([]/{})
2. 1 + 2, 'abc'.split(''), ['a', 'b'].jogin('-')
3. function()

不可以用的表达式：
if 语句、switch-case 语句、变量声明语句；这些叫语句，不是表达式，不能出现在 jsx {} 中！！

- 动态样式

```jsx
<div className={showTitle ? "title" : ""}>this is a div</div>;

const styleObj = {
  color: red,
};

<div style={styleObj}>this is a div</div>;
```

- JSX 注意事项：

1. JSX 必须有一个根节点，如果没有根节点，可以使用<></>(幽灵节点)替代
2. 所有标签必须形成闭合，成对闭合或者自闭合都可以
3. JSX 中的语法更贴近 JS 语法，属性名采用驼峰命名, 有一些特殊的特别记忆 class -> className for -> htmlFor
4. JSX 支持多行（换行），如果需要换行，需使用（）包裹，防止 bug 出现

#### React 组件

##### 函数组件

使用函数（或箭头函数）创建的组件，就叫做函数组件。

```js
const HelloComponent = () => {
  return <div>组件页面内容</div>;
};
```

约定说明：

1. 组件的名称必须首字母大写，React 内部会根据这个判断是组件还是普通的 HTML 标签
2. 函数组件必须有返回值，表示该组件的 UI 结构；如果不需要渲染任何内容，则返回 null
3. 组件就像 HTML 标签一样可以被渲染到页面中。对于函数组件来说，渲染的内容是函数的返回值。
4. 使用函数名称作为组件标签名称，可以成对出现也可以自闭合。

##### 类组件

```js
class HellComponent extends React.Component {
  render() {
    return <div>组件页面内容...</div>;
  }
}
```

约定说明：

1. 类名称也必须以大写字母开头
2. 类组件应该继承 React.Component 父类，从而使用父类中提供的方法或属性
3. 类组件必须提供 render 方法，render 方法必须有返回值，表示该组件的 UI 结构

##### 函数组件的事件绑定

1. 语法：on + 事件名称 = { 事件处理程序 }

```js
function HelloC() {
  const handleClick = () => {
    console.log("点击事件");
  };
  return <div onClick={handleClick}>Hello</div>;
}
```

注意点：react 事件采用驼峰命名法: onMouseEnter

2. 获取事件对象
   获取事件对象 e 只需要在 事件的回调函数中补充一个形参 e 即可。

```js
function HelloC() {
  const handleClick = (e) => {
    console.log("获取点击事件对象e:", e);
  };
  return <div onClick={handleClick}>Click Me!</div>;
}
```

3. 传递额外参数
   改造事件绑定为箭头函数，在箭头函数中完成参数传递

```js
function HelloC() {
  const handleClick = (e, data) => {
    console.log("事件对象e", e);
    console.log("额外参数data", data);
  };
  return <div onClick={(e) => handleClick(e, item)}>Click Me!</div>;
}
```

##### 类组件的事件绑定

类组件中的事件绑定，整体套路和函数组件一致，唯一需要注意的是事件处理函数定义的时候为了避免 this 指向丢失，事件定义要使用箭头函数的形式（Class Fields 类属性的方式），而在绑定的时候需要借助 this 关键字获取。

```js
class HelloComponent extends React.Component {
  handleClick = (e, data) => {
    console.log("事件对象e", e);
    console.log("额外参数data", data);
  };

  render() {
    return <div onClick={(e) => this.handleClick(e, item)}>Click Me!</div>;
  }
}
```

##### 组件状态

提醒：在 React Hook 出来之前，函数式组件是没有自己的状态的，所以下面内容统一按类组件来讲解。

1. 初始化状态

- 通过 class 的实例属性 state 来初始化
- state 的值是一个对象结构，表示一个组件可以有多个数据状态

```js
class Counter extends React.Component {
  state = {
    count: 0,
  };

  render() {
    return <button>计数器</button>;
  }
}
```

2. 读取状态
   通过 this.state 来读取状态

```js
class Counter extends React.Component {
  state = {
    count: 0,
  };

  render() {
    return <button>计数器 {this.state.count}</button>;
  }
}
```

3. 修改状态

- 通过 this.setState({ 要修改的数据 })
- setState 方法作用
  - 修改 state 中的数据状态
  - 更新 UI
- 思想
  数据驱动视图，也就是只要修改数据状态，那么页面就会自动刷新，无需手动操作 DOM
- 注意事项
  不要直接修改 state 中的值，必须通过 setState 方法进行修改

```js
class Counter extends React.Component {
  state = {
    count: 0,
  };

  setCount = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };

  render() {
    return <button onClick={this.setCount}>{this.state.count}</button>;
  }
}
```

#### React 的状态不可变

不要直接修改状态的值，而是基于当前状态创建新的状态值

```js
class AComponent extends React.Component {
  state = {
    count: 0,
    list: [1, 2, 3],
    person: {
      name: "jack",
      age: 18,
    },
  };

  setState = () => {
    this.setState({
      count: this.state.count + 1,
      list: [...this.state.list, 4],
      person: {
        ...this.state.person,
        name: "Rose",
      },
    });
  };
}
```

#### 表单处理

##### 1. 受控表单组件

什么是受控表单组件？ 就是表单元素自己的状态被 React 组件状态控制

React 组件的状态的地方是在 state 中，表单元素如 input 元素也有自己的状态是在 value 中，React 将 state 与 input 的 value 绑定到一起，由 state 的值来控制表单元素的值，从而保证单一数据源特性。

React 中没有类似于 Vue 里 v-model 的这种双向绑定功能，所以 React 就只能通过 state 属性和表单元素的值建立依赖关系，再通过 onChange 事件与 setState()结合更新 state 属性，以此来达到类似 v-model 的效果。（小程序就是抄的 react 这一套）

```js
class FormCompontnt extends React.Component {
  state = {
    msg: "this is a message",
  };

  handleChange = (e) => {
    this.setState({
      msg: e.target.value,
    });
  };

  render() {
    return <input value={this.state.msg} onChange={this.handleChange} />;
  }
}
```

##### 2. 非受控表单表单组件

非受控就是表单元素不受 react 的 state 状态控制，就是原生 DOM 元素。
实现过程：

1. 通过调用 React.createRef 函数，创建一个 ref 对象 myRef
2. 为元素添加 ref 属性，值为 myRef
3. 在按钮的事件处理程序中，通过 myRef.current 拿到对应的 dom 元素，其中 myRef.current.value 拿到的就是 Dom 元素的值

```js
import { Component, createRef } from "react";

class InputComponent extends Component {
  myRef = createRef();

  changHandler = () => {
    console.log(this.myRef.current.value);
  };

  render() {
    return (
      <div>
        <input ref={this.myRef} />
        <button onClick={this.changeHandler}>submit</button>
      </div>
    );
  }
}
```

#### React 组件通信

- 父传子 props

```js
parent: return <children msg={state.message} />;

const children = (props) => {
  return <div></div>;
};
```

- 子传父 回调函数

```js
function Son(props) {
  const handleClick = () {
    props.changeMsg('this is newMessage');
  }
  return (
    <div>
      {props.msg}
      <button onClick={handleClick}>Change</button>
    </div>
  )
}

class App extends Component {
  state = {
    message: 'this is message'
  }
  const changeMessage = (newMsg) => {
    console.log('子组件传过来的数据：', newMsg);
    this.setState({
      message: newMsg
    })
  }
  render() {
    return (
      <div>父组件</div>
      <Son msg = {this.state.message}
      // 回调函数
      changeMsg={this.changeMessage}
      />
    )
  }
}
```

- 兄弟(同级)组件消息传递，将共享状态提升到最近的父组件中，由父组件去管理这个状态

- 跨组件通信，从 App(上层) 组件向任意一个下层组件传递数据，使用 Context

1. 创建 提供者 和 消费者

   > const { Provider, Consumer } = createContext();

2. 用 Provider 包裹 App 组件

```js
class App extends Component {
  render() {
    <Provider value={this.state.msg}>...</Provider>;
  }
}
```

3. 用 Consumer 包裹要消费状态的下层组件

```js
<Consumer>{(value) => <span>{value}</span>}</Consumer>
```

#### React 组件进阶

只有类组件（实例化）有生命周期，函数组件（不需要实例化）没有生命周期。

生命周期：挂载时、更新时、卸载时
生命周期钩子函数：constructor、render、componentDidMount、componentDidUpdate、componentWillUnmount

不要在 render 和 componentDidUpdate 做任何更新操作

componentDidMount 组件挂载完后执行，初始化的时候执行一次，可用来发送网络请求、DOM 操作

#### React Hooks 基础

##### useState

函数式组件更改数据状态，不能使用 setState，只能使用 useState,
而且绑定事件时，OnClick={handleClick()}这样带()的方式，会一开始就触发并且无效绑定事件，正确写法是：

- 如果不带参数，OnClick = {handleClick}
- 如果有参数，OnClick = {() => handleClick(params)}

useState()的默认值如果无法直接得到需要通过计算才能等到，可以使用

```js
useState(() => {
  return initValue;
});
```

##### useEffect 副作用

副作用是相对于主作用来说的，一个函数除了主作用，其它作用就是副作用。
对于 React 组件来说，主作用就是根据数据（state/props）渲染 UI，除此之外都是副作用（比如手动操作 DOM、ajax 请求）

- **依赖项控制副作用的执行时机：**

1. 不添加依赖项：

```js
useEffect(() => {
  console.log("xxx副作用执行");
});
```

该副作用函数会在首次渲染执行一次，以及不管是哪个状态更改引起更新时再重新执行

2. 添加空数组

```js
useEffect(() => {
  console.log("副作用只执行一次");
}, []);
```

3. 添加特定依赖项

```js
const [count, setCount] = useState(0);
useEffect(() => {
  console.log("在特定依赖项变化时再执行");
}, [count]);
```

该副作用函数会在首次渲染执行一次，往后只在状态 count 发生变化时执行

注意：在 useEffect()回调函数中用到的数据，就是该副作用的依赖项，应该添加到依赖项数组中去。

- **清楚副作用**
  在组件被消耗时，如果有些副作用操作需要被清理，就可以使用此语法，比如常见的定时器

```js
useEffect(() => {
  console.log('副作用函数执行了')

  // 清理副作用
  return () => {
    console.log('在组件被消耗时，清理副作用的函数执行了')
    ...
  }
})
```

- 在 useEffect 中发送网络请求，并正确使用 async await

```js
useEffect(() => {
  async function fetchData() {
    const res = await fetch(url);
  }
});
```

不要改变 useEffect(async () => {})，这是错误的

##### useRef

在函数组件中获取 DOM 元素或类组件实例

```js
function App() {
  const testRef = useRef(null);

  useEffect(() => {
    console.log(testRef.current);
  }, []);

  return (
    <div>
      <TestC ref={testRef} />
    </div>
  );
}
```

##### useContext 跨组件通信

函数式组件的跨组件通信 hook，useContext

使用步骤：

1. 使用 createContext 创建 Context 对象
2. 在顶层组件通过 Provider 提供数据
3. 在底层组件通过 useContext hook 获取数据

```js
// 1. 创建Context对象
const Context = createContext();

// 底层组件
function Son() {
  // 通过useContext 获取 数据
  const msg = useContext(Context);

  return <div>SonC: {msg}</div>;
}

// 顶层组件
function App() {
  return (
    <Context.Provider value={"this is message!"}>
      <div>
        <Son />
      </div>
    </Context.Provider>
  );
}
```

##### 自定义 Hook

使用 React 内置的 useState、useEffect 等 自定义 hook，useXXXX()

```js
function useLocalStorage(key, defaultValue) {
  const [msg, setMsg] = useState(defaultValue);

  // 当msg变化时就把它存到localStorage
  useEffect(() => {
    window.localStorage.setItem(key, msg);
  }, [msg, key]);

  return [msg, setMsg];
}
```
