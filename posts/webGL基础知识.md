---
title: WebGL基础知识
date: '2021-03-29 09:22:00'
tags: 
- Summary

category: Development
image: 
---

## 基础概念

WebGL通过GPU运行代码渲染图形，在GPU上运行的代码需要一个顶点着色器（vertex shader）和一个片段着色器（fragment shader），二者组合起来作为一个着色程序（program）。顶点着色器的作用是计算顶点的位置。根据计算出的一系列顶点位置，WebGL可以对点， 线和三角形在内的一些图元进行光栅化处理。当对这些图元进行光栅化处理时需要使用片断着色器方法。 片断着色器的作用是计算出当前绘制图元中每个像素的颜色值。WebGL API的核心在于设置着色程序的状态值以及运行它们。

着色程序所需要的任何数据都需要发送到GPU，着色器获取数据的方法包括：
- Attributes & buffer: 属性用来指明怎么从缓冲中获取所需数据并将它提供给顶点着色器。 例如你可能在缓冲中用三个32位的浮点型数据存储一个位置值。 对于一个确切的属性你需要告诉它从哪个缓冲中获取数据，获取什么类型的数据（三个32位的浮点数据）， 起始偏移值是多少，到下一个位置的字节数是多少。缓冲不是随意读取的。事实上顶点着色器运行的次数是一个指定的确切数字， 每一次运行属性会从指定的缓冲中按照指定规则依次获取下一个值。
- Uniforms: 全局变量在着色程序运行前赋值，在运行过程中全局有效。
- Textures: 纹理是一个数据序列，可以在着色程序运行中随意读取其中的数据。 大多数情况存放的是图像数据，但是纹理仅仅是数据序列， 你也可以随意存放除了颜色数据以外的其它数据。
- Varyings: 可变量是一种顶点着色器给片断着色器传值的方式，依照渲染的图元是点， 线还是三角形，顶点着色器中设置的可变量会在片断着色器运行中获取不同的插值。

### 数据读取

```js
<canvas id="c"></canvas>

<script id="vertex-shader-2d" type="notjs">
 
  // 一个属性变量，将会从缓冲中获取数据
  attribute vec4 a_position;
 
  // 所有着色器都有一个main方法
  void main() {
 
    // gl_Position 是一个顶点着色器主要设置的变量
    gl_Position = a_position;
  }
 
</script>
 
<script id="fragment-shader-2d" type="notjs">
 
  // 片断着色器没有默认精度，所以我们需要设置一个精度
  // mediump是一个不错的默认值，代表“medium precision”（中等精度）
  precision mediump float;
 
  void main() {
    // gl_FragColor是一个片断着色器主要设置的变量
    gl_FragColor = vec4(1, 0, 0.5, 1); // 返回“瑞迪施紫色”
  }
 
</script>

var canvas = document.querySelector("#c");
var gl = canvas.getContext("webgl");

// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
function createShader(gl, type, source) {
  var shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // 编译 -> 生成着色器
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
 
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// 将着色器连接到着色程序
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

var program = createProgram(gl, vertexShader, fragmentShader);

// 创建缓冲并将缓冲绑定到gl中的绑定点（相当于全局变量）
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
];
// 将数据复制到GPU的positionBuffer，并通过与其绑定的gl.ARRAY_BUFFER传递到着色程序
// 最后一个参数gl.STATIC_DRAW是提示WebGL我们将怎么使用这些数据。WebGL会根据提示做出一些优化。 
// gl.STATIC_DRAW提示WebGL我们不会经常改变这些数据。
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

```

### 渲染

```js
// 将裁剪空间映射到屏幕空间
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// 清空画布
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// 告诉它用我们之前写好的着色程序（一个着色器对）
gl.useProgram(program);

// 从着色程序中找到属性位置
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
// 启用属性
gl.enableVertexAttribArray(positionAttributeLocation);

// 将绑定点绑定到缓冲数据（positionBuffer）
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
var size = 2;          // 每次迭代运行提取两个单位数据
var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
var normalize = false; // 不需要归一化数据
var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                       // 每次迭代运行运动多少内存到下一个数据开始点
var offset = 0;        // 从缓冲起始位置开始读取
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

// 运行着色程序
// 设置primitiveType（图元类型）为 gl.TRIANGLES（三角形）， 顶点着色器每运行三次WebGL将会根据三个gl_Position值绘制一个三角形
// 绘制每个像素时WebGL都将调用我们的片断着色器
var primitiveType = gl.TRIANGLES;
var offset = 0;
// 顶点着色器运行三次
var count = 3;
gl.drawArrays(primitiveType, offset, count);
```

一个隐藏信息是gl.vertexAttribPointer是将属性绑定到当前的ARRAY_BUFFER。 换句话说就是属性绑定到了positionBuffer上。这也意味着现在利用绑定点随意将 ARRAY_BUFFER绑定到其它数据上后，该属性依然从positionBuffer上读取数据。

vec4是一个有四个浮点数据的数据类型。在JavaScript中你可以把它想象成 a_position = {x: 0, y: 0, z: 0, w: 0}。之前我们设置的size = 2， 属性默认值是0, 0, 0, 1，然后属性将会从缓冲中获取前两个值（ x 和 y ）。 z和w还是默认值 0 和 1 。

## 工作原理

顶点着色器（Vertex Shader）的作用是，每个顶点调用一次，在这个方法中做一些数学运算后设置了一个特殊的gl_Position变量， 这个变量就是该顶点转换到裁剪空间中的坐标值，GPU接收该值并将其保存起来。

假设你正在画三角形，顶点着色器每完成三次顶点处理，WebGL就会用这三个顶点画一个三角形。 它计算出这三个顶点对应的像素后，就会光栅化这个三角形，“光栅化”其实就是“用像素画出来” 的花哨叫法。对于每一个像素，它会调用你的片断着色器询问你使用什么颜色。 你通过给片断着色器的一个特殊变量gl_FragColor设置一个颜色值，实现自定义像素颜色。

使用它们可以做出非常有趣的东西，但如你所见，到目前为止的例子中， 处理每个像素时片断着色器可用信息很少，幸运的是我们可以给它传递更多信息。 想要从顶点着色器传值到片断着色器，我们可以定义“可变量（varyings）”。


## Texture

加载纹理通常需要创建一个纹理对象和一个图片对象，在图片加载完成的回调函数中对纹理进行纹理的加载；首先将纹理对象绑定到gl.TEXTURE_2D使其成为当前操作纹理，之后通过texImage2D()将图片数据写入纹理：

```c
void gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
void gl.texImage2D(target, level, internalformat, format, type, ImageData? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLCanvasElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLVideoElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, ImageBitmap? pixels);
```

之后需要通过gl.texParameteri/f来三个照顾纹理参数，包括纹理的缩放滤波器和水平/垂直方向填充方式等：

```c
void gl.texParameterf(GLenum target, GLenum pname, GLfloat param);
void gl.texParameteri(GLenum target, GLenum pname, GLint param);
```

如果对纹理缩小使用多级滤波器，则需要通过gl.generateMiMap()来生成多级纹理，最后将null绑定daogl.TEXTURE_2D告知当前纹理操作完毕。

```js
function initTextures() {
  cubeTexture = gl.createTexture();
  cubeImage = new Image();
  cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
  cubeImage.src = "cubetexture.png";
}

function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}
```
## Blend

Blend（混合）是一种将颜色混合显示输出的技术，通常情况下某个像素一旦确定要显示，渲染管线会将该像素所对应的颜色值直接写入缓冲区覆盖原来这个位置的像素颜色。而 Blend 可以通过某种算法将即将写入缓冲区的像素与已在缓冲区的像素颜色做混合处理。

```js
// 开启/关闭blend
gl.enable(gl.BLEND);
gl.disable(gl.BLEND);
```

source color为即将被吸入缓冲区的颜色，destination color为缓冲区已经存在的颜色，blend通过blendFunc和blendFuncSpeparate方法来对二者进行混合得到最红写入缓冲区的颜色。
```c
// color(RGBA) = (sourceColor * sfactor) + (destinationColor * dfactor). RBGA
void gl.blendFunc(sfactor, dfactor);
// color(RGB) = (sourceColor * srcRGB) + (destinationColor * dstRGB)
// color(A) = (sourceAlpha * srcAlpha) + (destinationAlpha * dstAlpha)
void gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
```

gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)对应的的计算公式为：

$${ color }_{ final }={ color }_{ source }\times { \alpha }_{ source }+{ color }_{ dest }\times (1-{ \alpha }_{ source })$$

此时显示的颜色将为来源色与自身alpha相乘+目标色与1-alpha相乘，alpha=0/1分别对应全透明和不透明效果。但是在这种混合中，alpha通道的值也会发生变化，在webgl context设置了alpha=true的情况下，显示颜色还会与canvas所覆盖的页面进一步叠加混合。为了避免这种情况，可以将alpha设置为false或者使用blendFuncSeparate方法。相比于blendFunc，它可以单独计算混合后颜色alpha通道值，例如通过gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE)保持alpha值不变。

颜色混合的方式可以通过blendEquation来设置：

```c
// gl.FUNC_ADD：相加处理
// gl.FUNC_SUBTRACT：相减处理
// gl.FUNC_REVERSE_SUBSTRACT：反向相减处理，即 dest 减去 source
void blendEquation(GLenum mode);
void blendEquationSeparate(GLenum modeRGB, GLenum modeAlpha);
```

webgl中alpha通道有两种渲染方式：
- Premultiplied Alpha，也叫做 Associated Alpha。表示 RGB 在存储的时候事先将透明信息与 RGB 相乘，比如纯红色的 RGB 是 (1, 0, 0)，再加上 50% 透明度，那么存储的时候变为：(0.5, 0, 0, 0.5)
- Non-premultiplied Alpha，也叫做 Unassociated Alpha。表示 RGB 不会事先与透明度相乘，上面的例子就变为：(1, 0, 0, 0.5)

在使用PNG图片时，虽然PNG图片本身的信息通常是Non-premultiplied Alpha，图片数据自身Alpha和RGB分开保存的，但是在 WebGL 创建纹理时我们仍然可以指定使用哪种方式，只不过要调整不同的混合方式。在使用Premultiplied Alpha方式时需要注意source color已经被alpha通道提前混合。

## GLSL 内建函数

[GLSL Functions](https://www.shaderific.com/glsl-functions)

```c
// 点乘
dot(x, y)
// 规整输入值
clamp(x, min, max)
// 线性插值
mix(x, y, level)
// 角度转弧度
radians(degree)
degree(radians)
```
