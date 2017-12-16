import Orienter from './orienter'
import Toucher from './toucher'

export default class Panorama {
    constructor(config) {
        this._config = Object.assign({
            url: '',                    //全景图片
            container: document.body,   //容器
            radius: 500,                //球体半径
            fov: 90,                    //相机视角，可用于放大和缩小图片
            offsetLongitude: 0,         //经度偏移量，可用于默认展示图片位置
            offsetLatitude: 0,          //纬度偏移量，可用于默认展示图片位置
            supportTouch: true,         //是否支持手指滑动
            supportOrient: true,        //是否支持陀螺仪
            onFrame(lon, lat) {
                return {lon, lat};
            }
        }, config);


        this._config.width = config.container.clientWidth;
        this._config.height = config.container.clientHeight;


        config = this._config;

        this._fix = {
            lat: config.offsetLatitude || 0,
            lon: config.offsetLongitude || 180,
            isFixed: config.offsetLatitude || config.offsetLongitude
        };

        this._touch = this._orient = {
            lat: 0,
            lon: 0
        };

        this._initStage();
        this.resize();
        this._animate();
        this._initControl();
    }


    update(config = {}) {
        this._config = Object.assign({}, this._config, config);

        if (config.width || config.height) {
            this.renderer.setSize(this._config.width, this._config.height);
            this.camera.aspect = this._config.width / this._config.height;
        }
        if (config.fov) {
            this.camera.fov = config.fov;
        }
        this.camera.updateProjectionMatrix();
        this.resize();
    }

    resize() {
        this.camera.lookAt(this.camera.target);
        this.renderer.render(this.scene, this.camera);
    }

    _initStage() {
        const {container, width, height, url, fov, radius} = this._config;
        this.camera = new THREE.PerspectiveCamera(fov, width / height, 1, 1100);
        this.camera.target = new THREE.Vector3(0, 0, 0);
        this.scene = new THREE.Scene();

        var geometry = new THREE.SphereBufferGeometry(radius, 60, 40);
        geometry.scale(-1, 1, 1);
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(url)
        });
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.canvas = this.renderer.domElement;
        container.appendChild(this.canvas);

        window.addEventListener('resize', this._bindResize = this._onResize.bind(this));
    }

    _onResize() {
        const {container} = this._config;
        this.update({
            width: container.clientWidth,
            height: container.clientHeight
        });
    }

    _initControl() {
        const self = this;
        const config = this._config;

        if (config.supportTouch) {
            let fov;
            this._toucher = new Toucher({
                container: config.container,
                radius: config.radius,
                onChange({lon, lat, scale}) {
                    if (scale) {
                        fov = self._config.fov / scale;
                        fov = Math.min(120, Math.max(fov, 60));
                        self.update({fov});
                    }

                    if (lon !== undefined && lat !== undefined) {
                        //超出范围，用fix来补
                        if (self._fix.lat + self._orient.lat + lat > 90) {
                            self._fix.lat = 90 - self._orient.lat - lat;
                        } else if (self._fix.lat + self._orient.lat + lat < -90) {
                            self._fix.lat = -90 - self._orient.lat - lat;
                        }
                        self._touch = {lon, lat};
                    }
                }
            });
        }

        if (config.supportOrient) {
            this._orienter = new Orienter({
                onChange({lat, lon}) {
                    const {_fix} = self;
                    if (!_fix.isFixed) {
                        self._fix = {
                            lat: _fix.lat - lat,
                            lon: _fix.lon - lon,
                            isFixed: true
                        };
                    }
                    if (Math.abs(self._orient.lat - lat) >= 90) {
                        return;
                    }
                    //超出范围，用fix来补
                    if (self._fix.lat + self._touch.lat + lat > 90) {
                        self._fix.lat = 90 - self._touch.lat - lat;
                    } else if (self._fix.lat + self._touch.lat + lat < -90) {
                        self._fix.lat = -90 - self._touch.lat - lat;
                    }

                    self._orient = {lat, lon};
                }
            })
        }

    }

    destroy() {
        this._toucher && this._toucher.unbind();
        this._orienter && this._orienter.destroy();
        this._bindResize && window.removeEventListener('resize', this._bindResize);
        cancelAnimationFrame(this._intFrame);
    }

    _animate() {
        const config = this._config;
        let lat = this._touch.lat + this._fix.lat + this._orient.lat;
        let lon = this._touch.lon + this._fix.lon + this._orient.lon;

        //外部传的经纬度
        let obj = config.onFrame(lon, lat);
        lon += (obj.lon || 0);
        lat += (obj.lat || 0);


        lat = Math.max(-89, Math.min(89, lat));

        lat = THREE.Math.degToRad(lat);
        lon = THREE.Math.degToRad(lon);

        this.camera.target.x = 500 * Math.cos(lat) * Math.cos(lon);
        this.camera.target.y = 500 * Math.sin(lat);
        this.camera.target.z = 500 * Math.cos(lat) * Math.sin(lon);

        this.resize();
        this._intFrame = requestAnimationFrame(this._animate.bind(this));
    }

}