---
title: mapboxGL js源码解析
date: '2021-04-10 11:56:00'
tags: 
- 

category: Development
image:
---
## Mapbox GL JS使用
### Map

Map对象表示页面上的地图组件，包含了用于操作地图对象并通过用户操作触发事件的属性和方法，继承自Camera类，通过MapOptions设置底图的相关参数信息。

Map对象的实例函数：

```js
// 添加/删除地图内容的实例方法
addControl(control, position)
addImage(id, image, options)
addLayer(layer, beforeId?)
addSource(id, source)
// 删除所有地图相关的内部资源
remove()
removeControl(control)
removeFeatureState(feature, key)
removeLayer(id)
removeSource(id)
// 继承自Camera的视口调整实例方法
cameraForBounds(bound, options?)
easeTo(options, evnetDta?)
fitBounds(bounds, options?, eventData?)
flyTo(options, eventData?)
......
// MapOptions属性的getter/setter
......
// 地图状态获取方法
isZooming()
isMoving()
isRotating()
isSourceLoaded(id)
isStyleLoaded()
Loaded()
// 事件处理方法
on(type, layerId, listener)
off(type, layerId, listener)
once(type, layerId, listener)
// 空间查询方法（只会查询当前被渲染在地图上的元素）
queryRenderedFeatures(geometry?, options?)
// 可以查询未被渲染的元素（不包括当前视口之外的元素）
querySourceFeatures(geometry?, options?)
// others
resize(eventData?) // 改变container尺寸后重置地图大小
stop() // 停止动画执行
triggerREPAINT() // 触发渲染下一帧
```



Style

Style定义了地图的可视效果，包括：用于可视化的数据，可视化的顺序以及可视化数据使用的样式

## 源码解析

Map类型包含了一个Style对象，一个Painter对象和一个handler对象