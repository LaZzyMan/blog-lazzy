---
layout: svg
title: SVG Note
date: '2018-08-04 20:17:26'
tags: 
- svg
- 前端开发
---

# SVG Note

SVG是XML语言的一种形式，有点类似XHTML，它可以用来绘制矢量图形，例如右面展示的图形。SVG可以通过定义必要的线和形状来创建一个图形，也可以修改已有的位图，或者将这两种方式结合起来创建图形。图形和其组成部分可以变形，可以合成，还可以通过滤镜完全改变外观。

## 基本形状

- 矩形rect
    - x：矩形左上角的x位置
    - y：矩形左上角的y位置
    - width：矩形的宽度
    - height：矩形的高度
    - rx：圆角的x方位的半径
    - ry：圆角的y方位的半径
- 圆形circle
    - r：圆的半径
    - cx：圆心的x位置
    - cy：圆心的y位置
- 椭圆ellipse
    - rx：椭圆的x半径
    - ry：椭圆的y半径
    - cx：椭圆中心的x位置
    - cy：椭圆中心的y位置
- 直线line
    - x1：起点的x位置
    - y1：起点的y位置
    - x2：终点的x位置
    - y2：终点的y位置
- 直线polyline
    - points：点集数列。每个数字用空白、逗号、终止命令符或者换行符分隔开。每个点必须包含2个数字，一个是x坐标，一个是y坐标。
- 多边形polygon
    - points：点集数列。每个数字用空白、逗号、终止命令符或者换行符分隔开。每个点必须包含2个数字，一个是x坐标，一个是y坐标。
- 路径path
    - d：一个点集数列以及其它关于如何绘制路径的信息。
- g：图形几何，可以为多个元素赋予样式
- image
    - xlink：图像地址
    - width
    - height

## 路径

path元素的形状是通过属性d定义的，属性d的值是一个“命令+参数”的序列。每一个命令都用一个关键字母来表示，比如，字母“M”表示的是“Move to”命令，当解析器读到这个命令时，它就知道你是打算移动到某个点。跟在命令字母后面的，是你需要移动到的那个点的x和y轴坐标。比如移动到(10,10)这个点的命令，应该写成“M 10 10”。这一段字符结束后，解析器就会去读下一段命令。每一个命令都有两种表示方式，一种是用大写字母，表示采用绝对定位。另一种是用小写字母，表示采用相对定位。

- M x y：Move To
- L x y：Line To
- H x：绘制水平线
- V y：绘制垂直线
- Z：闭合路径
- C x1 y1, x2 y2, x y：三次贝赛尔曲线
- S x2 y2, x y：创建与前一曲线连接的贝塞尔曲线，即第一个控制点为前一曲线第二控制点的对称。
- Q x1 y1, x y：二次贝赛尔曲线
- T x y：延长二次贝塞尔曲线
- A rx ry x-axis-rotation large-arc-flag sweep-flag x y：绘制弧段。large-arc-flag决定弧线是大于还是小于180度，0表示小角度弧，1表示大角度弧。sweep-flag表示弧线的方向，0表示从起点到终点沿逆时针画弧，1表示从起点到终点沿顺时针画弧。

## 样式

### 填充和边缘样式

- fill
- fill-opacity
- stroke
- stroke-opacity
- stroke-width
- stroke-linecap
- stroke-dasharray

### 渐变

通过为图形设置fill="url(#GradientId)"属性可以实现图形填充渐变效果。

- 线性渐变
    - linearGradient：x1，y1，x2，y2，id
    - stop：offset，stop-color，stop-opacity
- 径向渐变
    - radialGradient：cx，cy，r，id，fx，fy
    - 焦点若设置在中心点圆圈之外会导致渐变非正常显示
- spreadMethod
    - Pad：当渐变到达终点时，最终的偏移颜色被用于填充对象剩下的空间。
    - reflect：会让渐变一直持续下去，不过它的效果是与渐变本身是相反的，以100%偏移位置的颜色开始，逐渐偏移到0%位置的颜色，然后再回到100%偏移位置的颜色。
    - repeat：也会让渐变继续，但是它不会像reflect那样反向渐变，而是跳回到最初的颜色然后继续渐变。

### 图案

通过为图形设置fill="url(#PatternId)"属性可以实现图形填充图案效果。

在pattern元素内部你可以包含任何之前包含过的其它基本形状，并且每个形状都可以使用任何样式化，包括渐变和半透明。

### 文本

- text
    - text-anchor：start、middle、end或inherit，允许决定从这一点开始的文本流的方向。
    - font-family
    - font-style
    - font-weight
    - font-variant
    - font-stretch
    - font-size
    - font-size-adjust
    - kerning
    - letter-spacing
    - word-spacing
    - text-decoration
- tspan：该元素用来标记大块文本的子部分，它必须是一个text元素或别的tspan元素的子元素。
- tref：允许引用已经定义的文本，高效地把它复制到当前位置。可以使用xlink:href属性，把它指向一个元素，取得其文本内容并可以独立于源样式化它、修改它的外观。
- textPath：该元素利用它的xlink:href属性取得一个任意路径，把字符对齐到路径，于是字体会环绕路径、顺着路径走

## 变形

变形通过transform属性赋值给图形对象，或者在g对象上使用transform属性来改变坐标系。

- translate(x, y)
- rotate(degree)
- scale(rate)
- matrix(a, b, c, d, e, f)

使用clip-path属性可以对图形进行裁剪，裁剪区域通过clipPath声明，声明方式与gradient相近。

使用mask可以对图形进行遮罩，通常用于进行透明度变化等，遮罩图形使用mask声明。