var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');


app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathNoImage);
    }


});

module.exports = app;