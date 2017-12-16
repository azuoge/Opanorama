export default class Orienter {
    constructor(config) {
        this._config = Object.assign({
            onChange() {
            },
            onOrient() {
            }
        }, config);

        this.lon = this.lat = 0;
        this.offsetMooth = 1;
        this.direction = window.orientation || 0;
        this.bind();
    }


    bind() {
        window.addEventListener('deviceorientation', this._bindChange = this._onChange.bind(this));
        window.addEventListener('orientationchange', this._bindOrient = this._onOrient.bind(this));
    }


    destroy() {
        window.removeEventListener('deviceorientation', this._bindChange, false);
        window.removeEventListener('orientationchange', this._bindOrient, false);
    }


    _onOrient(event) {
        this.direction = window.orientation;
        this._config.onOrient(event);
        this.lastLon = this.lastLat = undefined
    }

    _mooth(x, lx) { //插值为了平滑些
        if (lx === undefined) {
            return x;
        }
        if (Math.abs(x - lx) > this.offsetMooth) {
            if (x > lx) {
                x = lx + this.offsetMooth;
            } else {
                x = lx - this.offsetMooth;
            }
        } else {
            x = lx;
        }
        return x;
    }

    _onChange(evt) {
        switch (this.direction) {
            case 0 :
                this.lon = -(evt.alpha + evt.gamma);
                this.lat = evt.beta - 90;
                break;
            case 90:
                this.lon = evt.alpha - Math.abs(evt.beta);
                this.lat = evt.gamma < 0 ? -90 - evt.gamma : 90 - evt.gamma;
                break;
            case -90:
                this.lon = -(evt.alpha + Math.abs(evt.beta));
                this.lat = evt.gamma > 0 ? evt.gamma - 90 : 90 + evt.gamma;
                break;
        }

        this.lon = this.lon > 0 ? this.lon % 360 : this.lon % 360 + 360;

        if (this.lastLat === undefined) {
            this.lastLat = this.lat;
        }

        //lat变化跳动比较大，插值为了平滑些
        this.lastLat = this.lat = this._mooth(this.lat, this.lastLat);

        this._config.onChange({
            lon: this.lon,
            lat: this.lat
        });
    }
}
