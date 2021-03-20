---
title: javascript基础（未完成）
date: '2021-03-02 22:01:06'
tags: 
- javascript


category: Development
image:
---

[《现代javascript教程》笔记](https://zh.javascript.info/getting-started)

### 语法

- "use strict"启用严格模式，高级语言结构会自动开启严格模式

### 变量

let, var, const

### 数据类型

基础类型:

typeof运算符：typeof x;  typeof(x);(typeof null输出object)

- string, number(Infinity/NaN), boolean, BigInt(整数末尾加n)
- null, undefined(已被声明、未被赋值)
- symbol(es6)

引用类型:

- object
  - Function
  - Array, RegExp, Date, Math等

### 交互

- alert(text)： modal对话框
- prompt(title, [default]): 文本消息、input、确定、取消，返回输入
- confirm(question): 确定、取消，返回boolean

### 类型转换

- 字符串转换：String()
- 数字型转换：Number()；算数函数和表达式会自动进行数字类型转换(+优先作为字符串拼接)；undefined(NaN), null(0)；
- 布尔型转换：0、''、null、undefined、NaN变为false；Boolean(0)//false, Boolean('0')//true

```javascript
// undefined 和 null 在相等性检查 == 中不会进行任何的类型转换，它们有自己独立的比较规则，所以除了它们之间互等外，不会等于任何其他的值
alert( null === undefined ); // false
alert( null == undefined ); // true
alert( null > 0 );  // (1) false
alert( null == 0 ); // (2) false
alert( null >= 0 ); // (3) true
// undefined 不应该被与其他值进行比较
// undefined 只与 null 相等
alert( undefined > 0 ); // false (1)
alert( undefined < 0 ); // false (2)
alert( undefined == 0 ); // false (3)
```


### 操作符

- 一元操作符：数字转化，一元运算符+(对数字无效，将其他类型转为数字)

- 位运算：
  - &: 清零、取指定位、判断奇偶
  - |: 将某些位设为1、
  - ^: 翻转指定位、与0相异或值不变、交换两个数
  - ~: 最低位归零(a&~1)
  - <<, 
  - \>>
  - \>>>无符号右移

- 运算符优先级：一元运算符>二元运算符>三元运算符
- 逗号运算符：运行每个语句，但只返回最后一个（逗号运算符的优先级低于赋值运算符）
- 自增/自减: 前置形式返回新值(a=++i)，后置形式返回原值(a=i++)
- 逻辑运算：
  - ||: 寻找第一个真值、短路求值
  - &&: 寻找第一个假值
- 空值合并运算符：
  - 为可能是未定义的变量提供一个默认值或从一系列的值中选择出第一个非 null/undefined 的值；
  - ??优先级为5，在=和?之间；
  - ??不能与&&/||一起使用，除非使用括号明确指定了优先级

```javascript
a ?? b;
(a !== null && a !== undefined) ? a : b;
```

- break/continue支持标签，可以一次从多层循环中跳出

```js
outer: for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // 如果是空字符串或被取消，则中断并跳出这两个循环。
    if (!input) break outer; // (*)

    // 用得到的值做些事……
  }
}
alert('Done!');
```

- switch：
  - 至少含有一个case和一个可选的default；
  - 如果没有 break，程序将不经过任何检查就会继续执行下一个 case；
  - 共享同一段代码的几个 case 分支可以被分为一组
  - case的判断条件使用严格相等

### 语句

- 顺序语句：声明、赋值、运算、调用、解构等
- 控制流：if, break/continue, try/catch/finally, switch
- 迭代：do-while, while, for, for-in

### 函数

- 声明(在主代码流中声明为单独的语句的函数)和表达式(在一个表达式中或另一个语法结构中创建的函数)
  - 函数表达式是在代码执行到达时被创建，并且仅从那一刻起可用
  - 在函数声明被定义之前，它就可以被调用,一个全局函数声明对整个脚本来说都是可见的，无论它被写在这个脚本的哪个位置
  - 严格模式下，当一个函数声明在一个代码块内时，它在该代码块内的任何位置都是可见的。但在代码块外不可见。
- 调用、值传递
- 直接调用、方法调用、构造函数、apply/call/bind
- this, arguments, return

### 对象

```js
let user = new Object(); // “构造函数” 的语法
let user = {};  // “字面量” 的语法

user.isAdmin = true;
user["likes birds"] = true;
delete user.isAdmin;
delete user["likes birds"];

// 计算属性
let fruit = 'apple';
let bag = {
  [fruit + 'Computers']: 5 // bag.appleComputers = 5
};

// 属性值缩写
function makeUser(name, age) {
  return {
    name, // 与 name: name 相同
    age,  // 与 age: age 相同
    // ...
  };
}

// 属性存在性测试
"key" in object

// 如果遍历一个对象，整数属性会被进行排序，其他属性则按照创建的顺序显示
let codes = {
  "49": "Germany",
  "41": "Switzerland",
  "44": "Great Britain",
  // ..,
  "1": "USA"
};

for(let code in codes) {
  alert(code); // 1, 41, 44, 49
}
let codes = {
  "+49": "Germany",
  "+41": "Switzerland",
  "+44": "Great Britain",
  // ..,
  "+1": "USA"
};

for (let code in codes) {
  alert( +code ); // 49, 41, 44, 1
}
```

#### 引用和复制

与原始类型相比，对象的根本区别之一是对象是“通过引用”被存储和复制的，与原始类型值相反：字符串，数字，布尔值等 —— 始终是以“整体值”的形式被复制的。因此仅当两个对象所指向的地址相同时，二者才相等：
```js
let a = {};
let b = a; // 复制引用

alert( a == b ); // true，都引用同一对象
alert( a === b ); // true

let a = {};
let b = {}; // 两个独立的对象

alert( a == b ); // false
```

Object.assign方法用于合并对象，该方法将所有原对象的属性拷贝到目标对象并返回目标对象，相同的属性名之间会进行覆盖。

深拷贝
```js
function DeepCopy(src){
  if ((typeof src != 'object'){
    return src;
  }
  const dest = src instanceof Array ? []: {};
  for(var item in src) {
    dest[item] = DeepCopy(src[item]);
  }
  return dest;
}
```

```js
Object.assign(dest, [src1, src2...])
```

#### 构造函数

构造函数在技术上是常规函数。不过有两个约定：

- 它们的命名以大写字母开头
- 它们只能由 "new" 操作符来执行。

当一个函数被使用 new 操作符执行时，它按照以下步骤：

- 一个新的空对象被创建并分配给 this
- 函数体执行。通常它会修改 this，为其添加新的属性
- 返回 this 的值。

```js
function User(name) {
  // this = {};（隐式创建）

  // 添加属性到 this
  this.name = name;
  this.isAdmin = false;

  // return this;（隐式返回）
}
```

new function() { … }构造器不能被再次调用，因为它不保存在任何地方，只是被创建和调用。因此，这个技巧旨在封装构建单个对象的代码，而无需将来重用。

new.target用于检查函数是否被作为构造函数调用，是则返回函数本身，否则返回undefined。

通常，构造器没有 return 语句。它们的任务是将所有必要的东西写入 this，并自动转换为结果。但是，如果这有一个 return 语句：

- 如果 return 返回的是一个对象，则返回这个对象，而不是 this。
- 如果 return 返回的是一个原始类型，则忽略。

#### 可选链

- obj?.prop —— 如果 obj 存在则返回 obj.prop，否则返回 undefined。
- obj?.[prop] —— 如果 obj 存在则返回 obj[prop]，否则返回 undefined。
- obj.method?.() —— 如果 obj.method 存在则调用 obj.method()，否则返回 undefined。
- ?.前的变量必须已声明

- 属性、访问器getter/setter
- new， delete
- toString, valueOf

#### Symbol

- 对象属性只能是String或Symbol
- Symbol通过实例化创建对象，Symbol保证是唯一的，可以添加描述并通过description属性访问，但相同描述的symbol之不相同
- Symbol不会被自动转为字符串
- Symbol用于隐藏属性

```js
let user = { // 属于另一个代码
  name: "John"
};

let id = Symbol("id");

user[id] = 1;

alert( user[id] ); // 我们可以使用 Symbol 作为键来访问数据

// 对象字面量中使用Symbol需要使用计算属性
let id = Symbol("id");

let user = {
  name: "John",
  [id]: 123 // 而不是 "id"：123
};
```

- Symbol会在for...in和Object.keys()中被跳过，但会被Object.assign()复制
- 想要相同名字的Symbol具有相同的实体需要使用全局Symbol

```js
// 从全局注册表中读取
let id = Symbol.for("id"); // 如果该 Symbol 不存在，则创建它

// 再次读取（可能是在代码中的另一个位置）
let idAgain = Symbol.for("id");

// 相同的 Symbol
alert( id === idAgain ); // true

// 通过 name 获取 Symbol
let sym = Symbol.for("name");

// 通过 Symbol 获取 name
alert( Symbol.keyFor(sym) ); // name

let localSymbol = Symbol("name");
alert( Symbol.keyFor(localSymbol) ); // undefined，非全局
```

#### 对象的原始值转换

- 不存在布尔值转换，所有对象对应true
- "number" hint：数值转换发生在数学运算（二元加法除外）、显式转换、><大小比较
- "string" hint：字符串转换通常发生在输出、作为属性键等
- "default" hint：当运算符“不确定”期望值的类型时，如二元加法、对象被用于与字符串、数字或 symbol 进行 == 比较等

为了进行转换，JavaScript 尝试查找并调用三个对象方法：
- 调用 obj\[Symbol.toPrimitive\](hint) —— 带有 symbol 键 Symbol.toPrimitive（系统 symbol）的方法，如果这个方法存在的话，
- 否则，如果 hint 是 "string" —— 尝试 obj.toString() 和 obj.valueOf()，无论哪个存在。
- 否则，如果 hint 是 "number" 或 "default" —— 尝试 obj.valueOf() 和 obj.toString()，无论哪个存在。

Symbol.toPrimitive是内建 symbol，它被用来给转换方法命名，没有规定返回值必须对应hint的类型，但是返回值必须为一个原始值而非对象：

```js
obj[Symbol.toPrimitive] = function(hint) {
  // 返回一个原始值
  // hint = "string"、"number" 和 "default" 中的一个
}

let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`hint: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// 转换演示：
alert(user); // hint: string -> {name: "John"}
alert(+user); // hint: number -> 1000
alert(user + 500); // hint: default -> 1500
```

默认情况下，普通对象具有 toString 和 valueOf 方法：
- toString 方法返回一个字符串 "[object Object]"。
- valueOf 方法返回对象自身。
```js
let user = {name: "John"};

alert(user); // [object Object]
alert(user.valueOf() === user); // true

let user = {
  name: "John",
  money: 1000,

  // 对于 hint="string"
  toString() {
    return `{name: "${this.name}"}`;
  },

  // 对于 hint="number" 或 "default"
  valueOf() {
    return this.money;
  }

};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
```

如果我们将对象作为参数传递，则会出现两个阶段：
- 对象被转换为原始值（通过前面我们描述的规则）。
- 如果生成的原始值的类型不正确，则继续进行转换。

### 原始类型方法

为了对对象执行操作（访问其方法和属性），创建了提供额外功能的对象包装器，使用后即被销毁。
```js
let str = "Hello";

alert( str.toUpperCase() ); // HELLO
```
str.toUpperCase() 中实际发生的情况：
- 字符串 str 是一个原始值。因此，在访问其属性时，会创建一个包含字符串字面值的特殊对象，并且具有有用的方法，例如 toUpperCase()。
- 该方法运行并返回一个新的字符串（由 alert 显示）。
- 特殊对象被销毁，只留下原始值 str。

对象包装器仅供内部使用，直接调用其实例化对象会出现bug
```js
alert( typeof 0 ); // "number"

alert( typeof new Number(0) ); // "object"!

let zero = new Number(0);

if (zero) { // zero 为 true，因为它是一个对象
  alert( "zero is truthy?!?" );
}
```

- Number
  - .toString(base)返回base进数字的字符串表示(直接使用数字调用方法需要使用两个.，js会将第一个小数点严寒认为是小数部分)
  - Math.floor, Math.ceil, Math.round, Math.trunc
  - .toFixed(n)将数字round舍入到后n位，并以字符串返回，如果小数部分不足则会补充0
  - isFinite(value)判断value转为数字是否为常规数字，NaN/Infinity/-Infinity返回false
  - isNaN(value)判断value转为数字是否为NaN，NaN不等于任何值，包括自己(NaN===NaN //false)
  - parseInt(str, radix), parseFloat(str, radix)从字符串中“读取”数字，直到无法读取为止。如果发生 error，则返回收集到的数字。函数 parseInt 返回一个整数，而 parseFloat 返回一个浮点数
  - Math.random(), Math.max(a,b,...), Math.min(a,b,...), Math.pow(n, power)
  - Number.EPSILON, Number.MAX_SAFE_INTEGER
- String
  - .length
  - for..of遍历字符串
  - 字符串不可更改
  - .toLowerCase(), .toUpperCase()
  - .indexOf(substr, pos)它从给定位置 pos 开始，在 str 中查找 substr，如果没有找到，则返回 -1，否则返回匹配成功的位置。(if (~str.indexOf(...)) 读作 “if found”)
  - .lastIndexOf(substr, pos)
  - str.includes(substr, pos) 根据 str 中是否包含 substr 来返回 true/false
  - str.startsWith, str.endsWith
  - .slice(start [, end]), .substring(start [, end])(允许start>end，但不支持负参数)， .substr(start [, length])(start允许负值)
  - .codePointAt(pos), String.fromCodePoint(code)
  - .localeCompare(str2)会根据语言规则返回一个整数，这个整数能表明 str 是否在 str2 前，后或者等于它
  - .match()(正则表达式比较), .replace(), .concat(str2, [, ...strN])
  - .padStart(targetLength [, padString]), .padEnd(targetLength [, padString])填充字符串到指定长度并返回新字符串
  - .trim()(删除两端的空格), .trimStart(), .trimEnd(), .repeat(count), .split()
  
#### Array(数组是基于对象创建的)

- .length，减少length会截断数组，设为0会将数组清空
- .toString()返回逗号分隔元素列表，数组没有 Symbol.toPrimitive，也没有 valueOf，它们只能执行 toString 进行转换
- 数组的比较与对象相同，只有引用同一数组的变量才能相等
- .push(), .pop(), .shift(), .unshift()
- 数组可以通过for..of遍历数组元素，通过for..in遍历索引(不推荐)
- arr.splice(start[, deleteCount, elem1, ..., elemN])从索引 start 开始修改 arr：删除 deleteCount 个元素并在当前位置插入 elem1, ..., elemN。最后返回已被删除元素的数组。(delete删除数组元素不会变更数组长度)
- arr.slice(\[start], \[end])会返回一个新数组，将所有从索引 start 到 end（不包括 end）的数组项复制到一个新的数组。arr.slice() 会创建一个 arr 的副本。
- arr.concat(arg1, arg2...)
  
```js
let arr = [1, 2];

let arrayLike = {
  0: "something",
  length: 1
};

alert( arr.concat(arrayLike) ); // 1,2,[object Object]

let arr = [1, 2];

let arrayLike = {
  0: "something",
  1: "else",
  [Symbol.isConcatSpreadable]: true,
  length: 2
};

alert( arr.concat(arrayLike) ); // 1,2,something,else
```

- arr.indexOf(item, from) 从索引 from 开始搜索 item，如果找到则返回索引，否则返回 -1。
- arr.lastIndexOf(item, from) —— 和上面相同，只是从右向左搜索。
- arr.includes(item, from) —— 从索引 from 开始搜索 item，如果找到则返回 true（译注：如果没找到，则返回 false）。

```js
const arr = [NaN];
alert( arr.indexOf(NaN) ); // -1（应该为 0，但是严格相等 === equality 对 NaN 无效）
alert( arr.includes(NaN) );// true（这个结果是对的）
```
  
```js
// 搜索
// arr.findIndex 方法（与 arr.find 方法）基本上是一样的，但它返回找到元素的索引，而不是元素本身。并且在未找到任何内容时返回 -1。
let result = arr.find(function(item, index, array) {
  // 如果返回 true，则返回 item 并停止迭代
  // 对于假值（falsy）的情况，则返回 undefined
});

let results = arr.filter(function(item, index, array) {
  // 如果 true item 被 push 到 results，迭代继续
  // 如果什么都没找到，则返回空数组
});

// 遍历
arr.forEach(function(item, index, array) {
  // ... do something with item
});

// 转换数组
let result = arr.map(function(item, index, array) {
  // 返回新值而不是当前元素
})

// 根据数组计算单个值
let value = arr.reduce(function(accumulator, item, index, array) {
  // ...
}, [initial]);

// 测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。若收到一个空数组，此方法在一切情况下都会返回 true。
arr.every(callback(element[, index[, array]])[, thisArg])

// 测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个Boolean类型的值。如果用一个空数组进行测试，在任何情况下它返回的都是false。
arr.some(callback(element[, index[, array]])[, thisArg])
```

- arr.sort 方法对数组进行 原位（in-place） 排序，更改元素的顺序。(译注：原位是指在此数组内，而非生成一个新数组。)它还返回排序后的数组，但是返回值通常会被忽略，因为修改了 arr 本身。(元素默认情况下被按字符串进行排序)
- arr.reverse(\[deepth]) 方法用于颠倒 arr 中元素的顺序。
- arr.flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
- arr.join(glue)与 split 相反。它会在它们之间创建一串由 glue 粘合的 arr 项。

```js
let arr = [ 1, 2, 15 ];

// 该方法重新排列 arr 的内容
arr.sort();

alert( arr );  // 1, 15, 2

arr.sort(function(a, b) { return a - b; });

alert(arr);  // 1, 2, 15
```
数组是基于对象的，不构成单独的语言类型。所以 typeof 不能帮助从数组中区分出普通对象：
```js
alert(typeof {}); // object
alert(typeof []); // same
alert(Array.isArray({})); // false
alert(Array.isArray([])); // true
```

几乎所有调用函数的数组方法 —— 比如 find，filter，map，除了 sort 是一个特例，都接受一个可选的附加参数 thisArg。thisArg 参数的值在 func 中变为 this。

```js
let army = {
  minAge: 18,
  maxAge: 27,
  canJoin(user) {
    return user.age >= this.minAge && user.age < this.maxAge;
  }
};

let users = [
  {age: 16},
  {age: 20},
  {age: 23},
  {age: 30}
];

// 找到 army.canJoin 返回 true 的 user
let soldiers = users.filter(army.canJoin, army);

alert(soldiers.length); // 2
alert(soldiers[0].age); // 20
alert(soldiers[1].age); // 23
```

#### 可迭代对象

为了让对象可迭代（也就让 for..of 可以运行）我们需要为对象添加一个名为 Symbol.iterator 的方法（一个专门用于使对象可迭代的内置 symbol）。

- 当 for..of 循环启动时，它会调用这个方法（如果没找到，就会报错）。这个方法必须返回一个 迭代器（iterator） —— 一个有 next 方法的对象。
- 从此开始，for..of 仅适用于这个被返回的对象。
- 当 for..of 循环希望取得下一个数值，它就调用这个对象的 next() 方法。
- next() 方法返回的结果的格式必须是 {done: Boolean, value: any}，当 done=true 时，表示迭代结束，否则 value 是下一个值。

```js
let range = {
  from: 1,
  to: 5,
};
range[Symbol.iterator] = fucntion() {
  return {
    current: this.from,
    last: this.to,
    next() {
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      }
      else {
        return { done: true };
      }
    }
  }
}
```
可迭代对象与类数组：
- Iterable 如上所述，是实现了 Symbol.iterator 方法的对象。
- Array-like 是有索引和 length 属性的对象，所以它们看起来很像数组。
- 字符串即是可迭代的（for..of 对它们有效），又是类数组的（它们有数值索引和 length 属性）。
- 一个可迭代对象也许不是类数组对象。反之亦然，类数组对象可能不可迭代。

Array.from(obj[, mapFn, thisArg])接受可迭代或类数组值，返回一个数组。

```js
let arrayLike = {
  0: "Hello",
  1: "World",
  length: 2
};

let arr = Array.from(arrayLike); 
alert(arr.pop()); // World（pop 方法有效）

let arr = Array.from(range);
alert(arr); // 1,2,3,4,5 （数组的 toString 转化方法生效）
```

#### Map和Set

Map 是一个带键的数据项的集合，就像一个 Object 一样。 但是它们最大的差别是 Map 允许任何类型的键（key）。

- new Map() —— 创建 map。
- map.set(key, value) —— 根据键存储值。
- map.get(key) —— 根据键来返回值，如果 map 中不存在对应的 key，则返回 undefined。
- map.has(key) —— 如果 key 存在则返回 true，否则返回 false。
- map.delete(key) —— 删除指定键的值。
- map.clear() —— 清空 map。
- map.size —— 返回当前元素个数。

Map可以将任何值作为key，但Object只允许字符串和symbol作为key，使用其他类型会被转换为string.

```js
let john = { name: "John" };

let visitsCountObj = {}; // 尝试使用对象

visitsCountObj[john] = 123; // 尝试将 john 对象作为键

// 是写成了这样!
alert( visitsCountObj["[object Object]"] ); // 123
```

每一次 map.set 调用都会返回 map 本身，所以我们可以进行“链式”调用：
```js
map.set('1', 'str1')
  .set(1, 'num1')
  .set(true, 'bool1');
```
遍历
```js
let recipeMap = new Map([
  ['cucumber', 500],
  ['tomatoes', 350],
  ['onion',    50]
]);

// 遍历所有的键（vegetables）
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // cucumber, tomatoes, onion
}

// 遍历所有的值（amounts）
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}

// 遍历所有的实体 [key, value]
for (let entry of recipeMap) { // 与 recipeMap.entries() 相同
  alert(entry); // cucumber,500 (and so on)
}

// 对每个键值对 (key, value) 运行 forEach 函数
recipeMap.forEach( (value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 etc
});
```

创建Map：
```js
// 键值对 [key, value] 数组
let map = new Map([
  ['1',  'str1'],
  [1,    'num1'],
  [true, 'bool1']
]);

alert( map.get('1') ); // str1

// Object.entries(obj)方法返回对象的键/值对数组
let obj = {
  name: "John",
  age: 30
};

let map = new Map(Object.entries(obj));

alert( map.get('name') ); // John

//map.entries()也返回一个可迭代键值对，可通过object.fromEntries()创建对象
let map = new Map();
map.set('banana', 1);
map.set('orange', 2);
map.set('meat', 4);

let obj = Object.fromEntries(map.entries()); // 创建一个普通对象（plain object）(*)

// 完成了！
// obj = { banana: 1, orange: 2, meat: 4 }

alert(obj.orange); // 2
```

Set 是一个特殊的类型集合 —— “值的集合”（没有键），它的每一个值只能出现一次。
- new Set(iterable) —— 创建一个 set，如果提供了一个 iterable 对象（通常是数组），将会从数组里面复制值到 set 中。
- set.add(value) —— 添加一个值，返回 set 本身
- set.delete(value) —— 删除值，如果 value 在这个方法调用的时候存在则返回 true ，否则返回 false。
- set.has(value) —— 如果 value 在 set 中，返回 true，否则返回 false。
- set.clear() —— 清空 set。
- set.size —— 返回元素个数。
- for..of或froEach遍历set
- set.keys()和set.values()均遍历并返回所有值
- set.entries()遍历并返回所有的实体（returns an iterable object for entries）[value, value]，它的存在也是为了兼容 Map。

WeakMap and WeakSet
- WeakMap 是类似于 Map 的集合，它仅允许对象作为键，并且一旦通过其他方式无法访问它们，便会将它们与其关联值一同删除。
- WeakSet 是类似于 Set 的集合，它仅存储对象，并且一旦通过其他方式无法访问它们，便会将其删除。
- 它们都不支持引用所有键或其计数的方法和属性。仅允许单个操作。

.keys(), .values(), .entries()方法适用于Map, Set, Array。对于普通对象，类似方法也可用，但是语法上有所不同：
- Object.keys(obj) —— 返回一个包含该对象所有的键的数组。
- Object.values(obj) —— 返回一个包含该对象所有的值的数组。
- Object.entries(obj) —— 返回一个包含该对象所有 [key, value] 键值对的数组。

```js
let prices = {
  banana: 1,
  orange: 2,
  meat: 4,
};

let doublePrices = Object.fromEntries(
  // 转换为数组，之后使用 map 方法，然后通过 fromEntries 再转回到对象
  Object.entries(prices).map(([key, value]) => [key, value * 2])
);

alert(doublePrices.meat); // 8
```

#### 解构赋值

解构赋值 是一种特殊的语法，它使我们可以将数组或对象“拆包”为到一系列变量中，因为有时候使用变量更加方便。解构操作对那些具有很多参数和默认值等的函数也很奏效。

数组解构

```js
// 我们有一个存放了名字和姓氏的数组
let arr = ["Ilya", "Kantor"]

// 解构赋值
// sets firstName = arr[0]
// and surname = arr[1]
let [firstName, surname] = arr;

alert(firstName); // Ilya
alert(surname);  // Kantor

// 使用逗号忽略不需要的元素
let [firstName, , title] = ["Julius", "Caesar", "Consul", "of the Roman Republic"];

alert( title ); // Consul

// 等号右侧可以是任何可迭代对象
let [a, b, c] = "abc"; // ["a", "b", "c"]
let [one, two, three] = new Set([1, 2, 3]);

// 在循环中使用解构
let user = new Map();
user.set("name", "John");
user.set("age", "30");

for (let [key, value] of user) {
  alert(`${key}:${value}`); // name:John, then age:30
}

// 使用...获取剩余元素
let [name1, name2, ...rest] = ["Julius", "Caesar", "Consul", "of the Roman Republic"];
alert(rest.length); // 2

// 变量数量多于实际元素数量则赋值undefined，也可以为变量指定默认值
// 默认值只会在变量未被赋值时调用
let [firstName, surname] = [];
let [name = "Guest", surname = "Anonymous"] = ["Julius"];
```

对象解构

```js
let {var1, var2} = {var1:…, var2:…}

// 把一个属性赋值给另一个名字的变量
let {width: w, height: h, title} = options;

// 设置默认值
let {width = 100, height = 200, title} = options;

// 处理剩余属性
let {title, ...rest} = options;

// 默认情况下{...}被当做代码块处理导致报错
{title, width, height} = {title: "Menu", width: 200, height: 100};
({title, width, height} = {title: "Menu", width: 200, height: 100});
```

嵌套解构

```js
let options = {
  size: {
    width: 100,
    height: 200
  },
  items: ["Cake", "Donut"],
  extra: true
};

// 为了清晰起见，解构赋值语句被写成多行的形式
let {
  size: { // 把 size 赋值到这里
    width,
    height
  },
  items: [item1, item2], // 把 items 赋值到这里
  title = "Menu" // 在对象中不存在（使用默认值）
} = options;

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
alert(item1);  // Cake
alert(item2);  // Donut
```

函数参数中使用解构

```js
function({
  incomingProperty: varName = defaultValue
  ...
})

// 这种解构假定了函数确实存在参数
showMenu({}); // 不错，所有值都取默认值
showMenu(); // 这样会导致错误
// 通过指定空对象 {} 为整个参数对象的默认值来解决这个问题
function showMenu({ title = "Menu", width = 100, height = 200 } = {}) {
  alert( `${title} ${width} ${height}` );
}
```

#### 日期和时间

- 在 JavaScript 中，日期和时间使用 Date 对象来表示。我们不能只创建日期，或者只创建时间，Date 对象总是同时创建两者。
- 月份从 0 开始计数（对，一月是 0）。
- 一周中的某一天 getDay() 同样从 0 开始计算（0 代表星期日）。
- 当设置了超出范围的组件时，Date 会进行自我校准。这一点对于日/月/小时的加减很有用。
- 日期可以相减，得到的是以毫秒表示的两者的差值。因为当 Date 被转换为数字时，Date 对象会被转换为时间戳。
- 使用 Date.now() 可以更快地获取当前时间的时间戳。

#### JSON

- JSON.stringify 将对象转换为 JSON。
- JSON.parse 将 JSON 转换回对象。
- JSON会忽略：函数属性（方法）；Symbol 类型的属性；存储 undefined 的属性；
- JSON转换的对象不能存在循环引用
- 对象通过实现toJSON来自定义序列化方式，在JSON.parse(str, \[reviver])中通过传入revicer函数来完成自定义序列化的反序列化。

### 函数进阶

执行上下文和堆栈：当一个函数进行嵌套调用时，将发生以下的事儿：
- 当前函数被暂停；
- 与它关联的执行上下文被一个叫做 执行上下文堆栈 的特殊数据结构保存；
- 执行嵌套调用；
- 嵌套调用结束后，从堆栈中恢复之前的执行上下文，并从停止的位置恢复外部函数。
递归深度等于堆栈中上下文的最大数量。

Rest参数：Rest 参数可以通过使用三个点 ... 并在后面跟着包含剩余参数的数组名称，来将它们包含在函数定义中。这些点的字面意思是“将剩余参数收集到一个数组中”，Rest 参数必须放到参数列表的末尾。

```js
function sumAll(...args) { // 数组名为 args
  let sum = 0;

  for (let arg of args) sum += arg;

  return sum;
}
```

arguments变量：有一个名为 arguments 的特殊的类数组对象，该对象按参数索引包含所有参数。箭头函数没有该参数，在箭头函数中访问 arguments，访问到的 arguments 并不属于箭头函数，而是属于箭头函数外部的“普通”函数。

```js
function showName() {
  alert( arguments.length );
  alert( arguments[0] );
  alert( arguments[1] );

  // 它是可遍历的
  // for(let arg of arguments) alert(arg);
}

// 依次显示：2，Julius，Caesar
showName("Julius", "Caesar");

// 依次显示：1，Ilya，undefined（没有第二个参数）
showName("Ilya");

function f() {
  let showArg = () => alert(arguments[0]);
  showArg();
}

f(1); // 1
```

Spread语法：当在函数调用中使用 ...arr 时，它会把可迭代对象 arr “展开”到参数列表中。

```js
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5（spread 语法把数组转换为参数列表）

let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(...arr1, ...arr2) ); // 8

// 也可用于合并数组
let merged = [0, ...arr, 2, ...arr2];

// 用于获取array副本
let arr = [1, 2, 3];
let arrCopy = [...arr];
alert(arr === arrCopy); // false（它们的引用是不同的）

// 获取object副本
let obj = { a: 1, b: 2, c: 3 };
let objCopy = { ...obj };
alert(obj === objCopy); // false
```

#### 变量作用域和闭包

考虑嵌套函数：

```js
function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1
alert( counter() ); // 2
```

[词法环境详细解释](https://zh.javascript.info/closure)

闭包：是指使用一个特殊的属性 \[\[Environment]] 来记录函数自身的创建时的环境的函数。它具体指向了函数创建时的词法环境。

具体是指内部函数总是可以访问其所在的外部函数中声明的变量和参数，即使在其外部函数被返回（寿命终结）了之后。在 JavaScript 中，所有函数都是天生闭包的，JavaScript 中的函数会自动通过隐藏的 \[\[Environment]] 属性记住创建它们的位置，所以它们都可以访问外部变量。

通常，函数调用完成后，会将词法环境和其中的所有变量从内存中删除。因为现在没有任何对它们的引用了。与 JavaScript 中的任何其他对象一样，词法环境仅在可达时才会被保留在内存中。但是，如果有一个嵌套的函数在函数结束后仍可达，则它将具有引用词法环境的 \[\[Environment]] 属性。

```js
function f() {
  let value = 123;

  return function() {
    alert(value);
  }
}

let g = f(); // g.[[Environment]] 存储了对相应 f() 调用的词法环境的引用

g = null; // ……现在内存被清理了
```

var:

- var没有块级作用域，用 var 声明的变量，不是函数作用域就是全局作用域。它们在代码块外也是可见的。
- var允许重新声明，如果我们对一个已经声明的变量使用 var，这条新的声明语句会被忽略而作为简单的赋值。
- var声明的变量，可以在其声明语句前被使用，声明会被提升，但是赋值不会。

立即调用函数表达式（IIFE）

```js
(function() {

  var message = "Hello";

  alert(message); // Hello

})();

// 报错，因为js遇到function会当成函数声明的开始，但函数声明必须有函数名
function() { // <-- Error: Function statements require a function name

  var message = "Hello";

  alert(message); // Hello

}();

// 错误
function go() {

}(); // <-- 不能立即调用函数声明

// 创建 IIFE 的方法

(function() {
  alert("Parentheses around the function");
})();

(function() {
  alert("Parentheses around the whole thing");
}());

!function() {
  alert("Bitwise NOT operator starts the expression");
}();

+function() {
  alert("Unary plus starts the expression");
}();
```

```js
function sayHi() {
  phrase = "Hello";

  alert(phrase);

  var phrase;
}
sayHi();

// 效果一致
function sayHi() {
  var phrase;

  phrase = "Hello";

  alert(phrase);
}
sayHi();

// 效果也一致
function sayHi() {
  phrase = "Hello"; // (*)

  if (false) {
    var phrase;
  }

  alert(phrase);
}
sayHi();
```

#### 全局对象

- 在浏览器中，它的名字是 “window”，对 Node.js 而言，它的名字是 “global”，其它环境可能用的是别的名字。最近，globalThis 被作为全局对象的标准名称加入到了 JavaScript 中，所有环境都应该支持该名称。
- 全局对象的所有属性都可以被直接访问
- 在浏览器中，使用 var（而不是 let/const！）声明的全局函数和变量会成为全局对象的属性。
- 如果一个值非常重要，以至于你想使它在全局范围内可用，那么可以直接将其作为属性写入

#### 函数对象

- 属性name上下文命名，如果函数自己没有提供，那么在赋值中，会根据上下文来推测一个，无法推测正确名字将但会空字符串
- 属性length：它返回函数入参的个数，rest参数不参与计数
- 自定义属性：被赋值给函数的属性，比如 sayHi.counter = 0，不会 在函数内定义一个局部变量 counter。换句话说，属性 counter 和变量 let counter 是毫不相关的两个东西。

使用函数代替闭包中的嵌套函数外部变量：
```js
function makeCounter() {
  // 不需要这个了
  // let count = 0

  function counter() {
    return counter.count++;
  };

  counter.count = 0;

  return counter;
}

let counter = makeCounter();
alert( counter() ); // 0
alert( counter() ); // 1
```

命名函数表达式（NFE，Named Function Expression），指带有名字的函数表达式的术语。
- 它允许函数在内部引用自己。
- 它在函数外是不可见的。

```js
let sayHi = function func(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    func("Guest"); // 使用 func 再次调用函数自身
  }
};

sayHi(); // Hello, Guest

// 但这不工作：
func(); // Error, func is not defined（在函数外不可见）

// 直接使用变量名嵌套调用，当函数被赋值给另一个变量事就会导致报错
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    sayHi("Guest");
  }
};
let welcome = sayHi;
sayHi = null;

welcome(); // Error，嵌套调用 sayHi 不再有效！
```

new Function语法

使用 new Function 创建函数的应用场景非常特殊，比如在复杂的 Web 应用程序中，我们需要从服务器获取代码或者动态地从模板编译函数时才会使用。
```js
let func = new Function ([arg1, arg2, ...argN], functionBody);

let sum = new Function('a', 'b', 'return a + b');

alert( sum(1, 2) ); // 3
```

使用 new Function 创建一个函数，那么该函数的 \[\[Environment]] 并不指向当前的词法环境，而是指向全局环境。
因此，此类函数无法访问外部（outer）变量，只能访问全局变量。原因在于：即使我们可以在 new Function 中访问外部词法环境，我们也会受挫于压缩程序。

```js
function getFunc() {
  let value = "test";

  let func = new Function('alert(value)');

  return func;
}

getFunc()(); // error: value is not defined
```

#### 调度

setTimeout：允许我们将函数推迟到一段时间间隔之后再执行，并返回一个定时器标识符。
```js
let timerId = setTimeout(func|code, [delay], [arg1], [arg2], ...)

// 取消调度
clearTimeout(timerId);
```

setInterval：与 setTimeout 只执行一次不同，setInterval 是每间隔给定的时间周期性执行。

```js
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)

// 每 2 秒重复一次(alert 弹窗显示的时候计时器依然在进行计时)
let timerId = setInterval(() => alert('tick'), 2000);

// 5 秒之后停止
setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);

/** instead of:
let timerId = setInterval(() => alert('tick'), 2000);
*/
// 嵌套的 setTimeout 要比 setInterval 灵活得多。采用这种方式可以根据当前执行结果来调度下一次调用，因此下一次调用可以与当前这一次不同
let timerId = setTimeout(function tick() {
  alert('tick');
  timerId = setTimeout(tick, 2000); // (*)
}, 2000);
// 嵌套的 setTimeout 能够精确地设置两次执行之间的延时，而 setInterval 却不能。
let i = 1;
setInterval(function() {
  func(i++);
}, 100);

let i = 1;
setTimeout(function run() {
  func(i++);
  setTimeout(run, 100);
}, 100);
```

当一个函数传入 setInterval/setTimeout 时，将为其创建一个内部引用，并保存在调度程序中。这样，即使这个函数没有其他引用，也能防止垃圾回收器（GC）将其回收。

零延时setTimeout：setTimeout(func, 0)，或者仅仅是 setTimeout(func)，这样调度可以让 func 尽快执行。但是只有在当前正在执行的脚本执行完成后，调度程序才会调用它。

```js
let i = 0;

setTimeout(() => alert(i), 100); // 100000000

// 假设这段代码的运行时间 >100ms
for(let j = 0; j < 100000000; j++) {
  i++;
}
```

在浏览器环境下，嵌套定时器的运行频率是受限制的。根据 HTML5 标准 所讲：“经过 5 重嵌套定时器之后，时间间隔被强制设定为至少 4 毫秒”。

#### 装饰器模式和转发，call/apply

透明缓存

装饰器（decorator）：一个特殊的函数，它接受另一个函数并改变它的行为。
```js
function slow(x) {
  // 这里可能会有重负载的 CPU 密集型工作
  alert(`Called with ${x}`);
  return x;
}

function cachingDecorator(func) {
  let cache = new Map();

  return function(x) {
    if (cache.has(x)) {    // 如果缓存中有对应的结果
      return cache.get(x); // 从缓存中读取结果
    }

    let result = func(x);  // 否则就调用 func

    cache.set(x, result);  // 然后将结果缓存（记住）下来
    return result;
  };
}

slow = cachingDecorator(slow);

alert( slow(1) ); // slow(1) 被缓存下来了
alert( "Again: " + slow(1) ); // 一样的

alert( slow(2) ); // slow(2) 被缓存下来了
alert( "Again: " + slow(2) ); // 和前面一行结果相同
```

这样创建的装饰器不能适用于对象方法，因为对象方法内如果包含上下文信息将在装饰器调用中失去这些信息，因此需要call方法：
```js
// 运行 func，提供的第一个参数作为 this，后面的作为参数（arguments）
func.call(context, arg1, arg2, ...)

// 这两个调用几乎相同
func(1, 2, 3);
func.call(obj, 1, 2, 3)

function sayHi() {
  alert(this.name);
}

let user = { name: "John" };
let admin = { name: "Admin" };

// 使用 call 将不同的对象传递为 "this"
sayHi.call( user ); // John
sayHi.call( admin ); // Admin

// 可以在包装器中使用 call 将上下文传递给原始函数
let worker = {
  slow(min, max) {
    alert(`Called with ${min},${max}`);
    return min + max;
  }
};

function cachingDecorator(func, hash) {
  let cache = new Map();
  return function() {
    let key = hash(arguments); // (*)
    if (cache.has(key)) {
      return cache.get(key);
    }

    let result = func.call(this, ...arguments); // (**)

    cache.set(key, result);
    return result;
  };
}

function hash(args) {
  return args[0] + ',' + args[1];
}

worker.slow = cachingDecorator(worker.slow, hash);

alert( worker.slow(3, 5) ); // works
alert( "Again " + worker.slow(3, 5) ); // same (cached)
```

可以使用 func.apply(this, arguments) 代替 func.call(this, ...arguments)，它运行 func 设置 this=context，并使用类数组对象 args 作为参数列表（arguments）。call 和 apply 之间唯一的语法区别是，call 期望一个参数列表，而 apply 期望一个包含这些参数的类数组对象。

当我们期望可迭代对象时，使用 call，当我们期望类数组对象时，使用 apply。对于即可迭代又是类数组的对象，例如一个真正的数组，我们使用 call 或 apply 均可，但是 apply 可能会更快，因为大多数 JavaScript 引擎在内部对其进行了优化。

```js
func.apply(context, args)

// 与直接调用函数相同
let wrapper = function() {
  return func.apply(this, arguments);
};
```

方法借用

arguments 对象既是可迭代对象又是类数组对象，但它并不是真正的数组，因此直接调用join方法会报错
```js

function hash() {
  alert( arguments.join() ); // Error: arguments.join is not a function
}

hash(1, 2);

// 从常规数组 [].join 中获取（借用）join 方法，并使用 [].join.call 在 arguments 的上下文中运行它
function hash() {
  alert( [].join.call(arguments) ); // 1,2
}

hash(1, 2);
```

原因在于原生方法 arr.join(glue) 的内部算法非常简单。从规范中几乎“按原样”解释如下：

- 让 glue 成为第一个参数，如果没有参数，则使用逗号 ","。
- 让 result 为空字符串。
- 将 this[0] 附加到 result。
- 附加 glue 和 this[1]。
- 附加 glue 和 this[2]。
- ……以此类推，直到 this.length 项目被粘在一起。
- 返回 result。

```js
// 防抖装饰器
// 调用 debounce 会返回一个包装器。当它被调用时，它会安排一个在给定的 ms 之后对原始函数的调用，并取消之前的此类超时。
function debounce(f, ms) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    setTimeout(()=>f.apply(this, arguments), ms);
  }
}

// 节流装饰器
function throttle(f, ms) {
  let isThrottled = false;
  let savedAtgs;
  let savedThis;
  function wrapper() {
    if (isThrottled) {
      return
    }
    f.apply(this, arguments);
    isThrottled = true;
    setTimeout(()=>{
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
      }, null);
  }
  return wrapper
}
```

#### 函数绑定

一旦方法被传递到与对象分开的某个地方 —— this 就丢失。
```js
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(user.sayHi, 1000); // Hello, undefined!

let f = user.sayHi;
setTimeout(f, 1000); // 丢失了 user 上下文
```
浏览器中的 setTimeout 方法有些特殊：它为函数调用设定了 this=window（对于 Node.js，this 则会变为计时器（timer）对象，但在这儿并不重要）。所以对于 this.firstName，它其实试图获取的是 window.firstName，这个变量并不存在。在其他类似的情况下，通常 this 会变为 undefined。

```js
// 1.使用包装函数使其从外部词法环境中获取到user
// 这种方法在调度执行前user发生变化会导致调用错误对象
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(function() {
  user.sayHi(); // Hello, John!
}, 1000);

setTimeout(() => user.sayHi(), 1000); // Hello, John!

// 2.bind 将context传递给func并设定this=context
// 函数对象不能被重复绑定
let boundFunc = func.bind(context);

let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

let sayHi = user.sayHi.bind(user); // (*)

// 可以在没有对象（译注：与对象分离）的情况下运行它
sayHi(); // Hello, John!

setTimeout(sayHi, 1000); // Hello, John!

// 即使 user 的值在不到 1 秒内发生了改变
// sayHi 还是会使用预先绑定（pre-bound）的值，该值是对旧的 user 对象的引用
user = {
  sayHi() { alert("Another user in setTimeout!"); }
};
```
bind还可以用于绑定参数
```js
let bound = func.bind(context, [arg1], [arg2], ...);

function mul(a, b) {
  return a * b;
}
// 绑定参数的函数被称为偏函数
let double = mul.bind(null, 2);

alert( double(3) ); // = mul(2, 3) = 6
alert( double(4) ); // = mul(2, 4) = 8
alert( double(5) ); // = mul(2, 5) = 10
```

#### 箭头函数

箭头函数没有this，访问this时会从外部获取，因此也不能使用构造器new

```js
let group = {
  title: "Our Group",
  students: ["John", "Pete", "Alice"],

  showList() {
    this.students.forEach(
      student => alert(this.title + ': ' + student)
    );
  }
};

group.showList();

let group = {
  title: "Our Group",
  students: ["John", "Pete", "Alice"],

  showList() {
    this.students.forEach(function(student) {
      // Error: Cannot read property 'title' of undefined
      alert(this.title + ': ' + student)
    });
  }
};

group.showList();
```

报错是因为 forEach 运行它里面的这个函数，但是这个函数的 this 为默认值 this=undefined，因此就出现了尝试访问 undefined.title 的情况。

箭头函数也没有arguments变量，因此在装饰器转发调用时可以直接使用当前的this和arguments

```js
function defer(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms)
  };
}

function sayHi(who) {
  alert('Hello, ' + who);
}

let sayHiDeferred = defer(sayHi, 2000);
sayHiDeferred("John"); // 2 秒后显示：Hello, John

// 不使用箭头函数
function defer(f, ms) {
  return function(...args) {
    let ctx = this;
    setTimeout(function() {
      return f.apply(ctx, args);
    }, ms);
  };
}
```

### 对象属性配置

属性标志：
- writable — 如果为 true，则值可以被修改，否则它是只可读的。
- enumerable — 如果为 true，则会被在循环中列出，否则不会被列出。
- configurable — 如果为 true，则此特性可以被删除，这些属性也可以被修改，否则不可以。
- Object.getOwnPropertyDescriptor(obj, propertyName) 方法允许查询有关属性的完整信息。使属性变成不可配置是一条单行道。我们无法使用 defineProperty 把它改回去。
- Object.defineProperty(obj, propertyName, descriptor)用于修改标志。
- Object.defineProperties(obj, descriptors)，允许一次定义多个属性。
- 要一次获取所有属性描述符，我们可以使用 Object.getOwnPropertyDescriptors(obj) 方法。

访问器属性：
```js
let obj = {
  get propName() {
    // 当读取 obj.propName 时，getter 起作用
  },

  set propName(value) {
    // 当执行 obj.propName = value 操作时，setter 起作用
  }
};

let user = {
  name: "John",
  surname: "Smith",

  get fullName() {
    return `${this.name} ${this.surname}`;
  },

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  }
};

// set fullName 将以给定值执行
user.fullName = "Alice Cooper";

alert(user.name); // Alice
alert(user.surname); // Cooper
```

### 原型与继承

在 JavaScript 中，对象有一个特殊的隐藏属性 [[Prototype]]（如规范中所命名的），它要么为 null，要么就是对另一个对象的引用。该对象被称为“原型”，当我们从 object 中读取一个缺失的属性时，JavaScript 会自动从原型中获取该属性。在编程中，这种行为被称为“原型继承”。

```js
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

rabbit.__proto__ = animal; // 设置 rabbit.[[Prototype]] = animal
alert( rabbit.eats ); // true
```

- 引用不能形成闭环。如果我们试图在一个闭环中分配 __proto__，JavaScript 会抛出错误。
- __proto__ 的值可以是对象，也可以是 null。而其他的类型都会被忽略。
- 只能有一个 [[Prototype]]。一个对象不能从其他两个对象获得继承。
- __proto__ 属性有点过时了。它的存在是出于历史的原因，现代编程语言建议我们应该使用函数 Object.getPrototypeOf/Object.setPrototypeOf 来取代 __proto__ 去 get/set 原型。

无论在哪里找到方法：在一个对象还是在原型中。在一个方法调用中，this 始终是点符号 . 前面的对象。因此，setter 调用 admin.fullName= 使用 admin 作为 this，而不是 user。

```js
let user = {
  name: "John",
  surname: "Smith",

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  },

  get fullName() {
    return `${this.name} ${this.surname}`;
  }
};

let admin = {
  __proto__: user,
  isAdmin: true
};

alert(admin.fullName); // John Smith (*)

// setter triggers!
admin.fullName = "Alice Cooper"; // (**)

alert(admin.fullName); // Alice Cooper，admin 的内容被修改了
alert(user.fullName);  // John Smith，user 的内容被保护了
```

for..in 循环也会迭代继承的属性（不可枚举的属性除外），但是可以通过obj.hasOwnProperty(key)过滤掉集成的属性
```js
let animal = {
  eats: true
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

for(let prop in rabbit) {
  let isOwn = rabbit.hasOwnProperty(prop);

  if (isOwn) {
    alert(`Our: ${prop}`); // Our: jumps
  } else {
    alert(`Inherited: ${prop}`); // Inherited: eats
  }
}
```

F.prototype：使用new F()创建对象时，new操作符将会使F.prototype成为新对象的\[\[Prototype]]。每个函数都有默认的prototype属性，默认的prototype只有一个属性constructor，其指向函数自身。prototype中的属性可以通过\[\[Prototype]]给所有实例使用；为了确保正确的 "constructor"，我们可以选择添加/删除属性到默认 "prototype"，而不是将其整个覆盖，也可以手动重新创建 constructor 属性。

```js
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

alert( Rabbit.prototype.constructor == Rabbit ); // true

let rabbit = new Rabbit(); // inherits from {constructor: Rabbit}

alert(rabbit.constructor == Rabbit); // true (from prototype)

// 可以使用 constructor 属性来创建一个新对象，该对象使用与现有对象相同的构造器
let rabbit2 = new rabbit.constructor("Black Rabbit");

function Rabbit() {}

// 不要将 Rabbit.prototype 整个覆盖
// 可以向其中添加内容
Rabbit.prototype.jumps = true
// 默认的 Rabbit.prototype.constructor 被保留了下来

// or
Rabbit.prototype = {
  jumps: true,
  constructor: Rabbit
};
```
举例
```js
// 对象被prototype通过复制操作赋予了实例的[[Prototype]]，更改prototype的指向不影响被实例引用的原对象
function Rabbit() {}
Rabbit.prototype = {
  eats: true
};

let rabbit = new Rabbit();

Rabbit.prototype = {};

alert( rabbit.eats ); // true

// 通过prototype修改其指向的对象的值，指向相同对象的实例[[Prototype]]也发生变化
function Rabbit() {}
Rabbit.prototype = {
  eats: true
};

let rabbit = new Rabbit();

Rabbit.prototype.eats = false;

alert( rabbit.eats ); // false

// delete 操作都直接应用于对象。这里的 delete rabbit.eats 试图从 rabbit 中删除 eats 属性，但 rabbit 对象并没有 eats 属性
function Rabbit() {}
Rabbit.prototype = {
  eats: true
};

let rabbit = new Rabbit();

delete rabbit.eats;

alert( rabbit.eats ); // true

function Rabbit() {}
Rabbit.prototype = {
  eats: true
};

let rabbit = new Rabbit();

delete Rabbit.prototype.eats;

alert( rabbit.eats ); // undefined
```

- 首先，它在 user 中寻找 constructor。没找到。
- 然后它追溯原型链。user 的原型是 User.prototype，它也什么都没有。
- User.prototype 的值是一个普通对象 {}，该对象的原型是 Object.prototype。并且 Object.prototype.constructor == Object。所以就用它了。
- 最后，我们有 let user2 = new Object('Pete')。内建的 Object 构造函数会忽略参数，它总是创建一个类似于 let user2 = {} 的空对象，这就是最后我们在 user2 中拥有的东西。

```js
function User(name) {
  this.name = name;
}
User.prototype = {}; // (*)

let user = new User('John');
let user2 = new user.constructor('Pete');

alert( user2.name ); // undefined
```

#### 原生的原型

obj是一个空对象，obj={}等价于new Object()，因此生成字符串的toString方法来自于obj.__proto__，即Obejct.prototype；而Object.prototype上方的链中没有更多的\[\[Prototype]]，而是指向null。

```js
let obj = {};
alert( obj ); // "[object Object]" ?
```

其他内建对象都在prototype上挂载了方法，而所有内奸原型顶端都是Object.prototype。

```js
let arr = [1, 2, 3];

// 它继承自 Array.prototype？
alert( arr.__proto__ === Array.prototype ); // true

// 接下来继承自 Object.prototype？
alert( arr.__proto__.__proto__ === Object.prototype ); // true

// 原型链的顶端为 null。
alert( arr.__proto__.__proto__.__proto__ ); // null
```

基本数据类型的值不是对象，但如果我们试图访问它们的属性，那么临时包装器对象将会通过内建的构造器 String、Number 和 Boolean 被创建。它们提供给我们操作字符串、数字和布尔值的方法然后消失。这些对象的方法也驻留在它们的 prototype 中，可以通过 String.prototype、Number.prototype 和 Boolean.prototype 进行获取。特殊值 null 和 undefined 比较特殊。它们没有对象包装器，所以它们没有方法和属性。并且它们也没有相应的原型。

原生的原型可以也被修改，但是原型是全局的，所以很容易造成冲突。如果有两个库都添加了 String.prototype.show 方法，那么其中的一个方法将被另一个覆盖。在现代编程中，只有一种情况下允许修改原生原型，那就是 polyfilling。

```js
String.prototype.show = function() {
  alert(this);
};

"BOOM!".show(); // BOOM!

// polyfilling
if (!String.prototype.repeat) { // 如果这儿没有这个方法
  // 那就在 prototype 中添加它

  String.prototype.repeat = function(n) {
    // 重复传入的字符串 n 次

    // 实际上，实现代码比这个要复杂一些（完整的方法可以在规范中找到）
    // 但即使是不够完美的 polyfill 也常常被认为是足够好的
    return new Array(n + 1).join(this);
  };
}

alert( "La".repeat(3) ); // LaLaLa

// 也可以在自定义的对象中借用原生对象的方法
let obj = {
  0: "Hello",
  1: "world!",
  length: 2,
};

obj.join = Array.prototype.join;

alert( obj.join(',') ); // Hello,world!
```

对proto进行操作的现代方法：
- Object.create(proto, \[descriptors]) —— 利用给定的 proto 作为 \[\[Prototype]] 和可选的属性描述来创建一个空对象。
- Object.getPrototypeOf(obj) —— 返回对象 obj 的 \[\[Prototype]]。
- Object.setPrototypeOf(obj, proto) —— 将对象 obj 的 \[\[Prototype]] 设置为 proto。

```js
let animal = {
  eats: true
};

// 创建一个以 animal 为原型的新对象
let rabbit = Object.create(animal);

alert(rabbit.eats); // true

alert(Object.getPrototypeOf(rabbit) === animal); // true

Object.setPrototypeOf(rabbit, {}); // 将 rabbit 的原型修改为 {}

// Object.create 有一个可选的第二参数：属性描述器。我们可以在此处为新对象提供额外的属性
let animal = {
  eats: true
};

let rabbit = Object.create(animal, {
  jumps: {
    value: true
  }
});

alert(rabbit.jumps); // true

// Object.create可以用于对象克隆
let clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
```

Very plain Objects：对象可以用作关联数组（associative arrays）来存储键/值对，但是__proto__ 属性很特别：它必须是对象或者 null，字符串不能成为 prototype。为了解决这个问题除了使用Map代替Object，还可以使用Very Plain Object：
```js
let obj = Object.create(null);

let key = prompt("What's the key?", "__proto__");
obj[key] = "some value";

alert(obj[key]); // "some value"

let chineseDictionary = Object.create(null);
chineseDictionary.hello = "你好";
chineseDictionary.bye = "再见";

alert(Object.keys(chineseDictionary)); // hello,bye
```
以null为原型创建对象，其没有__proto__属性，也不会从任何对象继承内建方法，大多数与对象相关的方法都是 Object.something(...)，例如 Object.keys(obj) —— 它们不在 prototype 中，因此在 “very plain” 对象中它们还是可以继续使用。

```js
function Rabbit(name) {
  this.name = name;
}
Rabbit.prototype.sayHi = function() {
  alert(this.name);
};

let rabbit = new Rabbit("Rabbit");

rabbit.sayHi();
Rabbit.prototype.sayHi();
Object.getPrototypeOf(rabbit).sayHi();
rabbit.__proto__.sayHi();
```

### Class

基本语法
```js
class MyClass {
  // class 方法
  constructor() { ... }
  method1() { ... }
  method2() { ... }
  method3() { ... }
  ...
}

class User {
  constructor(name) { this.name = name; }
  sayHi() { alert(this.name); }
}

// 佐证：User 是一个函数
alert(typeof User); // function
```

class User {...} 构造实际上做了如下的事儿：

- 创建一个名为 User 的函数，该函数成为类声明的结果。该函数的代码来自于 constructor 方法（如果我们不编写这种方法，那么它就被假定为空）。
- 存储类中的方法，例如 User.prototype 中的 sayHi。

```js
// 用纯函数重写 class User

// 1. 创建构造器函数
function User(name) {
  this.name = name;
}
// 函数的原型（prototype）默认具有 "constructor" 属性，
// 所以，我们不需要创建它

// 2. 将方法添加到原型
User.prototype.sayHi = function() {
  alert(this.name);
};

// 用法：
let user = new User("John");
user.sayHi();
```

使用class和使用函数创建的类存在差异：

- 通过 class 创建的函数具有特殊的内部属性标记 \[\[FunctionKind]]:"classConstructor"。编程语言会在许多地方检查该属性。例如，与普通函数不同，必须使用 new 来调用它，大多数 JavaScript 引擎中的类构造器的字符串表示形式都以 “class…” 开头：

```js
class User {
  constructor() {}
}

alert(typeof User); // function
User(); // Error: Class constructor User cannot be invoked without 'new'

alert(User); // class User { ... }
```

- 类方法不可枚举。 类定义将 "prototype" 中的所有方法的 enumerable 标志设置为 false，因为如果我们对一个对象调用 for..in 方法，我们通常不希望 class 方法出现。
- 类总是使用 use strict。 在类构造中的所有代码都将自动进入严格模式。

```js
// “命名类表达式（Named Class Expression）”
// (规范中没有这样的术语，但是它和命名函数表达式类似)
let User = class MyClass {
  sayHi() {
    alert(MyClass); // MyClass 这个名字仅在类内部可见
  }
};

new User().sayHi(); // 正常运行，显示 MyClass 中定义的内容

alert(MyClass); // error，MyClass 在外部不可见

// get/set
class User {

  constructor(name) {
    // 调用 setter
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value.length < 4) {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }
  // 计算属性名
  ['say' + 'Hi']() {
    alert("Hello");
  }

}

let user = new User("John");
alert(user.name); // John

user = new User(""); // Name is too short.
```

Class字段：“类字段”是一种允许添加任何属性的语法。

```js
class User {
  name = "John";
}

let user = new User();
alert(user.name); // John
alert(User.prototype.name); // undefined

// 类字段提供了一种新的this绑定方法
// 类字段 click = () => {...} 是基于每一个对象被创建的，在这里对于每一个 Button 对象都有一个独立的方法，在内部都有一个指向此对象的 this。我们可以把 button.click 传递到任何地方，而且 this 的值总是正确的。
class Button {
  constructor(value) {
    this.value = value;
  }
  click = () => {
    alert(this.value);
  }
}

let button = new Button("hello");

setTimeout(button.click, 1000); // hello
```

类继承
```js
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  run(speed) {
    this.speed = speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }
  stop() {
    this.speed = 0;
    alert(`${this.name} stands still.`);
  }
}

let animal = new Animal("My animal");

// 在内部，关键字 extends 使用了很好的旧的原型机制进行工作。它将 Rabbit.prototype.[[Prototype]] 设置为 Animal.prototype。所以，如果在 Rabbit.prototype 中找不到一个方法，JavaScript 就会从 Animal.prototype 中获取该方法。
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}

let rabbit = new Rabbit("White Rabbit");

rabbit.run(5); // White Rabbit runs with speed 5.
rabbit.hide(); // White Rabbit hides!
```
在重写父类方法时，class提供了super关键字：

- 执行 super.method(...) 来调用一个父类方法。
- 执行 super(...) 来调用一个父类 constructor（只能在我们的 constructor 中）。
- 箭头函数没有super，被访问时会从外部函数获取。

```js
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }

  stop() {
    super.stop(); // 调用父类的 stop
    this.hide(); // 然后 hide
  }
}

let rabbit = new Rabbit("White Rabbit");

rabbit.run(5); // White Rabbit 以速度 5 奔跑
rabbit.stop(); // White Rabbit 停止了。White rabbit hide 了！
```

继承类的 constructor 必须调用 super(...)，并且一定要在使用 this 之前调用。在 JavaScript 中，继承类（所谓的“派生构造器”，英文为 “derived constructor”）的构造函数与其他函数之间是有区别的。派生构造器具有特殊的内部属性 \[\[ConstructorKind]]:"derived"。这是一个特殊的内部标签。该标签会影响它的 new 行为：

- 当通过 new 执行一个常规函数时，它将创建一个空对象，并将这个空对象赋值给 this。
- 但是当继承的 constructor 执行时，它不会执行此操作。它期望父类的 constructor 来完成这项工作。

```js
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  // ...
}

class Rabbit extends Animal {

  constructor(name, earLength) {
    this.speed = 0;
    this.name = name;
    this.earLength = earLength;
  }

  // ...
}

// 不工作！
let rabbit = new Rabbit("White Rabbit", 10); // Error: this is not defined.
```

重写类字段

```js
// 换句话说， 父类构造器总是会使用它自己字段的值，而不是被重写的那一个。
class Animal {
  name = 'animal';

  constructor() {
    alert(this.name); // (*)
  }
}

class Rabbit extends Animal {
  name = 'rabbit';
}

new Animal(); // animal
new Rabbit(); // animal
```

实际上，原因在于字段初始化的顺序。类字段是这样初始化的：

- 对于基类（还未继承任何东西的那种），在构造函数调用前初始化。
- 对于派生类，在 super() 后立刻初始化。

super运行机制

通过this.__proto__.method的方法来实现super并不可行：
```js
let animal = {
  name: "Animal",
  eat() {
    alert(`${this.name} eats.`);
  }
};

let rabbit = {
  __proto__: animal,
  eat() {
    // ...bounce around rabbit-style and call parent (animal) method
    this.__proto__.eat.call(this); // (*)
  }
};

let longEar = {
  __proto__: rabbit,
  eat() {
    // ...do something with long ears and call parent (rabbit) method
    this.__proto__.eat.call(this); // (**)
  }
};

longEar.eat(); // Error: Maximum call stack size exceeded
```

为了提供解决方法，JavaScript 为函数添加了一个特殊的内部属性：\[\[HomeObject]]。当一个函数被定义为类或者对象方法时，它的 \[\[HomeObject]] 属性就成为了该对象。然后 super 使用它来解析（resolve）父原型及其方法。

正如我们之前所知道的，函数通常都是“自由”的，并没有绑定到 JavaScript 中的对象。正因如此，它们可以在对象之间复制，并用另外一个 this 调用它。\[\[HomeObject]] 的存在违反了这个原则，因为方法记住了它们的对象。\[\[HomeObject]] 不能被更改，所以这个绑定是永久的。在 JavaScript 语言中 \[\[HomeObject]] 仅被用于 super。所以，如果一个方法不使用 super，那么我们仍然可以视它为自由的并且可在对象之间复制。

```js
let animal = {
  sayHi() {
    alert(`I'm an animal`);
  }
};

// rabbit 继承自 animal
let rabbit = {
  __proto__: animal,
  sayHi() {
    super.sayHi();
  }
};

let plant = {
  sayHi() {
    alert("I'm a plant");
  }
};

// tree 继承自 plant
let tree = {
  __proto__: plant,
  sayHi: rabbit.sayHi // (*)
};

tree.sayHi();  // I'm an animal (?!?)
```

\[\[HomeObject]] 是为类和普通对象中的方法定义的。但是对于对象而言，方法必须确切指定为 method()，而不是 "method: function()".

#### 静态属性和静态方法

我们可以把一个方法赋值给类的函数本身，而不是赋给它的 "prototype"。这样的方法被称为 静态的（static）。

```js
// 静态方法用于实现属于该类但不属于该类任何特定对象的函数。
class User {
  static staticMethod() {
    alert(this === User);
  }
}

User.staticMethod(); // true

// 实际上跟直接将其作为属性赋值的作用相同：
class User { }

User.staticMethod = function() {
  alert(this === User);
};

User.staticMethod(); // true

// 静态属性
class Article {
  static publisher = "Levi Ding";
}

alert( Article.publisher ); // Levi Ding

Article.publisher = "Levi Ding";
```

静态属性和方法是可被继承的，实现方法是extends使子类的prototype的\[\[Prototype]]指向父类prototype的同时使子类的\[\[Prototype]]指向父类本身。

```js
class Animal {
  static planet = "Earth";

  constructor(name, speed) {
    this.speed = speed;
    this.name = name;
  }

  run(speed = 0) {
    this.speed += speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }

  static compare(animalA, animalB) {
    return animalA.speed - animalB.speed;
  }

}

// 继承于 Animal
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}

let rabbits = [
  new Rabbit("White Rabbit", 10),
  new Rabbit("Black Rabbit", 5)
];

rabbits.sort(Rabbit.compare);

rabbits[0].run(); // Black Rabbit runs with speed 5.

alert(Rabbit.planet); // Earth

// extends的效果
class Rabbit extends Object {}

alert( Rabbit.prototype.__proto__ === Object.prototype ); // (1) true
alert( Rabbit.__proto__ === Object ); // (2) true
```

- 受保护的属性通常以下划线 _ 作为前缀。这不是在语言级别强制实施的，但是程序员之间有一个众所周知的约定，即不应该从外部访问此类型的属性和方法。设置只读属性只需要设置 getter，而不设置 setter。
- 内建的类，例如 Array，Map 等也都是可以扩展的，内建的方法例如 filter，map 等 — 返回的正是子类的新对象。它们内部使用了对象的 constructor 属性来实现这一功能，但不同的地方在于，内建类没有静态方法的继承，例如，Array 和 Date 都继承自 Object，所以它们的实例都有来自 Object.prototype 的方法。但 Array.\[\[Prototype]] 并不指向 Object，所以它们没有例如 Array.keys()（或 Date.keys()）这些静态方法。
- instanceof 并不关心函数，而是关心函数的与原型链匹配的 prototype，根据 instanceof 的逻辑，真正决定类型的是 prototype，而不是构造函数。

### Promise，async/await

Error 优先回调（error-first callback）”风格：
- callback 的第一个参数是为 error 而保留的。一旦出现 error，callback(err) 就会被调用。
- 第二个参数（和下一个参数，如果需要的话）用于成功的结果。此时 callback(null, result1, result2…) 就会被调用。

```js
// resolve(value) — 如果任务成功完成并带有结果 value。
// reject(error) — 如果出现了 error，error 即为 error 对象。
let promise = new Promise(function(resolve, reject) {
  // executor（生产者代码）
});

//.then 的第一个参数是一个函数，该函数将在 promise resolved 后运行并接收结果。
//.then 的第二个参数也是一个函数，该函数将在 promise rejected 后运行并接收 error。
promise.then(
  function(result) { /* handle a successful result */ },
  function(error) { /* handle an error */ }
);

//如果我们只对 error 感兴趣，那么我们可以使用 null 作为第一个参数：.then(null, errorHandlingFunction)。或者我们也可以使用 .catch(errorHandlingFunction)
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});

// .catch(f) 与 promise.then(null, f) 一样
promise.catch(alert); // 1 秒后显示 "Error: Whoops!"

//finally 处理程序（handler）没有参数。在 finally 中，我们不知道 promise 是否成功。没关系，因为我们的任务通常是执行“常规”的定稿程序（finalizing procedures）。
//finally 处理程序将结果和 error 传递给下一个处理程序。
new Promise((resolve, reject) => {
  /* 做一些需要时间的事儿，然后调用 resolve/reject */
})
  // 在 promise 为 settled 时运行，无论成功与否
  .finally(() => stop loading indicator)
  // 所以，加载指示器（loading indicator）始终会在我们处理结果/错误之前停止
  .then(result => show result, err => show error)
```