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

## 渲染流程

- 创建Map对象实例传递dom容器和地图参数options
  - Map对象构造函数中通过容器和地图参数创建VogoBaseMap实例
  - Map对象从VogoBaseMap实例中获取地图transform并利用VogoBaseMap实例的renderer/camera/gl/rootGroup/clipGroup对象创建GiViewer实例
  - 得到GiViewer实例的geoTransform/imageManager/glyphManager/layerManager/sourceManager
    - GeoTransform：通过坐标系初始化（4326/3857），用于实现地理坐标到投影坐标的转换
    - WorkerScheduler：根据逻辑进程数量创建逻辑处理器数量/3个Worker对象并用WorkerWrapper包装保存在this.workers，get方法会按顺序循环调用这些worker，workerScheduler.broadcast方法用于向所有worker分发任务
      - WorkerWrapper：对worker进行包装，通过newWorkerWrapper(new Worker(main.worker.js))创建对象时，会分别从主线程和worker对worker进行初始化，添加message响应函数。workerWrapper对象保存一个callbacks对象，主线程调用dispatch方法为worker分配任务时会为任务的每一个action的callback创建callbackId并将其作为索引在callbacks中保存一个解析返回值->调用callback->promise resolve的函数，之后将promise保存在promises中，并向worker线程发送任务信息，随后等待所有promise setteled之后返回；
      - worker线程接收到任务信息（id，namespace，actions）后执行handleWorkerTask方法，通过InvokingTask对象向任务队列中放入任务并触发队列执行
      - InvokingTask：创建MessageChannel，port1负责触发队列中任务的执行，port2负责通知port1当前任务执行完毕
      - NameSpace：执行worker线程任务的基类，worker线程中通过namespace参数指定任务对应的NameSpace子类对象，并通过actions和id找到子类对象需要执行的方法。nameSpace.execActions方法支持两种action：创建对象和执行对象方法，创建对象会为子类创建action.lib指定的对象保存在context中；执行对象方法会根据currentId（通过setLibId设置）执行子类对象context中对应id对象的action方法，当currentId不存在时默认只是子类对象this中的方法。由于创建对象方法没有返回值，因此直接向主线程传递当前任务的callbackId，而执行对象方法需要通过workerWrapper的dispatch worker线程方法，将返回结果中的arraybuffer对象单独提取出来进行控制权移交（直接复制传递损耗过大）再向主线程发送结果。
      - workerWrapper主线程接收到信息后会触发handleCommonThreadTask响应，在callbacks中通过id寻找actions对应的callback放入invokingTask队列中执行，actinos的所有callback执行结束后，触发主线程dispatch中的promise.all，完成这一异步任务执行操作。
    - TileClipMask：通过模版测试（stencil test）对矢量瓦片的重叠部分进行裁剪
  - giViewer.update()绑定到baseMap对象的onBeforeRender事件响应
  - 20ms后抛出load事件
- 传递mapbox style url创建MapboxStyleLayer(MapboxStyle)对象
- 将mapboxStyleLayer添加到map中
  - mapboxStyleComplier解析stylesheet得到rootStyleComponent
  - createDefaultTheme
  - updatePropConfig：更新rootStyleComponent中propConfig样式
  - compileStyleSheet：mapboxStyleCompiler重新编译rootStyleComponent
  - _parseStyle解析图层样式
    - 解析字体url并通过glyphManager设置字体
    - 获取雪碧图image和json，切分后添加到imageManager
    - 解析stylesheet中的source url添加到sourceManager
    - 根据source类型（Vector）创建source对象保存到sourceCache
    - 将layers转为GILayer添加到map中
      - layerManager根据layer类型创建图元对象并调用addTo方法将图元添加到map
      - 更新样式并创建styleState，获取从style中获取图元类指定的programKey的值，分析其是否是expression，并调用hasOperation方法计算belong：programKey对应attribute（需要从feature属性中动态获取值）还是uniform（全局静态值），同时将其原先的类型保存到lastBelong
      - 检测layer的source是否存在，不存在则常识使用sourceData创建，能够得到source对象则通过source.bindLayerState绑定renderState到source
      - renderState包含创建geometry和material需要的状态信息，包括styleState/sourceData/filter/version（用于确定是否需要更新）/visible等
      - 图元对象监听到map的source相关事件响应，在onSourceAdd和onSourceRemove绑定和删除source，在onSourceData响应中调用具体图元类的onSourceData方法
      - 触发自身的onAdd方法
- map重渲染，在onBeforeRender响应中触发giViewer对象的update方法，方法中调用sourceManager.update方法，将sourceCache中保存的需要更新的source进行加载
  - load（Source）：通过workerScheduler广播运行source.setLayers/vetorSource.setLayer方法，将当前所有图层的renderState同步更新到每个worker线程的环境中，并按照source layer对layer renderState进行归类保存。
  - load（Vector）
    - 获取当前屏幕大小，更新tileCache的最大长度（新长度小于order长度会从order头部逐个删除tile）
    - getCoveringTileIDs：map.transform.coveringTiles返回tiles（extents和xyz），并通过这些参数计算tile key
    - 根据tile key调用vector.addTile，如果缓存中保存了对应id的tile则直接使用，否则创建并加载tile
      - 根据tile生成api请求url
      - 为tile生成responseId并指定callback，通过giViewer获取worker分配执行vetorSource.vectorTileSource.loadTile任务并传递parmas和callback
        - vertorTileSource.loadTile方法创建workerTile对象，在workerTile.loadVector方法中先通过XHR请求arraybuffer数据，之后利用vt.VectorTile解析出VectorTile对象
        - 通过workerTile.parse方法得到buckets，调用callbck返回给tile对象
          - 获取每个sourceLayer的geojson features
          - 对于sourceLayer对应的所有图层，创建对应的图元实例，并调用geometry.createBuffer()创建用于渲染的buffer（positionVertex/attrVertex）
          - 如果layer类型是fill/line则可以直接将buffer保存到buckets；
          - 如果layer类型为symbol，则加载流程为：在图元的geometry.createBuffer方法中传入getImages和getGlyphs方法，createB方法返回promise(1)，在其中调用两个方法得到promise(2)，promise(2)中将createBuffer中通过解析style得到的image和glyph依赖将其添加到workertile的dependencies对象，并创建回调函数callback(1)，遍历sourceLayer下的所有图层后，workerTile通过worker.send方法将需要加载的图片和字体依赖以及callback(1)传递给主线程，主线程中创建callback(2)，并将其与callbackId(1)和其他参数一起传递给workerScheduler.getImages方法，最终调用到imageManager.getImages，对于已经存在于imageManager中的image，直接将其复制到response，对于不存在的image则通过loadImage()加载并返回promise(3)，图片加载完成触发resolve(3)检验图片有效性并触发callback(2)，callback(2)中向worker线程发送res，worker线程再次调用handleCommonThreadTask方法调用callback(1)返回res，callback(1)中利用返回的图片数据创建imageAtlas并逐个触发dependencies中保存的callback，在callback中触发resolve(2)，之后在geometry中触发resolve(1)通过createVertexs方法返回buffer数据，最终等待所有promise返回之后，调用最外层promise的resolve函数返回所有buckets结果
      - tile加载完成触发onSourceData事件将bucket传递给图元对象
    - 将不再存在于屏幕内的tile从vector._tiles中删除，并保存在tileCache中
    - 保存在cache中的tile会在过期后触发过期回调，将tileId添加到vector._removeLoadedIds，并在clearSourceLoaded中通过workerScheduler广播清楚任务
  - tileCilpMask.render()
- map中的primitive对象响应onSourceData事件，调用对应图元对象的onSourceData函数的renderTile方法
  - 创建目标类型图元所对应的Mesh
  - 创建styleGeometry
  - 创建styleMaterial并调用updateProgramAttribute根据styleStates对着色程序中#pragma datavgi: define代码替换为变量声明
    - belong发生变化：变为uniform则为片元着色器添加uniform，反之删除uniform；belong不发生变化且为uniform则更新片元着色器uniform
    - uniform：在两个着色器中正常声明
    - attribute：在顶点着色器中声明attribute，在片元着色器中声明varying，如果varying存在，则在顶点着色器中增加varying声明
    - initial：片元着色器中直接声明变量；顶点着色器中用于为varying赋值
  - 利用buffer中的数据设置geometry的顶点索引和attibute
  - 在mesh.onBeforeRender中根据tileId设置材质的stencilRef（tileClipMask）
  - 图元对象将mesh添加到group对象（group对象在onAdd中添加到了giViewer.rootGroup中)，随后触发地图重渲染，刷新屏幕渲染结果显示对象