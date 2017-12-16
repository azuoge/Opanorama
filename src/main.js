import Panorama from './lib/panorama'

let longitude = 0,mark='add';
const panorama = new Panorama({
    fov: 120,
    supportOrient: false,
    url: '../res/1.jpg',
    container: document.querySelector('.panorama'),
    onFrame(lon, lat) {
        if(longitude ==360){
            mark = 'sub';
        }
        if(longitude === 0){
            mark = 'add';
        }

        switch(mark){
            case 'add':
                longitude += 0.05;
                break;
            case 'sub':
                longitude -= 0.05;
                break;    
        }
        return {lon: lon + longitude, lat}
    }
});