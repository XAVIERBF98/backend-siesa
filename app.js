//Requires
var express = require('express');
var mongose = require('mongoose');
var bodyparser = require('body-parser');
//Inicializar Variables
var app = express();

//Body Parser
//parse aplicacion  /x--www-form -urlecoded
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


mongose.connection.openUri('mongodb://localhost:27017/siesaDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[31m%s\x1b[0m', 'online')
});
//Rutas

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//Escuchar Expres
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[31m%s\x1b[0m', 'online');
});