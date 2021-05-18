---
title: JS ArrayBuffer
date: '2021-05-18 16:42:16'
tags: 
- js

category: Development
image:
---

## ArrayBuffer

ArrayBuffer对象用于表示固定长度的二进制存储缓冲区，ArrayBuffer对象不能被直接操作，只能通过TypedArray或DataView对象来指定从缓冲区中读取数据的格式，并再次基础上对缓冲区数据进行读写操作。

```js
const buffer = new ArrayBuffer(length);

// 1
ArrayBuffer.length

// read only
ArrayBuffer.prototype.byteLength

// 如果参数是 ArrayBuffer 的视图实例则返回 true，否则返回 false
ArrayBuffer.isView(arg)

// 返回一个新的 ArrayBuffer ，它的内容是这个 ArrayBuffer 的字节副本，从begin（包括），到end（不包括）。
// 如果begin或end是负数，则指的是从数组末尾开始的索引，而不是从头开始。
ArrayBuffer.prototype.slice()
```

## Typed Array

Javascript提供了Array类型存储数组对象，其能够实现数组的动态增减，内存的自动分配和类型的自动推断等，js引擎通过内部优化使得这些操作可以快速完成，但是当对性能具有较高要求时，自动分配内存和类型推断带来的损耗是不能忽略的，因此js也提供了访问原始二进制数据的方式。这种访问方式又缓存和视图两部分构成，缓存🈶️ArrayBuffer实现，其只负责申请一个固定长度的数据块，也不提供访问机制；视图由Typed Array实现，通过指定数据类型，偏移量，读取个数从缓存中读取出数组。

![](.//public/../../public/arraybuffer/01.png)

Typed Array View包括：IntInt8Array，Uint8Array，Uint8ClampedArray（所有数据会被自动转换到0-255之间），Int16Array，Uint16Array，Int32Array，Uint32Array，Float32Array，Float64Array，BigInt64Array和BigUint64Array，以Int8Array为例：

```js
// 空数组
new Int8Array();
new Int8Array(length); 
// 返回typeArray的拷贝
new Int8Array(typedArray); 
// 从类数组对象或可迭代对象生成
new Int8Array(object); 
// 从ArrayBuffer生成
new Int8Array(buffer [, byteOffset [, length]]); 

Int8Array.prototype.buffer
Int8Array.prototype.byteLength
Int8Array.prototype.byteOffset
Int8Array.prototype.length

// 把指定数组的（所有）元素添加到当前数组的指定位置
Int8Array.prototype.set(array[, offset])
```

同一个ArrayBuffer上可以创建多个视图，这些视图共享数据，但是由于不同的数据格式和读取位置，可能得到不同的结果。同时，ArrayBuffer也可以用于数据文件或实现C语言结构体：

```c
struct someStruct {
  unsigned long id;
  char username[16];
  float amountDue;
};
```

```js
var buffer = new ArrayBuffer(24);

// ... read the data into the buffer ...

var idView = new Uint32Array(buffer, 0, 1);
var usernameView = new Uint8Array(buffer, 4, 16);
var amountDueView = new Float32Array(buffer, 20, 1);
```

## DataView

DataView是一个更为通用的从ArrayBuffer缓冲区中读取数据的视图接口，其读取数据的方式与Typed Array相同，并提供一系列方法用于对缓冲区数据进行操作。

数据读取以 getInt8() 方法为例，可提供一个参数 byteOffset，表示偏移指定字节数，然后读取 1 字节（8 位）数据，默认 为 0（第一字节）；而如果是 getInt16() 等用于获取大于 1 字节值以及浮点值的方法，还接受第二个可选参数 littleEndian，就是是否使用 little endian（低字节序，上文有讲）格式来读取数据，传入 true 就表示使用 little endian 格式，传入 false 或者不填，就使用 big endian（高字节序） 格式；

数据写入以 setInt8() 为例，接受两个参数：setInt8(byteOffset, value)，第一个表示偏移字节量，用于定位，第二个则是要设置的具体值，非数字类型会报错；类似地，setInt16 等用于设置超过 1 字节的方法，也提供第三个可选参数 littleEndian，表示是否以 little endian 格式设置；

```js
new DataView(buffer [, byteOffset [, byteLength]]);

var buffer = new Int8Array([1, 2, 3, 4]).buffer;
var dv = new DataView(buffer);

console.log(dv.getInt8(1)); // 2
console.log(dv.getInt16(0, true)); // 513
console.log(dv.getInt16(0, false)); // 258
console.log(dv.getInt16(0)); // 258

var buffer1 = new ArrayBuffer(2);
var buffer2 = new ArrayBuffer(4);
var dv1 = new DataView(buffer1);
var dv2 = new DataView(buffer2);

dv1.setInt8(0, 1);
dv1.setInt8(1, 2);
var i8 = new Int8Array(dv1.buffer);
console.log(i8); // Int8Array(2) [1, 2]

dv2.setUint16(0, 513, true);
dv2.setUint16(2, 513);
var i16 = new Uint16Array(dv2.buffer);
console.log(i16); // Int16Array(2) [513, 258]
```

[JavaScript与二进制数据](https://knightyun.github.io/2020/03/09/js-binary-data)
