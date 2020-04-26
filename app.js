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
var cursoRoutes = require('./routes/cursos');
var profesorRoutes = require('./routes/profesor');
var busquedadRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imgRoutes = require('./routes/img');

mongose.connection.openUri('mongodb://localhost:27017/siesaDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[31m%s\x1b[0m', 'online');
});

///Server Index Congig
//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'));
//app.use('/uploads', serveIndex(__dirname + '/uploads'));

//Rutas

app.use('/usuario', usuarioRoutes);
app.use('/curso', cursoRoutes);
app.use('/profesor', profesorRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedadRoutes);
app.use('/upload', uploadRoutes);
app.use('/file', imgRoutes);



app.use('/', appRoutes);


//Escuchar Expres
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[31m%s\x1b[0m', 'online');
});