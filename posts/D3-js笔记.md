---
title: D3.js笔记
date: '2018-08-06 21:42:54'
tags:
---

## Scale

D3中定义了比例映射函数，作用是讲domain（定义域）中的数值通过一定的映射函数，映射到range（值域），基本的使用方式如下：

```javascript
const myScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, 600])
```

颜色数据在D3中可以作为连续数据使用，因此映射函数常用于构建color map。

### 映射类型

- 连续->连续
    - scaleLinear：线性映射，y=m*x+b
    - scalePow：使用y = m * x^k + b这个数学函数来表达domain和range之间的数学函数关系，指数k使用.exponent()来设定
    - scaleSqrt
    - scaleLog：使用数学对数函数(y = m * log(x) + b)来映射domain和range，适用于数据之间有指数关系
    - scaleTime：和scaleLinear是类似的，唯一的区别是domain用于代表date的数组
    - scaleSequential：用于将连续性的数据映射为由预定义或者定制的插值函数决定的range.(一个插值函数是一个接受0到1之间的数值而输出一个在两个数字，两个颜色值或者两个字符串之间的插值的函数）,插值函数通过interpolator()设置，可以使用D3预设的颜色插值：

    - ![D3 color](D3-js笔记/001.png)
    - Clamping：默认情况下 scaleLinear, scalePow, scaleSqrt, scaleLog, scaleTime and scaleSequential 允许输入值在domain范围之外，使用clamp()可以限定输出在domain之内。
    - Nice：使用nice()将起始和结果数据规定为整数。
    - incert：使用invert()可以将range与domain对调。
- 连续->离散
    - scaleQuantize：接受连续性的domain输入而输出由range定义的离散输出，每一个range值都被映射为一个domain的等分量值区间
    - scaleQuantile：domain是由数组来定义，排好序的domain数组被均分为n个子范围，这里n是range数值的个数
    - scaleThreshold：映射连续的输入domain为由range来定义的离散值. 如果range值有n个，则将会有n-1个切分点
- 离散->离散
    - scaleOrdinal：将离散的domain values array映射为离散的range values array. domain input array指定可能的输入value,而range array则定义对应的可能的输出value.如果range array比domain array要短，则range array会重复循环.默认情况下如果输入值不在domain范围内，scale会隐含地添加这个值到domain中去，可以使用.unknown()函数来设定一个unknown values。D3提供了预定义color scheme，如d3.schemePaired，使用方法与预设interpolate相似。
    - scaleBand：当创建一个bar chart时，scaleBand可以帮助我们来决定bar的几何形状，并且已经考虑好了各个bar之间的padding值。scaleBand会将range划分为n个bands(n是domain数组的数值个数)并且在考虑padding的情况下计算出每个band的位置和宽度。每个band的宽度可以使用.bandWidth()来访问，可以使用paddingInner()和paddingOutter()来设定band之间的间距。
    - scalePoint：scalePoint 将离散的输入数值映射为在range内等距的点，点之间的距离可以通过.step()来访问，outside padding可以通过和padding to point spacing的比例来指定。