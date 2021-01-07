---
title: javascript闭包
date: '2018-08-02 22:01:06'
tags: 
- javascript
- 前端开发

category: Development
---

# JavaScript闭包

## JS Type

- 值类型：undefined，number，string，boolean
- 引用类型（对象）：函数、数组、null、对象

### 函数原型

js中对象都以属性的集合形式表示，而函数是一键值对形式表示的一种特殊的属性集合，并且对象都是通过函数来创建的。

```javascript
var obj = { a: 10, b: 20 }
// 等价于
var obj = new Object()
obj.a = 10
obj.b = 20

function f(x, y) {
    return x+y
}
// 等价于
var f = new Function('x', 'y', 'return x+y')
```

函数具有一个自带属性prototype，该属性为函数的原型:

![prototype](javascript闭包/001.png)

使用prototype属性可以为函数原型添加属性，即为函数创建的对象添加属性。

```javascript
const F = () => {}
F.prototype.name = 'function'
const f = new F()
console.log(f.name)
// function
```

相应的，每一个对象都有一个__proto__属性指向该对象函数的prototype。

### instanceof

typeof可以清楚地判断值类型，而不能清楚地区分引用类型；instanceof用于具体的判断应用类型的原型。instanceof的判断原则是沿着被判断对象的__proto__属性寻找，并沿着判别的函数的prototype属性寻找，如果最终能指向同一引用对象则返回true。

js中对象的属性调用均沿着__proto__原型链进行寻找，即继承。因此所有对象都能继承object.prototype所声明的方法：

- hasOwnProperty
- isPrototypeOf
- propertyIsEnumerable
- toLocaleString
- toString
- valueOf

js的原型具有最大的灵活性，可以随时为原型添加新的属性。

```javascript
// 为String添加toJOSN方法
String.prototype.toJOSN = () => {}
```

## 执行上下文

每一个js代码段在执行之前，会进行一些数据准备工作（将所有变量取出，有些进行赋值，有些使用undefined赋值），这些准备工作包括：

- 变量、函数表达式：声明变量，默认为undefined
- this：赋值
- 函数声明：赋值
- arguments：赋值
- 自由变量取值作用域：赋值
  
## this

### 构造函数

构造函数是指为了创建一个对象而存在的函数，通常首字母要求大写，在构造函数被作为构造函数调用时，函数内部的this代表构造函数即将构造出来的对象。

```javascript
function Foo() {
    this.name = 'function'
    console.log(this)
}

var f = new Foo()
console.log(f.name)
// function
Foo()
// Window{}
```

### 函数作为对象的属性

如果函数作为一个对象的属性并且作为对象属性被调用时，函数内部的this指向该对象；如果不作为对象的属性调用，则this依旧指向window。

```javascript
var obj = {
    x:10,
    f:()=>{
        console.log(this.x)
    }
}
obj.f() // 10
var f1=obj.f
f1() // undefined
```

### 使用call/apply调用函数

JS中的每个函数都包含两个非继承方法：call和apply。两个函数有着相同的作用，即在特定的作用域中调用函数,等价于设定函数中this的指向。在使用call/apply时，函数中的this指向被传入的对象。

#### apply

语法：apply([thisObj [,argArray] ]);，调用一个对象的一个方法，用另一个对象替换当前对象。

说明：如果argArray不是一个有效数组或不是arguments对象，那么将导致一个 TypeError，如果没有提供argArray和thisObj任何一个参数，那么Global对象将用作thisObj。

#### call

语法：call([thisObject[,arg1 [,arg2 [,...,argn]]]]);，应用某一对象的一个方法，用另一个对象替换当前对象。

说明： call方法可以用来代替另一个对象调用一个方法，call方法可以将一个函数的对象上下文从初始的上下文改变为thisObj指定的新对象，如果没有提供thisObj参数，那么Global对象被用于thisObj。

### 全局/调用普通函数

在全局环境或普通函数中，this指向window，注意普通函数无论在何处定义（如属性函数内部），函数内部的this始终指向window。

### 原型

在整个原型链中（__proto__，prototype），this指向的始终是当前对象。

## 闭包

作用域：js中没有块级作用域，除了全局作用域之外只有函数可以创建作用域。

作用域用于分割变量的作用范围，不同作用域中出现同名变量不会造成冲突。当作用域中出现了没有声明的变量时，则到创建该函数的作用域中寻找，直到回到全局作用域，这一路线称为作用域链。

闭包：

- 函数作为函数的返回值
- 函数作为一个参数被传递

闭包函数调用完成后，其执行上下文环境不会被销毁，因此闭包会增加程序的开销。