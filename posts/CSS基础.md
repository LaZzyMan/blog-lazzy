---
title: CSS基础
date: '2021-03-20 22:44:16'
tags: 
- css

category: Development
image:
---
[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS)

## 媒体查询

### 语法

每条媒体查询语句都由一个可选的媒体类型和任意数量的媒体特性表达式构成。可以使用多种逻辑操作符合并多条媒体查询语句。媒体查询语句不区分大小写。
当媒体类型（如果指定）与在其上显示文档的设备匹配并且所有媒体功能表达式都计算为true时，媒体查询将计算为true。 涉及未知媒体类型的查询始终为false。

媒体类型：all(隐式应用), print, screen, speech.

```css
@media print { ... }
@media screen, print { ... }
```

媒体特征（Media features）描述了 user agent、输出设备，或是浏览环境的具体特征。媒体特性表达式是完全可选的，它负责测试这些特性或特征是否存在、值为多少。每条媒体特性表达式都必须用括号括起来。

```css
//仅当您的浏览器的viewport宽度等于或小于12450px时，此CSS才会应用样式
@media (max-width: 12450px) { ... }
//如果您在未指定值的情况下创建媒体功能查询，则该样式将全部被应用，只要该查询的值不为零（或在Level 4中为none）即可。 例如，此CSS将适用于任何带有彩色屏幕的设备
@media (color) { ... }
//如果某个功能不适用于运行浏览器的设备，则涉及该媒体功能的表达式始终为false。 例如，将不会使用嵌套在以下查询中的样式，因为没有语音专用设备具有屏幕长宽比
@media speech and (aspect-ratio: 11/5) { ... }
```

逻辑操作符（logical operators） not, and, 和 only 可用于联合构造复杂的媒体查询，您还可以通过用逗号分隔多个媒体查询，将它们组合为一个规则。

- and 操作符用于将多个媒体查询规则组合成单条媒体查询，当每个查询规则都为真时则该条媒体查询为真，它还用于将媒体功能与媒体类型结合在一起。
- not运算符用于否定媒体查询，如果不满足这个条件则返回true，否则返回false。 如果出现在以逗号分隔的查询列表中，它将仅否定应用了该查询的特定查询。 如果使用not运算符，则还必须指定媒体类型。
- only运算符仅在整个查询匹配时才用于应用样式，并且对于防止较早的浏览器应用所选样式很有用。 当不使用only时，旧版本的浏览器会将screen and (max-width: 500px)简单地解释为screen，忽略查询的其余部分，并将其样式应用于所有屏幕。 如果使用only运算符，则还必须指定媒体类型。
- 逗号用于将多个媒体查询合并为一个规则。 逗号分隔列表中的每个查询都与其他查询分开处理。 因此，如果列表中的任何查询为true，则整个media语句均返回true。 换句话说，列表的行为类似于逻辑或or运算符。
- 在大多数情况下，默认情况下，如果未指定其他类型，则使用all媒体类型。 但是，如果使用not或only运算符，则必须显式指定媒体类型。

```css
// 宽度大于30em的横向屏幕
@media screen and (min-width: 30em) and (orientation: landscape) { ... }
// 高度大于680px或者是纵向屏幕
@media (min-height: 680px), screen and (orientation: portrait) { ... }

@media not all and (monochrome) { ... }
// 等价于
@media not (all and (monochrome)) { ... }

@media not screen and (color), print and (color) { ... }
// 等价于
@media (not (screen and (color))), print and (color) { ... }

// only关键字可防止不支持带有媒体功能的媒体查询的旧版浏览器应用给定的样式。 它对现代浏览器没有影响。
@media only screen and (color) { ... }
```

## 浏览器渲染原理

### 总体流程

- 浏览器解析
  - 解析HTML/SVG/XHTML产生一个DOM Tree。
  - 解析CSS会产生CSS规则树。
  - 解析Javascript脚本，主要是通过DOM API和CSSOM API来操作DOM Tree和CSS Rule Tree。
- 通过DOM Tree和CSS Rule Tree来构造Rendering Tree
  - Rendering Tree 渲染树并不等同于DOM树，因为一些像Header或display:none的东西就没必要放在渲染树中了。
  - CSS 的 Rule Tree主要是为了完成匹配并把CSS Rule附加上Rendering Tree上的每个Element。也就是DOM结点。也就是所谓的Frame。
  - 然后，计算每个Frame（也就是每个Element）的位置，这又叫layout和reflow过程。
- 调用操作系统native GUI的API绘制

### 构建DOM

字节->字符串->Token->Node->DOM

- 从字符串中识别Token会将其分为开始标签、结束标签和标签内容等信息
- DOM对象是由通过NToken生成的Node树构建而成的，结束标签Token不会创建节点对象

### 构建CSSOM

字节->字符串->Token->Node->CSSOM

### 构建渲染树

得到DOM树和CSSOM树之后将二者合并为渲染树，渲染数只会包含需要显示的节点和节点的样式信息，例如head部分或者display属性为none的节点不会被添加进渲染树中。

在这一过程中，浏览器会确定下每一个节点的样式到底是什么，因为CSSDOM与DOM树没有直接的关联，因此只有CSSDOM树完全构建结束之后才能用于确定DOM的样式。而因为样式你可以自行设置给某个节点，也可以通过继承获得，在这一过程中，浏览器得递归CSSOM树，然后确定具体的元素到底是什么样式，这一过程在CSSDOM过深的时候十分耗时，因此在css的声明中尽量使用id/class而避免过深的层叠嵌套。

### 布局与绘制

当浏览器生成渲染树以后，就会根据渲染树来进行布局（也可以叫做回流）。这一阶段浏览器要做的事情是要弄清楚各个节点在页面中的确切位置和大小。通常这一行为也被称为“自动重排”。布局流程的输出是一个“盒模型”，它会精确地捕获每个元素在视口内的确切位置和尺寸，所有相对测量值都将转换为屏幕上的绝对像素。布局完成后，浏览器会立即发出“Paint Setup”和“Paint”事件，将渲染树转换成屏幕上的像素。

### JS文件的处理

js的加载和解析会阻塞DOM的构建，当解析过程中遇到js文件，将暂停对DOM的解析而将控制权交给js引擎，在js运行完毕后再从中断的地方恢复DOM的构建。另外，js的引入会导致CSSDOM也会阻塞DOM的构建，由于js脚本可以更改DOM的同时也可以更改样式，而不完整的CSSOM是无法使用的，因此当js想要修改CSSOM时，将暂停js脚本执行和DOM构建，先行完成CSSOM的构建，之后执行js脚本，最后再继续DOM的构建。

### 回流和重绘

- 重绘:当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观、风格，而不会影响布局的，比如background-color，这时浏览器将重新调动Pianting方法通过Layout重新进行渲染。
- 回流:当render tree中的一部分(或全部)因为元素的规模尺寸、布局、隐藏等改变而需要重新构建，浏览器需要重新从Render Tree中生成Layout。因此回流必定会引发重绘，而重绘不一定会导致回流。回流所需的成本比重绘高的多，改变父节点里的子节点很可能会导致父节点的一系列回流。

引起回流的属性和方法：任何会改变元素几何信息(元素的位置和尺寸大小)的操作，都会触发回流。
- 添加或者删除可见的DOM元素；
- 元素尺寸改变——边距、填充、边框、宽度和高度
- 内容变化，比如用户在input框中输入文字
- 浏览器窗口尺寸改变——resize事件发生时
- 计算offsetWidth和offsetHeight属性
- 设置style属性的值

引起重绘的属性和方法：color, border-style, visibility, background, text-decoration, background-image, background-position, background-repeat, outline-color, outline, outline-style, border-radius, box-shadow, background-size

减少回流、重绘：
- 使用 transform 替代定位
- 使用 visibility 替换 display: none ，因为前者只会引起重绘，后者会引发回流（改变了布局）
- 不要把节点的属性值放在一个循环里当成循环里的变量。
- 不要使用 table 布局，可能很小的一个小改动会造成整个 table 的重新布局
- 动画实现的速度的选择，动画速度越快，回流次数越多，也可以选择使用 requestAnimationFrame
- CSS 选择符从右往左匹配查找，避免节点层级过多
- 将频繁重绘或者回流的节点设置为图层，图层能够阻止该节点的渲染行为影响别的节点。比如对于 video 标签来说，浏览器会自动将该节点变为图层。

### js脚本的加载方式
```js
// 没有 defer 或 async，浏览器会立即加载并执行指定的脚本，也就是说不等待后续载入的文档元素，读到就加载并执行。
<script src="script.js"></script>

//async 属性表示异步执行引入的 JavaScript，与 defer 的区别在于，如果已经加载好，就会开始执行——无论此刻是 HTML 解析阶段还是DOMContentLoaded 触发之后。需要注意的是，这种方式加载的 JavaScript 依然会阻塞 load 事件。换句话说，async-script 可能在 DOMContentLoaded 触发之前或之后执行，但一定在 load 触发之前执行。
<script async src="script.js"></script> (异步下载)

// defer 属性表示延迟执行引入的 JavaScript，即这段 JavaScript 加载时 HTML 并未停止解析，这两个过程是并行的。整个 document 解析完毕且 defer-script 也加载完成之后（这两件事情的顺序无关），会执行所有由 defer-script 加载的 JavaScript 代码，然后触发 DOMContentLoaded 事件。
<script defer src="script.js"></script>(延迟执行)
// 在加载多个JS脚本的时候，async是无顺序的加载，而defer是有顺序的加载。
```

FOUC：由于浏览器渲染机制（比如firefox），再CSS加载之前，先呈现了HTML，就会导致展示出无样式内容，然后样式突然呈现的现象；

白屏：有些浏览器渲染机制（比如chrome）要先构建DOM树和CSSOM树，构建完成后再进行渲染，如果CSS部分放在HTML尾部，由于CSS未加载完成，浏览器迟迟未渲染，从而导致白屏；也可能是把js文件放在头部，脚本会阻塞后面内容的呈现，脚本会阻塞其后组件的下载，出现白屏问题。