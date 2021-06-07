---
title: WebWorker备忘
date: '2021-06-01 15:22:00'
tags: 
- Summary

category: Development
image: 
---

## 主线程

新建Worker线程，jsUrl是脚本地址（必须遵守同源原则），第二个参数是worker对象的配置选项，可以指定对象的名称等信息。

```js
const worker = new Worker(jsUrl, options);
```

主线程向worker线程发送消息

```js
worker.postMessage()
```

主线程指定worker线程的监听函数，消息中的数据通过event.data获取

```js
worker.onmessage = (event) => {
  console.log(event.data)
}
```

主线程中也可以监听worker是否发生错误：

```js
worker.onerror(function (event) {
  console.log([
    'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
  ].join(''));
});

// 或者
worker.addEventListener('error', function (event) {
  // ...
});
```

关闭worker线程

```js
worker.terminate();
```

## Worker线程

worker线程内部无法调用主线程的全局对象，如windows、document、parent等，子线程的全局对象self代表子线程自身。worker线程内部设置message监听函数：

```js
// self既为全局对象，又代表worker自身，因此可以用this替代，或者直接调用self的方法
self.addEventListener('message', function(e) {
  self.postMessage(e.data);
}, false)

this.addEventListener('message', function (e) {
  this.postMessage(e.data);
}, false);

addEventListener('message', function (e) {
  postMessage(e.data);
}, false);
```

worker内部也可以直接食用self.onmessage指定监听函数。在worker内部也可以加载其他脚本：

```js
self.importScripts('script.js')
```

在worker内部关闭自身：

```js
self.close();
```

## 注意事项

主线程与Worker线程之间的通信是通过拷贝实现的，worker线程对于通信内容的修改不会影像主线程，事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原。如果想要避免拷贝，可以使用数据转移的方法，使得主线程快速把数据控制权交给worder线程，但是主线程不能再访问数据：

```js
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer]);

// 例子
var ab = new ArrayBuffer(1);
worker.postMessage(ab, [ab]);
```

在需要动态生成worker线程执行代码时，可以将代码先转成二进制对象，之后为二进制对象生成URL，在时worker通过URL加载代码。

```js
// 服务器轮询实例
function createWorker(f) {
  var blob = new Blob(['(' + f.toString() +')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}

var pollingWorker = createWorker(function (e) {
  var cache;

  function compare(new, old) { ... };

  setInterval(function () {
    fetch('/my-api-endpoint').then(function (res) {
      var data = res.json();

      if (!compare(data, cache)) {
        cache = data;
        self.postMessage(data);
      }
    })
  }, 1000)
});

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```

## MessageChannel

