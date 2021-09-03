---
title: WebSocket备忘
date: '2021-07-16 10:53:00'
tags: 
- Summary

category: Development
image: 
---

### WebSocket协议

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议，在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。WebSocket需要浏览器通过发起一个标准HTTP请求来建立连接：

```js
// 浏览器请求
GET ws://example.com/ws HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Host: example.com
Origin: http://example.com
Sec-WebSocket-Key: sN9cRrP/n9NdMgdcy2VJFQ==
Sec-WebSocket-Version: 13

// 服务器返回
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=
Sec-WebSocket-Location: ws://example.com/
```

- GET请求的地址不是类似/path/，而是以ws://开头的地址；
- 请求头Upgrade: websocket和Connection: Upgrade表示这个连接将要被转换为WebSocket连接；
- Sec-WebSocket-Key 是随机的字符串，服务器端会用这些数据来构造出一个 SHA-1 的信息摘要。把 “Sec-WebSocket-Key” 加上一个特殊字符串 “258EAFA5-E914-47DA-95CA-C5AB0DC85B11”，然后计算 SHA-1 摘要，之后进行 BASE-64 编码，将结果做为 “Sec-WebSocket-Accept” 头的值，返回给客户端。如此操作，可以尽量避免普通 HTTP 请求被误认为 Websocket 协议。
- Sec-WebSocket-Version 表示支持的 Websocket 版本。RFC6455 要求使用的版本是 13，之前草案的版本均应当弃用。
- Origin 字段是可选的，通常用来表示在浏览器中发起此 Websocket 连接所在的页面，类似于 Referer。但是，与 Referer 不同的是，Origin 只包含了协议和主机名称。
- 服务器响应代码101表示本次连接的HTTP协议即将被更改，更改后的协议就是Upgrade: websocket指定的WebSocket协议。

安全的WebSocket连接机制和HTTPS类似。首先，浏览器用wss://xxx创建WebSocket连接时，会先通过HTTPS创建安全的连接，然后，该HTTPS连接升级为WebSocket连接，底层通信走的仍然是安全的SSL/TLS协议。

### 基本使用

#### Constructor
```js
WebSocket(url[, protocols])
```

#### Properties

```js
WebSocket.binaryType // 传输数据的二进制类型
WebSocket.bufferedAmount // 只读，待传输数据的二进制长度，0表示当前传输已完成
WebSocket.onclose
WebSocket.onerror
WebSocket.onmessage
WebSocket.onopen
WebSocket.protocol 
WebSocket.readyState // 只读，返回当前连接状态（0:CONNECTING；1:OPEN；2:CLOSING；3:CLOSED）
WebSocket.url
```

#### Methods

```js
// 关闭连接
WebSocket.close([code[, reason]])
// 发送数据
WebSocket.send(data)
```

### 封装WebSocket API

```ts
interface Config {
  timeout?: number;
  heartbeatInterval?: number;
  onOpenCallBack?: AnyFunction;
}

interface Request {
  action: string;
  data: any;
}

interface Response {
  requestId: string;
  success: Boolean;
  errorCode: number;
  errorMsg?: string;
  data: any;
}

const DEFAULT_CONFIG: Config = {
  timeout: 10000, //ms
  heartbeatInterval: 15000, //ms
};

const HEART_BEAT = 'heartbeat';

export class WS {
  url: string;

  config: Config = DEFAULT_CONFIG;

  ws!: WebSocket;

  // 存储request callback
  private requestStack!: { [key: string]: Function };

  private heartBeatTimeout?: NodeJS.Timeout;

  private getMessageData: AnyFunction;

  constructor(url: string, config?: Config) {
    this.url = url;
    this.config = { ...DEFAULT_CONFIG, ...(config || {}) };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.getMessageData = () => {};
    this.create();
  }

  create() {
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = this.onmessage;
    this.ws.onerror = this.onerror;
    this.ws.onopen = this.onopen;
    this.requestStack = {};
  }

  onEvent = (type: string, fun: AnyFunction) => {
    if (type === 'getMessage') {
      this.getMessageData = fun;
    }
  };

  reCreate() {
    if (this.ws) {
      this.ws.close();
    }
    this.create();
  }

  connect(url: string) {
    this.url = url;
    this.reCreate();
  }

  send(data: any) {
    if (this.ws.readyState === 1) this.ws.send(JSON.stringify(data));
  }

  onmessage = (event: MessageEvent) => {
    let { data } = event;
    try {
      data = JSON.parse(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('The data ws returned is not a valid json!', err);
    }
    if (!data) {
      return;
    }
    if (data.requestId === HEART_BEAT) {
      this.sendHeartBeat();
      return;
    }
    if (data.requestId && data.requestId in this.requestStack) {
      // 接收到数据后查询requestId对应的回调执行
      this.requestStack[data.requestId](data);
      delete this.requestStack[data.requestId];
    } else {
      this.getMessageData(data);
    }
  };

  retryTimes = 0;

  onerror = (err: any) => {
    console.error('wsError', err);
    if (this.retryTimes < 30) {
      // 返回错误则重新创建连接并重试请求
      setTimeout(() => {
        this.reCreate();
      }, Math.pow(4, this.retryTimes) * 400);
      this.retryTimes += 1;
    }
  };

  onopen = () => {
    // 连接建立完成后开始进行心跳监听
    this.sendHeartBeat();
    this.config.onOpenCallBack?.();
  };

  sendHeartBeat() {
    if (this.heartBeatTimeout) {
      clearTimeout(this.heartBeatTimeout);
      this.heartBeatTimeout = undefined;
    }
    setTimeout(() => {
      this.send({ action: HEART_BEAT, requestId: HEART_BEAT });
      this.heartBeatTimeout = setTimeout(
        // 心跳返回超时则重新建立连接
        this.reCreate.bind(this),
        this.config.heartbeatInterval,
      );
    }, this.config.heartbeatInterval);
  }

  request({ action, data }: Request, callback: Function) {
    const requestId = uuidv4();
    this.send({ requestId, action, data });
    // 将请求的回调函数存入实例对象，并在请求超时时删除对应的回调
    if (this.config.timeout && this.config.timeout > 0) {
      setTimeout(() => {
        delete this.requestStack[requestId];
      }, this.config.timeout);
    }
    this.requestStack[requestId] = callback;
  }
}
```