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

构建CSSOM非常非常快，并且在当前的开发工具中没有以独特的颜色显示。相反，开发人员工具中的“重新计算样式”显示解析CSS、构造CSSOM树和递归计算计算样式所需的总时间。在web性能优化方面，它是可轻易实现的，因为创建CSSOM的总时间通常小于一次DNS查找所需的时间。

### 构建渲染树

第三步是将DOM和CSSOM组合成一个Render树，计算样式树或渲染树从DOM树的根开始构建，遍历每个可见节点。每个可见节点都应用了其CSSOM规则，Render树保存所有具有内容和计算样式的可见节点——将所有相关样式匹配到DOM树中的每个可见节点，并根据CSS级联确定每个节点的计算样式。渲染树只会包含需要显示的节点和节点的样式信息，例如head部分或者display属性为none的节点不会被添加进渲染树中。

在这一过程中，浏览器会确定下每一个节点的样式到底是什么，因为CSSDOM与DOM树没有直接的关联，因此只有CSSDOM树完全构建结束之后才能用于确定DOM的样式。而因为样式你可以自行设置给某个节点，也可以通过继承获得，在这一过程中，浏览器得递归CSSOM树，然后确定具体的元素到底是什么样式，这一过程在CSSDOM过深的时候十分耗时，因此在css的声明中尽量使用id/class而避免过深的层叠嵌套。

### 布局与绘制

第一次确定节点的大小和位置称为布局。随后对节点大小和位置的重新计算称为回流。布局是确定呈现树中所有节点的宽度、高度和位置，以及确定页面上每个对象的大小和位置的过程。回流是对页面的任何部分或整个文档的任何后续大小和位置的确定。构建渲染树后，开始布局。渲染树标识显示哪些节点（即使不可见）及其计算样式，但不标识每个节点的尺寸或位置。为了确定每个对象的确切大小和位置，浏览器从渲染树的根开始遍历它。在网页上，大多数东西都是一个盒子。不同的设备和不同的桌面意味着无限数量的不同的视区大小。在此阶段，考虑到视区大小，浏览器将确定屏幕上所有不同框的尺寸。以视区的大小为基础，布局通常从body开始，用每个元素的框模型属性排列所有body的子孙元素的尺寸，为不知道其尺寸的替换元素（例如图像）提供占位符空间。假设初始布局发生在返回图像之前，由于我们没有声明图像的大小，因此一旦知道图像大小，就会有回流。

在绘制或光栅化阶段，浏览器将在布局阶段计算的每个框转换为屏幕上的实际像素。绘画包括将元素的每个可视部分绘制到屏幕上，包括文本、颜色、边框、阴影和替换的元素（如按钮和图像），浏览器需要非常快地完成这项工作。为了确保平滑滚动和动画，占据主线程的所有内容，包括计算样式，以及回流和绘制，必须让浏览器在16.67毫秒内完成。为了确保重绘的速度比初始绘制的速度更快，屏幕上的绘图通常被分解成数层。绘制可以将布局树中的元素分解为多个层。将内容提升到GPU上的层（而不是CPU上的主线程）可以提高绘制和重新绘制性能。有一些特定的属性和元素可以实例化一个层，包括video和canvas，任何CSS属性为opacity、3D转换、will-change的元素，还有一些其他元素，这些节点将与子节点一起绘制到它们自己的层上，除非子节点由于上述一个（或多个）原因需要自己的层。

当文档的各个部分以不同的层绘制，相互重叠时，必须进行合成，以确保它们以正确的顺序绘制到屏幕上，并正确显示内容。当页面继续加载资源时，可能会发生回流（如加载图像），回流会触发重新绘制和重新组合。如果我们定义了图像的大小，就不需要重新绘制，只需要重新绘制需要重新绘制的层，并在必要时进行合成。

### JS文件的处理

js的加载和解析会阻塞DOM的构建，当解析过程中遇到js文件，将暂停对DOM的解析而将控制权交给js引擎，在js运行完毕后再从中断的地方恢复DOM的构建。另外，js的引入会导致CSSDOM也会阻塞DOM的构建，由于js脚本可以更改DOM的同时也可以更改样式，而不完整的CSSOM是无法使用的，因此当js想要修改CSSOM时，将暂停js脚本执行和DOM构建，先行完成CSSOM的构建，之后执行js脚本，最后再继续DOM的构建。

### 预加载扫描器

浏览器构建DOM树时，这个过程占用了主线程。当这种情况发生时，预加载扫描仪将解析可用的内容并请求高优先级资源，如CSS、JavaScript和web字体。多亏了预加载扫描器，我们不必等到解析器找到对外部资源的引用来请求它。它将在后台检索资源，以便在主HTML解析器到达请求的资源时，它们可能已经在运行，或者已经被下载。预加载扫描仪提供的优化减少了阻塞。

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
- 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
- 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。

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

## block/inline/inline-block

- 常见的块级元素有 DIV, FORM, TABLE, P, PRE, H1~H6, DL, OL, UL 等。
- 常见的内联元素有 SPAN, A, STRONG, EM, LABEL, INPUT, SELECT, TEXTAREA, IMG, BR 等。

display:block

- block元素会独占一行，多个block元素会各自新起一行。默认情况下，block元素宽度自动填满其父元素宽度。
- block元素可以设置width,height属性。块级元素即使设置了宽度,仍然是独占一行。
- block元素可以设置margin和padding属性。

display:inline
- inline元素不会独占一行，多个相邻的行内元素会排列在同一行里，直到一行排列不下，才会新换一行，其宽度随元素的内容而变化。
- inline元素设置width,height属性无效。
- inline元素的margin和padding属性，水平方向的padding-left, padding-right, margin-left, margin-right都产生边距效果；但竖直方向的padding-top, padding-bottom, margin-top, margin-bottom不会产生边距效果。

display:inline-block

- 简单来说就是将对象呈现为inline对象，但是对象的内容作为block对象呈现。之后的内联对象会被排列在同一行内。比如我们可以给一个link（a元素）inline-block属性值，使其既具有block的宽度高度特性又具有inline的同行特性。

## css居中策略

水平居中：

- inline元素 text-align: center
- block元素 margin: 0 auto
- 多个block元素 转为inline-block，父组件text-align: center
- display: flex; justify-content: center

垂直居中：

- inline元素 line-height=height
- display: flex; align-items: center;
- block元素：top:50%;transform: translateY(50%)(高度已知可以直接设置top)