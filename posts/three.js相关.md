---
title: three.js相关原理
date: '2021-04-20 12:56:00'
tags: 
- 

category: Development
image:
---

## 原理

- scene 创建场景
- camera 创建相机
- geometry（attribution）与material（uniform）创建mesh，并添加进scene中
- scene和camera生成render对象对场景进行渲染
- 通过requestAnimationFrame()实现实时渲染和动画

### 顶点着色器处理流程

```js
gl_Position = position * modelMatrix * viewMatrix * projectionMatrix;       
```

- mesh中声明的对象的坐标是对象自身的局部坐标Vertex.position，其作用在于创建自身的结构。
- 首先通过变换矩阵Object._modelMatrix（旋转/平移/缩放）将局部坐标转换为世界坐标世界坐标。
- 利用相机对象所对应的相机参数得到的视图变换矩阵Camera._viewMatrix生成视图坐标。
- 最后通过投影变换矩阵projectionMatrix得到屏幕坐标。

### 片元着色器处理流程

```js
gl_FragColor = vec4(color.rgb * LightColor * directional, color.a);
```

- MeshBasicMaterial({color: '0xff0000'})
- 材质颜色 Material.color
- 灯光 Light.color
- 雾化 Scene.fog.color

## 更新对象

- BufferGeometry 关于更新BufferGeometries，最重要的是理解你不能调整 buffers 大小，这种操作开销很大，相当于创建了个新的geometry，但可以更新 buffers的内容。因此当buffergeometry会增长的情况下，必须预先分配足够大的buffer，通过setDrawRange并设置needUpdate来实现对象的更新。
- Materials 所有uniforms值都可以自由改变（比如 colors, textures, opacity 等等），这些数值在每帧都发给shader。但是uniform的数量和类型的改变会导致shader程序重新生成，需要设置needUpdate，但是会导致非常缓慢的渲染。
- Textures 设置texture.needsUpdate为true则可以使渲染对象自动更新。
- Cameras 相机的位置和目标会自动更新，手动改变相机参数需要重新计算投影矩阵

```js
const MAX_POINTS = 500;
// geometry
const geometry = new THREE.BufferGeometry();
// attributes
const positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
// draw range
const drawCount = 2; // draw the first 2 points, only
geometry.setDrawRange( 0, drawCount );
// material
const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// line
const line = new THREE.Line( geometry,  material );
scene.add( line );
const positions = line.geometry.attributes.position.array;
let x, y, z, index;
x = y = z = index = 0;
for ( let i = 0, l = MAX_POINTS; i < l; i ++ ) {
    positions[ index ++ ] = x;
    positions[ index ++ ] = y;
    positions[ index ++ ] = z;
    x += ( Math.random() - 0.5 ) * 30;
    y += ( Math.random() - 0.5 ) * 30;
    z += ( Math.random() - 0.5 ) * 30;
}
line.geometry.setDrawRange( 0, newValue );
// 需要加在第一次渲染之后
line.geometry.attributes.position.needsUpdate = true; 
```

```js
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
```

## 对象删除

每当Three.js创建js实例时就会分配一定的内存，并且俄日特定的对象创建WebGL相关实体，如渲染所必须的buffer和shader program。js对象的内存会被javascript垃圾处理机制回收，但是webGL相关实体不会被自动释放，必须调用相关API才能释放这些资源。
- Geometry通过attribution的集合来表示顶点信息，three.js为每个属性创建一个WebGLBuffer类型的对象，调用BufferGeometry.dispose()删除。
- three.js通过Material定义的信息（uniform）构造着色器程序，因此着色器程序只有在Material被删除后才能被删除，需要调用Material.dispose()。
- Texture实例的创建会创建一个WebGLTexture实例，其独立于着色程序，通过Texture.dispose()删除。
- WebGLRenderTarget类型对象不仅分配了WebGLTexture的实例，还分配了WebGLFramebuffer和WebGLRenderbuffer来实现自定义渲染目标。这些对象仅能通过执行WebGLRenderTarget.dispose()来解除分配。

## 后期处理

three.js通过EffectComposer来将后期效果合成到渲染目标上：

```js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

// 在使用合成器时，我们需要对应用程序的动画循环进行更改。 
//现在我们不再调用WebGLRenderer的render方法，而是使用EffectComposer中对应的render方法。
const composer = new EffectComposer( renderer );
function animate() {

	requestAnimationFrame( animate );

	composer.render();

}

// 这些过程负责创建应用程序的最终视觉输出
// 它们按照添加/插入的顺序来进行处理
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

const glitchPass = new GlitchPass();
composer.addPass( glitchPass );
```

## 矩阵变换

Three.js使用matrix编码3D变换——平移（位置），旋转和缩放。Object3D的每个实例都有一个matrix，用于存储该对象的位置，旋转和比例。

修改对象的position，quaternion和scale属性，让three.js重新计算来自这些属性的对象矩阵：
```js
// Three.js提供了两种表示3D旋转的方式：Euler angles（欧拉角）和Quaternions（四元数）
object.position.copy( start_position );
object.quaternion.copy( quaternion );
```

直接修改对象的矩阵。 Matrix4类有各种修改矩阵的方法：

```js
object.matrix.setRotationFromQuaternion( quaternion );
object.matrix.setPosition( start_position );
```

默认情况下，matrixAutoUpdate属性设置为true，并且将自动重新计算矩阵。如果对象是静态的，或者希望在重新计算时手动控制，则可以通过将属性设置为false来获得更好的性能，在更改属性之后手动更新矩阵：

```js
object.matrixAutoUpdate = false;
object.updateMatrix();
```

ps：一个对象的matrix存储了该对象 相对于 其Object3D.parent（父节点）的变换。要在 世界 坐标系中获取对象的转换，您必须访问该对象的Object3D.matrixWorld。