Opanorama.js 基于Threejs，同时支持手势和陀螺仪的web全景JS库。

```html
<script src="https://threejs.org/build/three.js"></script>
<script src="/dist/panorama.js"></script>
```


```js
const panorama = new Panorama({
    url: '',                    //全景图片
    container: document.body,   //容器
    radius: 500,                //球体半径
    fov: 90,                    //相机视角，可用于放大和缩小图片
    offsetLongitude: 0,         //经度偏移量，可用于默认展示图片位置
    offsetLatitude: 0,          //纬度偏移量，可用于默认展示图片位置
    supportTouch: true,         //是否支持手指滑动
    supportOrient: true         //是否支持陀螺仪
});
```
