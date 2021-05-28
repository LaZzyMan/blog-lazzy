---
title: 基于threejs实现mapbox自定义图层
date: '2021-05-25 11:56:00'
tags: 
- 

category: Development
image:
---

## 从WebGL到Three.js

### WebGL原生接口

Three.js本质上是对于webGL接口的对象化封装以及常用渲染算法的实现，通常情况下使用webGL原生接口进行渲染的过程包括：
- 创建缓冲并绑定到绑定点，之后通过绑定点向缓存中存入数据
  - gl.createBuffer()
  - gl.bindBuffer()
  - gl.bufferData()
- 创建并绑定texture
  - gl.createTexture()
  - gl.bindTexture()
  - gl.texParameteri()
  - gl.texImage2D()
  - gl.activeTexture()
- 创建、编译着色器，并根据顶点和片元着色器生成着色程序
  - gl.createShader()
  - gl.shaderSource()
  - gl.compileShader() 
  - gl.createProgram()
  - gl.attchShader()
  - gl.linkProgram()
- 指定着色程序从缓存中读取数据的方式：
  - gl.enableVertexAttribArray()
  - gl.getAttribLocation()
  - gl.vertexAttribPointer()
- 指定着色程序的全局变量uniforms：
  - gl.getUniformLocation()
  - gl.uniformxx()
- 设置gl相关选项，例如视口/帧缓冲/blending等
- 运行gl.drawArray()进行渲染

webGL原生接口的渲染流程经过简单的按照步骤封装之后可以实现方便的调用，但是最大的问题在于整个过程中所有的方法都作用于同一个gl对象，渲染所需的变量、纹理、缓存和着色程序在渲染进行时都需要保存和绑定到gl对象，而gl对象有且只有一个，一旦需要对于多个对象或者复杂对象的渲染就需要不断地切换gl对象上绑定的着色程序和相关缓存及变量，这一过程十分容易引起错误。另一方面，webgl渲染完全基于三角网片元的渲染，对于复杂几何体对象，通过顶点数组构建三角网非常麻烦，同时诸如光照、阴影等常用模型的相关计算也异常复杂。

### Three.js对象结构

Three.js正是为了解决这些问题而对webgl原生API进行的封装，其对象结构主要包括了：

#### Object3D
Object3D是threejs渲染的主体对象（Scene本质上是一个空的Object3D对象），支持树结构的嵌套调用，每一个Object3D对象拥有自身的Matrix记录其相对于自身模型坐标系的变换，想要对Obejct3D对象进行矩阵变换可以直接对matrix属性进行操作，也可以通过object3D对象封装的变换方法（使用这种方法进行变换不会改变matrix矩阵，需要将matriAutoUpdate设置为true从而在render开始前使其根据自身的变换参数重新计算matrix；相反的，如果手动修改matrxi则需要禁用自动更新来防止其重新计算）。

Object3D对象还具有MatrixWorld属性记录其在世界坐标系下的矩阵变换，世界坐标转换通过树结构逐层转换来实现，即对象MatrixWorld=父对象MatrixWorld*自身Matrix；MatrixWorld最终会作为modelMatrix传入着色程序，因此调试时通常需要关注matrixWorld的更新状态。

Layers也继承自Object3D对象，其本身也是一个空的对象，用于将场景中的对象进行分层，默认情况下，Object的children中的所有对象都位于layer0中，可以通过改变对象的layer来调整对象的可见性；camera对象默认情况下只显示同一layer中的对象，也可以通过camera.enable()来进行控制。

着色器的渲染对象包括Point/Mesh/Line等，这些类均继承自Object3D类，它们实际上指定了渲染时webgl drawArray的绘制模式（POINTs/TRIANGLES/LINES等）。

#### Camera

本质上也继承自Object3D，但主要功能不是用于进行渲染，而是利用相机参数计算projectionMatrix以及利用自身变换矩阵的转制逆矩阵MatrixWorldInverse作为渲染对象的CameraMatrix，从而实现渲染的相机调度相关操作。顶点着色器在渲染顶点时，利用对象自身的世界坐标转换矩阵和相机矩阵进行转换就可以得到顶点在给定的场景和相机位置下的屏幕坐标，即gl_Position = projectionMatrix * cameraMatrix * modelMatrix * position.

#### BufferGeometry
geometry类用于存储TypedArray数据到Buffer，并通过BufferAttribute将Buffer绑定到着色程序的build-in/custom attribute。BufferGeometry是各种geometry类的基类，需要直接通过webgl的顶点添加方式向BufferGeometry添加顶点（即基于三角面的几何体搭建）。

值得注意的是BufferGeometry直接通过position属性对应的Buffer来确定绘制顶点的个数object.count（相当于drawArray中传入的数量），且position属性默认类型为vec3，缺少position属性将不能进行顶点的绘制（即使在vertexShader中利用其他attribute指定了gl_position），threejs设置的内置attribute还有normal（可以直接调用geometry.computeVertexNormal()计算）以及color（需要material中启用vertexColor）等。

但是，如上文所介绍的，几何体通常需要构建复杂的三角网来实现，因此Three提供了继承自BufferGeometry的众多Geometry类，其作用在于能够通过更简单的参数设置（长宽高/半径等）来自动完成复杂的顶点TypeArray的构建并自动绑定到position属性。

#### Material

Material相当于webgl中的着色程序以及webgl渲染设置的集合，Material指定了渲染的混合方式（blending/stencilTest/deepTest相关设置）以及裁剪，透明度等选项。Threejs提供了众多的预设材质用于不同需求的渲染，其内部通过集成大量的shader chunk实现了复杂的光照/阴影/贴图算法并整合到着色器来实现不同材质的渲染。另外，也可以通过ShaderMaterial来使用自定义的vertex/fragmentShader创建着色程序用于渲染。

通过Material创建的着色程序中会加入内建的attribute（position、normal、color）、uniform（projectionMatrix、cameraMatrix等）以及全局常量（#define opacity等Material属性信息），自定义的uniforms和attributes则分别需要在materials中添加和通过bufferAttribute导入缓存，并在自定义的着色器中加以声明。

#### Texture

threejs中texture与webgl一样可以通过图片/canvas/video/typedArray进行创建，可以通过TextureLoader.load()加载图片创建texture并执行回调函数；使用TypedArray创建texture则通过DataTexture类实现。与webgl接口相同，需要对magFilter/minFilter/format/type等属性进行设置，而不同点在于在添加uniform时，threejs可以直接将texture添加到uniform而不需要绑定texture到gl并通过uniform传入绑定位置，threejs会在render方法中自动完成这一过程。

threejs同样也实现了webgl的framebuffer功能并将其包装到WebGLRenderTarget类，创建WebGLRenderTarget对象时会自动创建一个image为undefine的texture对象，当调用renderer.setTarget()时，threejs会自动将该texture绑定到gl的帧缓冲区并将结果渲染到texture。但是值得注意的是，WebGLRenderTarget.setTexture(tetxure)方法接受一个texture对象作为参数，但并不会直接将它设置为自身的texture，而是会将texture的image替换为指定长宽的空值，因此如果需要保留传入的texture的数据，则需要直接对WebGLRenderTarget.texture赋值。

```js
// WebGLRenderTarget.setTexture
setTexture( texture ) {
		texture.image = {
			width: this.width,
			height: this.height,
			depth: this.depth
		};
		this.texture = texture;
	}
```

## Mapbox CustomLayerInterface

### 渲染逻辑分割

mapboxjsgl自定义图层接口简单来说提供了三个位置进行自定义操作，分别是constructor、onAdd以及render，对应了图层创建、图层被添加进地图以及图层渲染三个时间点。

```js
class MyLayer {
  constructor() {
    this.id = 'layer-name';
    this.type = 'custom';
    this.renderingMode = '2d';
  }
 
  onAdd(map, gl) {}
  render(gl, matrix) {}
}
map.on('load', ()=> map.addLayer(new MyLayer()));
```

基于webgl实现自定义图层的过程中，由于一切相关操作都要依赖于gl对象，因此与渲染相关的准备工作只能在onAdd()获得地图gl对象之后开始，而得益于threejs的对象化处理，我们可以将一部分耗时的初始化逻辑在constructor中完成来减少使用中反复添加图层带来的卡顿。在构造函数中，可以进行一系列与map和gl对象无关的初始化操作，例如shadermaterials材质的初始化、渲染对象（object）的创建、渲染所需数据的加载、光照效果初始化以及渲染所需选项（options）的设置等。

在onAdd响应中，类实例将获得当前地图的地图对象和gl context对象，在这一部分可以声明Renderer和Camera对象，之所以在这一部分声明Camera对象是由于需要通过map对象绑定实现相机同步，这一部分将在下面详细介绍。此外，对于地图事件，如move/resize等的绑定也需要在这一生命周期中完成，相应的解除绑定操作则需要在onRemove()中完成，需要注意mapbox的事件绑定与js类似，使用es6匿名函数不能实现响应函数的解绑，因此需要通过bind来解决this丢失的问题。

```js
this._resize = this._resize.bind(this);
this.map.on("resize", this._resize);
```

render函数会在地图每一次进行渲染时（地图参数发生变化时）调用，因此其中只应该包含渲染部分代码，即Renderer.render()及相关方法。map.triggerRepaint()方法可以触发地图重新调用render函数，因此通过在render函数中调用该方法即可实现requestAnimateFrame的动画效果，但是使用这种方法时需要注意，由于此时动画通过不断触发地图render方法而不是触发自身render来实现，由于整个map对象共享同一个render方法，当地图中存在一些渲染较为耗时的图层时，即使这一图层是静态的，也会因为其他图层对于render的调用而重新渲染，因此在这种情况下应该尽量避免使用triggerRepaint()。而相反的，当地图中只存在静态图层时，render函数并不会在地图参数没有发生变化时被调用，此时想要在修改某些图层选项之后期望地图重新渲染的话，就需要手动调用triggerRepaint()来刷新屏幕渲染。

### 相机同步

### Shader Chunk

参考实例：MeshLambertMaterial [VertexShader](https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderLib/meshlambert_vert.glsl.js) [FragmentShader](https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderLib/meshlambert_frag.glsl.js)

Threejs中准备了许多预设材质，这些材质实现了光照/阴影/纹理贴图等复杂的渲染算法，然而在使用自定义的ShaderMaterial材质时，这些渲染过程并不会自动执行，而是需要手动实现。为了尽量减少工作量，Threejs提供了一种代码块复用的方法，即通过在着色器代码中添加include语句，可以引用three.js内部实现的shader chunk来引入一些通用函数和渲染算法。这些chunk主要包括两类：
- 第一类chunk在着色器主函数之外引入，这些chunk中进行uniforms和varyings的声明，并定义通用或用于特定算法的函数，其命名格式为xxx_par_vertex/xxx_par_fragment/xxx；
- 另一类chunk在着色器的主函数内部引入，其内容是算法的计算代码块，根据作用不同，其输出可能是某些变量（chunk相当于中间件），也可能是着色器的gl_Position等输出属性，同时这些chunk中可能包含一些变量或函数，它们并不会在该chunk中声明，因此要使用这些chunk还需要在声明部分引入声明这些变量和函数的chunk或者手动在着色器中声明它们。

MeshLambertMaterial中引入的一些shader chunk：

```c
// 声明threejs计算使用的全局变量和通用计算函数
#include <common>
// 与uv相关的vertex uniform和varying
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
// 光照模型通用函数和变量
#include <lights_pars_begin>

// uv相关计算代码块
#include <uv_vertex>
#include <uv2_vertex>

// 法向量计算相关代码块，需要normal
#include <beginnormal_vertex>
#include <defaultnormal_vertex>

// 位置和矩阵变换代码块，需要position
#include <begin_vertex>
#include <project_vertex>

// lambert光照计算代码块，需要vLightFront等变量
#include <lights_lambert_vertex>
```

引入计算chunk并使用一些通用chunk代替原有的代码之后，得到的着色器代码会显著缩短（并且十分缺乏可读性），以实现一个通过lambert模型接受光照的材质为例，其着色器的简化实现代码如下：

```c
// vertex shader
precision mediump float;

// 声明<lights_lambert_vertex>中需要的变量
varying vec3 vLightFront;
varying vec3 vIndirectFront;

#ifdef DOUBLE_SIDED
varying vec3 vLightBack;
varying vec3 vIndirectBack;
#endif

// 引入计算需要的通用声明代码块
#include <common>
#include <bsdfs>
#include <lights_pars_begin>

// 声明自定义着色器需要的变量
varying vec2 v_tex_pos;

void main() {
  // position和normal attribute的声明在render过程中自动添加，只需要通过bufferAttribute传递
  v_tex_pos = position.xy;

  // <project_vertex>中将transformed变量应用modelViewMatrix和projectionMatrix变换并输出到gl_Position
  vec3 transformed = vec3(position.xy, 0.5);

  // 两个法向量相关chunk将normal变量应用normalMatrix变换
	#include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <project_vertex>
  // lambert模型光照计算代码，需要上文中声明的相关变量以及normal attribute
	#include <lights_lambert_vertex>
}

// fragment shader
precision mediump float;

#include <common>
#include <packing>
#include <bsdfs>
#include <lights_pars_begin>

varying vec3 vLightFront;
varying vec3 vIndirectFront;

#ifdef DOUBLE_SIDED
varying vec3 vLightBack;
varying vec3 vIndirectBack;
#endif

uniform vec3 emissive;

// 自定义变量
uniform smapler2D u_tex;
varying vec2 v_tex_pos;

void main() {
  // 计算片元原本颜色并保存到diffuseColor变量，opacity为预设uniform，通过material.opacity设置
  // 以下声明的变量均用于chunk中的光照计算
  vec4 diffuseColor = vec4(texture2D(u_tex, v_tex_pos).rgb, opacity);

  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;

  #ifdef DOUBLE_SIDED
  reflectedLight.indirectDiffuse += (gl_FrontFacing) ? vIndirectFront : vIndirectBack;
	#else
  reflectedLight.indirectDiffuse += vIndirectFront;
	#endif
  reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert(diffuseColor.rgb);
	#ifdef DOUBLE_SIDED
  reflectedLight.directDiffuse = (gl_FrontFacing) ? vLightFront : vLightBack;
	#else
  reflectedLight.directDiffuse = vLightFront;
	#endif
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
}
```

另外，在使用这些shader chunk计算代码块中的一些代码时，还可能存在着一些未在par chunk中声明的uniforms，这些uniforms的声明都位于THREE.UnifromsLib中，只有为着色器指定了特定属性并通过THREE.UniformsUtils将这些uniform引入shaderMaterial才能在着色器中进行使用，例如要开启自定义的shaderMaterial的光照相关uniforms：
```js
const customShaderMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["lights"],
        {...},
      ]),
      vertexShader: customVert,
      fragmentShader: customFrag,
      lights: true,
      ...
    });
```

