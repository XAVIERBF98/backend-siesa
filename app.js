//Requires
var express = require('express');
var mongose = require('mongoose');

//Inicializar Variables
var app = express();

//Conexion

mongose.connection.openUri('mongodb://localhost:27017/siesaDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[31m%s\x1b[0m', 'online')
});
//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'peticion realiza correctamente'
    });

});


//Escuchar Expres
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[31m%s\x1b[0m', 'online');
});