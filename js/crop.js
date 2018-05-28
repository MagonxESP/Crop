var coords = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
};

function crop() {
    this.img = new Image();
    this.initCrop = initCrop;
    this.applyCrop = applyCrop;
    this.mapValues = mapValues;
}

function updateCoords(c) {
    coords.x = Math.round(c.x);
    coords.y = c.y;
    coords.w = c.w;
    coords.h = c.h;
    console.log(coords);
}

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function initCrop(img) {
    var $crop = $('#crop');
    var reader = new FileReader();

    // arreglo para acceder a las propiedades y metodos del objeto
    // dentro de la funcion anonima del evento
    var self = this; 
    reader.onload = function(event) {
        $crop.attr('src', event.target.result);
        $crop.Jcrop({
            onSelect: updateCoords,
            onChange: updateCoords,
            aspectRatio: 1
        });
        // TODO guardar la imagen xDDD
        //self.img.width = $crop.outerWidth();
        //self.img.height = $crop.outerHeight();
        self.img.src = reader.result;
    };

    console.log(this.img);
    reader.readAsDataURL(img);
}

function mapValues() {
    var $crop = $('#crop');
    console.log($crop.outerWidth());
    console.log($crop.outerHeight());
    coords.x = map(coords.x, 0, $crop.outerWidth(), 0, this.img.width);
    coords.y = map(coords.y, 0, $crop.outerHeight(), 0, this.img.height);
    coords.w = map(coords.w, 0, $crop.outerWidth(), 0, this.img.width);
    coords.h = map(coords.h, 0, $crop.outerHeight(), 0, this.img.height);
}

function applyCrop() {
    var canvas = document.createElement('canvas');
    $('#canvas-container').html(canvas);
    this.mapValues();
    canvas.width = coords.w
    canvas.height = coords.h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this.img, coords.x, coords.y, coords.w, coords.h, 0, 0, canvas.width, canvas.height);
}

$(document).ready(function(){
    $('#input-file').on('change', function(event){
        var c = new crop();
        c.initCrop(event.target.files[0]);
        $('#aplicar-btn').on('click', function(){
            c.applyCrop();
        });
    });

    var c = new crop();
    c.initCrop();
    $('#aplicar-btn').on('click', function () {
        c.applyCrop();
    });
});