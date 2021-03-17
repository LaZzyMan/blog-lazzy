---
title: javascript基础（未完成）
date: '2021-03-02 22:01:06'
tags: 
- javascript

draft: 1

category: Development
image:
---

## 语言组成

### 数据类型

基础类型:

- string, number, boolean
- null, undefined
- symbol(es6)

引用类型:

- object
  - Function
  - Array, RegExp, Date, Math等

### 操作符

一元操作符、位操作符、乘性操作符、加性操作符、关系操作符、相等操作符、条件操作符、赋值操作符、逗号操作符、分组操作符

### 语句

- 顺序语句：声明、赋值、运算、调用、解构等
- 控制流：if, break/continue, try/catch/finally, switch
- 迭代：do-while, while, for, for-in

### 函数

- 声明和表达式
- 调用、值传递
- 直接调用、方法调用、构造函数、apply/call/bind
- this, arguments, return

### 对象

- 属性、访问器getter/setter
- new， delete
- toString, valueOf

### 运算符特征

- 结合律和优先级

## 常用API

- Number
  - .toFixed()
  - isFinite(), isNaN(), parseInt(), parseFloat()
  - Number.EPSILON, Number.MAX_SAFE_INTEGER
- String
  - .length
  - .concat(), .slice(), .split()
  - .includes(), .indexOf(), .match(), .replace()
  - .padStart(), .padEnd(), .startsWith(), .endsWith(), .trim()
  - .charAt(), .charCodeAt()
  - String.fromCharCode(), String.raw()
- Array
  - .length
  - .push(), .pop(), .shift(), .unshift()
  - .reverse(), .sort(), .flat()
  - .map(), .filter(), .reducer(), .forEach(), .every(), .some()
  - .concat(), .join(), .slice(), .splice()
  - .includes(), .indexOf(), .find(), .findIndex()
  - Array.from(), Array.isArray()
- Object
  - Object.assign(), Object.create()
  - Object.getPrototypeOf()
  - Object.keys(), Object.values(), Object.entries(), Object.fromEntries()
  - Object.freeze(), Object.seal()
  - .toString(), .valueOf()
- Function
  - .length, .name
  - .call(), .apply(), .bind()
- Math
  - Math.E, Math.PI, Math.SQRT1_2, Math.SQRT2
  - Math.abs(), Math.sign(), Math.ceil(), Math.floor(), Math.round(), Math.random()
  - Math.max(), Math.min(), Math.pow(), Math.log(), Math.log10(), Math.log2()
  - Math.sin(), Math.cos(), Math.tan(), Math.asin(), Math.acos(), Math.atan()
- Date
  - Date.now(), Date.parse()
  - .getTime(), .getMonth(), .getDate(), getDay()
  - .getFullYear(), .getHours(), .getMinutes(), .getSeconds(), .getMilliseconds()
- RegExp
  - .exec(), .test()
- JSON
  - JSON.parse, JSON.stringify()
- Promise
  - Promise.all(), Promise.race(), Promise.resolve(), Promise.reject()
  - .then(), .catch(), .finally()
- console
  - console.log(), console.warn(), console.info(), console.error(), console.clear()
  - console.table(), console.dir(), console.trace()
  - console.count(), console.assert()
  - console.time(), console.timeEnd(), console.group(), console.groupEnd()
- window/global
  - setTimeout(), clearTimeout()
  - setInterval(), clearInterval()

### null与undefined

null表示"没有对象"，即该处不应该有值：
- 作为函数的参数，表示该函数的参数不是对象
- 作为对象原型链的终点

undefined表示"缺少值"，就是此处应该有一个值，但是还没有定义：
- 变量被声明了，但没有赋值时，就等于undefined
- 调用函数时，应该提供的参数没有提供，该参数等于undefined
- 对象没有赋值的属性，该属性的值为undefined
- 函数没有返回值时，默认返回undefined

原始数据类型：Undefined/Null/Boolean/Number/String
复杂数据类型：Object/Array/Function/RegExp/Date/Error

"+"表示字符串拼接/加减法中加法，如果运算对象存在字符则解释为拼接字符串
"-"只表示减法

2.toString()将会优先将小数点解析为数字小数点
2..toString()因为连续的两个小数点不符合number的格式规则，第二个小数点才会被解析为调用方法