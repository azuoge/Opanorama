export default class Toucher {
    constructor(config) {
        this.config = Object.assign({
            radius: 50,
            container: document.body,
            onStart() {
            },
            onMove() {
            },
            onEnd() {
            },
            onChange() {
            }
        }, config);
        this.lat = this.lon = 0;
        this.lastX = this.lastY = 0;
        this.lastDistance = 0;
        this.startX = this.startY = 0;
        this.speed = {lat: 0, lon: 0};
        this.deceleration = 0.5;
        this.factor = 50 / this.config.radius;
        this.bind();
    }

    bind() {
        const {container} = this.config;
        container.addEventListener('touchstart', this._bindStart = this._onStart.bind(this));
        container.addEventListener('touchmove', this._bindMove = this._onMove.bind(this));
        container.addEventListener('touchend', this._bindEnd = this._onEnd.bind(this));

    }

    unbind() {
        const {container} = this.config;
        container.removeEventListener('touchstart', this._bindStart);
        container.removeEventListener('touchmove', this._bindMove);
        container.removeEventListener('touchend', this._bindEnd);
    }

    _onStart(event) {
        const evt = event.changedTouches[0];
        this.startX = this.lastX = evt.clientX;
        this.startY = this.lastY = evt.clientY;
        this.startTime = Date.now();
        this.config.onStart(event);
        this.speed = {lat: 0, lon: 0};
        this.lastDistance = undefined;
    }

    _onMove(event) {
        event.preventDefault();
        const evt = event.changedTouches[0];
        switch (event.changedTouches.length) {
            case 1 :
                if (!this.lastDistance) {
                    this.lon += (this.lastX - evt.clientX) * this.factor;
                    this.lat += (evt.clientY - this.lastY) * this.factor;

                    this.lastX = evt.clientX;
                    this.lastY = evt.clientY;

                    this.config.onChange({
                        lat: this.lat,
                        lon: this.lon
                    });
                }
                break;
            case 2:
                const evt1 = event.changedTouches[1];
                let distance = Math.abs(evt.clientX - evt1.clientX) + Math.abs(evt.clientY - evt1.clientY);
                if (this.lastDistance === undefined) {
                    this.lastDistance = distance;
                }
                let scale = distance / this.lastDistance;

                if (scale) {
                    this.config.onChange({scale});
                    this.lastDistance = distance;
                }
        }
        this.config.onMove(event);
    }

    _onEnd(event) {
        //惯性
        let t = (Date.now() - this.startTime) / 10;
        this.speed = {
            lat: (this.startY - this.lastY) / t,
            lon: (this.startX - this.lastX) / t
        };

        this._inertance();
        this.config.onEnd(event);
    }

    _subSpeed(speed) {
        if (speed !== 0) {
            if (speed > 0) {
                speed -= this.deceleration;
                speed < 0 && (speed = 0);
            } else {
                speed += this.deceleration;
                speed > 0 && (speed = 0);
            }
        }
        return speed;
    }

    _inertance() {
        const speed = this.speed;
        speed.lat = this._subSpeed(speed.lat);
        speed.lon = this._subSpeed(speed.lon);

        this.lat -= speed.lat;
        this.lon += speed.lon;


        this.config.onChange({
            isUserInteracting: false,
            speed,
            lat: this.lat,
            lon: this.lon
        });

        if (speed.lat === 0 && speed.lon === 0) {
            this._intFrame && cancelAnimationFrame(this._intFrame);
            this._intFrame = 0;
        } else {
            this._intFrame = requestAnimationFrame(this._inertance.bind(this));
        }
    }
}