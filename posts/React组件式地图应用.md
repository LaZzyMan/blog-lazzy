---
title: React组件式地图应用
date: '2018-03-29 16:58:29'
tags:
- react
- webpack
- mapbox
- 前端
---

- 使用react框架和MapboxJS搭建一个简单的地图应用，实现在底图上进行WSM服务和WFS服务的框选式覆盖功能，以及基本的图层管理。
- 使用webpack实现热加载服务器并对项目进行打包。

----
## 环境配置
首先创建一个React项目并安装依赖库：
```shell
# 全局安装create-react-app并创建项目
$ npm install -g create-react-app
$ create-react-app wsmmap
```
在项目目录下运行：
```shell
# react相关库
$ cnpm install react, react-dom, react-scripts --save
# mapboxGL和draw
$ cnpm install mapbox/mapbox-gl-draw, mapbox-gl --save
# ant Design组件库
$ cnpm install antd --save
# webpack相关库
$ cnpm install webpack, babel-loader, file-loader, url-loader, style-loader, css-loader, html-webpack-plugin --save
# 用于jsx语法兼容的babel相关库
$ cnpm install bable, babel-cli, babel-preset-react, babel-preset-env --save
```
运行`$ npm start`可以看到react demo的欢迎界面。

注：npm在项目目录下的命令行指令可以在package.json文件中浏览和修改
```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
```
可以在这里自定义一些命令，如数据导入脚本、部署命令等，之后完成webpack打包后将把这里的本地服务器修改为webpack服务器。

----
## 搭建网页框架

首先在public文件夹下修改index.html修改网页的title以及将favicon.ico替换为自己的网站图标，打开index.js

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
```
index.js的任务主要是将自定义的组件App通过ReactDOM关联到html中，registerServiceWorker是creat-react-app自动创建的index.js文件中用于注册到react-native服务器的函数，在webpack配合完成后可以删除。

之后创建App.js用于主框架搭建

```jsx
import React from 'react';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <p>Hello World!<p>
        );
    }
}

export default App
```

通过继承React.Component类自定义创建组件，并重写render()函数指定返回的html元素。
注：React规定render返回的元素中顶级元素只能有一个。

react组件类内部主要包括：state、prop、生命周期函数、render函数以及自定义函数。

ES6定义了import和export的语法，使用export default来使定义的组件可以被其他组件或文件调用。关于ES6的其他语法参考[《ECMAScript 6 入门》](http://es6.ruanyifeng.com/)。

许多第三方网站为React开发了响应式组件库，可以很大程度的避免底层组件和样式编写，较为流行的组件库有：[Material-UI](https://material-ui-next.com/)，[Ant-Design](https://ant.design/)，[React-Belle](http://nikgraf.github.io/belle/#/?_k=25k5zl)等，这里使用Ant-Design搭建框架。

直接使用Antd创建一个包含导航栏和底部信息栏的布局：
```jsx
import { Layout, Menu, Icon, Button } from 'antd'
// ES6中使用const定义常量，let定义变量
const { Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
// 将一下代码写入render的返回值中
<Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>User</span></span>}
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span>Team</span></span>}
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
```
效果如图：
![antd](React组件式地图应用/003.jpg)

创建urls.js，用于存储收集到的WMS和WFS服务的URL

由于这里采用瓦片加载方式（即按需加载），因此将bbox参数设置为{bbox-epsg-3857}，mapbox在加载图层是自动生成每块瓦片的bbox范围，同时地理参考要设置为ESPG:3857的投影坐标系。

```jsx
const urls={
    WMS:[
        {name: 'Blue Marble', url: 'https://demo.boundlessgeo.com/geoserver/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=64&height=64&layers=nasa:bluemarble'},
        {name: 'Natural 2015', url: 'https://geodata.state.nj.us/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=64&height=64&layers=Natural2015'},
        {name: 'NA Road', url: 'https://demo.boundlessgeo.com/geoserver/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=64&height=64&layers=ne:ne_10m_roads_north_america'},
        {name: 'Water Body', url:' https://hydro.nationalmap.gov/arcgis/services/nhd/MapServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=64&height=64&layers=1,5&styles=default,default'},
        {name: 'DEM', url: 'https://services.nationalmap.gov/arcgis/services/3DEPElevationIndex/MapServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=64&height=64&layers=1'},
        {name: 'Precipitation', url: 'http://nowcoast.noaa.gov/arcgis/services/nowcoast/analysis_meteohydro_sfc_qpe_time/MapServer/WmsServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=64&height=64&layers=5&styles=default'}
    ],
    WFS:[
        {name: 'Earthquack', type:'circle', url :'https://earthquake.usgs.gov/fdsnws/event/1/query?starttime=2016-07-01&endtime=2016-07-15&format=geojson'},
    ],
}

export default urls;
```

----

## 为网页框架添加响应
React组件包含两种属性：state和prop
- state声明的属性用于表示组件内部的状态以及控制组件内部的响应，在不适用Redux的情况下，外部调用不能改变和访问内部属性。state通过`state = {<name>: value}`形式进行初始化，组建类内部不能添加新的state也不能直接改变state的值，而需要使用`this.setState()`方法，这一方法的调用会自动引发组件的刷新，可以使用StateDidChanged、StateWillChanged等生命周期函数重写这些响应。
- props是作为html元素属性对外暴露的组件属性，可以直接在html标签中设置，因此其他组件可以直接访问和修改。props的操作与正常类属性想用，props的改变也不会触发组件的刷新。但是也可以通过与Props相关的生命周期函数来重写属性变更事件响应。

因此，对app.js中的App类进行修改

```jsx
class App extends React.Component {
    // 在构造函数中初始化props和state，也可以选择直接使用state进行初始化
    constructor(props){
        super(props);
        this.state = {
            // 编辑模式
            editMode: false,
            // 选中的服务id
            serviceID: 0
        }
    }
    enableEditMode = () => {
        // 开启编辑模式
        this.setState({editMode:true})
    }
    disenableEditMode = () => {
        // 关闭编辑模式
        this.setState({editMode:false})
    }
    changeSource = (e) => {
        // 在导航栏中选择服务
        this.setState({serviceID: e.key})
        // 在开发者工具的Console栏可以查看log，便于调试和发现错误
        console.log(this.state.serviceID)
    }
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider>
                    <div className="logo"><span>WSM Editor</span></div>
                    <div className="tools">
                        <Button.Group>
                            <Button type="primary" icon="edit" ghost={!this.state.editMode} onClick={this.enableEditMode}>Edit</Button>
                            <Button type="primary" icon="desktop" ghost={this.state.editMode} onClick={this.disenableEditMode}>Scan</Button>
                        </Button.Group>
                    </div>
                    <Menu theme="dark" defaultSelectedKeys={['wms']} defaultOpenKeys={['wms', 'wfs']} mode="inline" onClick={this.changeSource}>
                        <SubMenu
                            key="wms"
                            title={<span><Icon type="picture" /><span>WMS</span></span>}
                        >
                            {
                                urls.WMS.map(function (element, index) {
                                    return (
                                        <Menu.Item key={1000 + index + ""}>{element.name}</Menu.Item>
                                    )
                                })
                            }
                        </SubMenu>
                        <SubMenu
                            key="wfs"
                            title={<span><Icon type="global" /><span>WFS</span></span>}
                        >
                            {
                                urls.WFS.map(function (element, index) {
                                    return (
                                        <Menu.Item key={2000 + index + ""}>{element.name}</Menu.Item>
                                    )
                                })
                            }
                        </SubMenu>
                        <Menu.Item key="custom">
                            <Icon type="plus-circle-o" />
                            <span>Custom URL</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ margin: '0 0' }}>
                        <MapControl editMode={this.state.editMode} serviceID={this.state.serviceID}/>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        WMS(WFS) Editor ©2018 Created by LaZzy
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
```

得到的导航栏效果如下：

![nav](React组件式地图应用/004.jpg)

----

## 使用MapboxGL编写React组件

MapboxGL是mapbox提供的基于WebGL的交互式地图渲染JavaScript库，使用MapboxGL编写React组件有两种方式：直接使用react-mapbox包提供的组件或自定义编写组件。由于要频繁的使用图层的增删以及地图绘图操作，这里选择使用MapboGL原生接口编写。有关react-mapbox-gl的使用参考[GitHub react-mapbox-gl](https://github.com/alex3165/react-mapbox-gl)

编辑MapControl.js文件：
```jsx
import React, {Component} from 'react'
import mapboxgl from "mapbox-gl"

// 你的mapbox的ak
mapboxgl.accessToken = 'pk.eyJ1IjoiaGlkZWlubWUiLCJhIjoiY2o4MXB3eWpvNnEzZzJ3cnI4Z3hzZjFzdSJ9.FIWmaUbuuwT2Jl3OcBx1aQ'

class MapControl extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentLayers: 0,
        }
    }
    // componentDidMount()函数是React生命周期回调函数之一，表示DOM已经装载，即已经将render中的元素装载到html
    componentDidMount(){
        this.map = new mapboxgl.Map({
            container: 'map',
            // 可以在mapbox studio中自定义主题得到style地址
            style: 'mapbox://styles/hideinme/cjgdl630a000y2rqjzqhyraby',
            center: [-74.50, 40],
            zoom: 9,
            // 地图的地平线法线偏角
            pitch: 100,
        })
        // 添加地图控件
        this.map.addControl(new mapboxgl.NavigationControl())
    }
    render(){
        return(
            <div id='map' style={{height: '-webkit-fill-available'}}/>
        )
    }
}

export default MapControl
```

在地图上添加绘图组件，Mapbox提供了绘图扩展库Mapbox-gl-draw，首先引入库文件以及样式表文件
```jsx
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import MapboxDraw from "@mapbox/mapbox-gl-draw/index";
```
同样在React组件装载完成的回调函数中加载Draw组件：
```jsx
import url from .url
componentDidMount(){
        ...

        this.draw = new MapboxDraw({
            displayControlsDefault: false,
            controls:{
                polygon:true,
                trash:true
            },
        })
        this.map.addControl(this.draw)
        this.map.on('draw.create', this.createLayer)
        this.map.on('draw.delete', this.deleteLayer)
        this.map.on('draw.update', this.updateLayer)
        ...
    }
```

MapboxDraw组件包含了一系列controls组件，这里只使用了多边形绘图和删除要素控件，添加后的界面如下：
![Draw控件](React组件式地图应用/001.jpg)
点击多边形工具后，默认单击绘制定点，双击完成多边形绘制，完成后点击多边形可以进行编辑和删除操作。

Mapbox-draw-gl还提供了许多不借助控件的直接绘图方式，可以方便的用于地图要素的绘制、选择和编辑以及绘图模式的切换等，详细信息参考[API 文档](https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md)。

在上面的代码中添加了draw.create等三个事件的监听响应函数，这是mapbox-draw-gl提供的事件，下面以create为例添加事件响应，实现在多边形范围内覆盖WMS图层。

由于WMS服务只能接受矩形bbox参数，因此首先要绘制出多边形的最小外包矩形：
```jsx
createWMSLayer= (e) => {
        this.setState({
            currentLayers: this.state.currentLayers + 1
        })
        const points = e.features[0].geometry.coordinates[0]
        let bottomleft = [180, 90]
        let topright = [-180, -90]
        for(let point of points){
            if(point[0]<bottomleft[0]){
                bottomleft[0]=point[0]
            }
            if(point[1]<bottomleft[1]){
                bottomleft[1]=point[1]
            }
            if(point[0]>topright[0]){
                topright[0]=point[0]
            }
            if(point[1]>topright[1]){
                topright[1]=point[1]
            }
        }
        // 绘制最小外包矩形图层
        this.map.addLayer({
            'id': this.state.currentLayers+"",
            // type指定了图层种类
            'type': 'fill',
            // source指定了图层的数据来源
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [[
                            [bottomleft[0], topright[1]],
                            bottomleft,
                            [topright[0], bottomleft[1]],
                            topright,
                            [bottomleft[0], topright[1]],
                            ]]
                    }
                }
            },
            'layout': {},
            // paint指定了图层绘制的样式
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.1,
                'fill-outline-color': '#088'
            }
        })
    }
```

得到外包矩形后将其作为边界请求WMS服务并添加进地图图层：

```jsx
// 首先通过prop获得的serviceID来确定服务类型以及url
let urlIndex = this.props.serviceID%1000
let serviceType = (this.props.serviceID-urlIndex)/1000
if(serviceType===0){
            return
        }else if(serviceType===1){
            // 添加WMS图层
            // 第一个参数为图层，第二个参数制定图层添加位置，此处由于mapbox地图的最上层图层为waterway-label，故设置为该图层
            this.map.addLayer({
                'id': this.state.currentLayers + "_wms",
                'type': 'raster',
                'source': {
                    'type': 'raster',
                    // 瓦片来源设置为wms服务地址
                    'tiles': [
                        urls.WMS[urlIndex].url
                    ],
                    // 瓦片大小，过小会导致加载缓慢
                    'tileSize': 64,
                    'bounds': [bottomleft[0], bottomleft[1], topright[0], topright[1]],
                },
                'paint': {}
            }, 'waterway-label')
        }else{
            // 添加WFS图层
            this.map.addLayer({
                'id': this.state.currentLayers+"_wfs",
                'type': urls.WFS[urlIndex].type,
                'source': {
                    'type': 'geojson',
                    'data': urls.WFS[urlIndex].url,
                },
                'paint': {}
            })
        }
```

注意到WFS和WMS添加的分别为矢量图层和栅格图层，关于其更多的设置信息和其他图层形式，参考[Mapbox官方文档](https://www.mapbox.com/mapbox-gl-js/api/#sources)。

在地图上尝试添加WMS/WFS服务：
![Draw控件](React组件式地图应用/002.jpg)

未完待续...

----

## 使用webpack进行打包

webpack用于将网站所有文件打包并压缩以提升网站的加载速度，并且提供自动生成HTML文件、自动打开浏览器、热加载服务器等功能插件。

首先在项目目录下新建webpack.config.js文件(config.js中要删除注释)：

```js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports={
    // 入口js文件(将组建装载到DOM的js文件)
    entry: './script/index.js',
    // 压缩后js输出路径和文件
    output: {
        path:path.resolve(__dirname, 'public'),
        filename:'bundle.js'
    },
    mode:'development',
    module: {
        // 使用正则表达式匹配文件类型并分别制定loader
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    // 由于使用了react和jsx语法，要加入相应的预设规则
                    presets: ['env', 'react'],
                    // 用于进行热加载的插件
                    plugins: ["react-hot-loader/babel"],
                    compact: false
                }
            }
        },
            {
                // 不适用eslint这段可以不要
                test: /\.js$/,
                enforce: "pre",
                loader: "eslint-loader",
            },
            {
                // 图片文件loader
                test: /\.(png|jpg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 超过8k的图片会以url方式插入，否则在js中直接编码
                        limit: 8192
                    }
                }]
            },
            {
                test: /\.svg$/,
                use: ['svg-url-loader']
            },
            {
                // css文件loader？modules表示开启css modules
                test: /\.css$/,
                loader: "style-loader!css-loader?modules"
            }
        ]
    },
    plugins: [
        // html自动生成插件
        new HtmlWebpackPlugin({
            // html模板位置
            template: './public/index.template.html',
            filename:'index.html'
        }),
        new webpack.NamedModulesPlugin(),
    ],
    devServer: {
        // webpack-dev-server配置
        contentBase: path.resolve(__dirname, 'public'),
        inline: true,
        // 开启热加载
        hot: true,
    },
};
```

修改package.json中的npm命令行指令:

```json
"build": "webpack",
"start": "webpack-dev-server --content-base public --inline --hot --open"
```

注：命令行中使用-hot，则webpack配置文件中不必再配置热加载插件，否则会导致命令行报错。

项目安装的运行方式:

```shell
$ npm install
$ npm bulid
$ npm start
```