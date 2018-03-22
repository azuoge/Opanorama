[Opanorama.js](https://azuoge.github.io/Opanorama/) 基于Threejs，同时支持手势和陀螺仪的web全景JS库。


```html
<script src="https://threejs.org/build/three.js"></script>
<script src="/dist/Opanorama.js"></script>
```


```js
const panorama = new Opanorama({
    url: '',                    //全景图片
    container: document.body,   //容器
    radius: 500,                //球体半径，可不填
    fov: 90,                    //相机视角，可用于放大和缩小图片，可不填
    offsetLongitude: 0,         //经度偏移量，可用于默认展示图片位置，可不填
    offsetLatitude: 0,          //纬度偏移量，可用于默认展示图片位置，可不填
    supportTouch: true,         //是否支持手指滑动，可不填
    supportOrient: true         //是否支持陀螺仪，可不填
});
```

[代码示例](https://azuoge.github.io/Opanorama/) 