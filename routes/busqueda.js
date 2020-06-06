var express = require('express');

var app = express();
var Curso = require('../models/curso');
var Profesor = require('../models/profesor');
var Usuario = require('../models/usuario');



// =====================================
//      Busquedad por Colección
// =====================================
app.get('/coleccion/:tabla/:busquedad', (req, res) => {

    var busquedad = req.params.busquedad;
    var tabla = req.params.tabla;
    var regex = new RegExp(busquedad, 'i');

    var promesa;



    switch (tabla) {
        case 'usuarios':
            promesa = busquedadUsuario(busquedad, regex);
            break;
        case 'profesores':
            promesa = busquedadProfesor(busquedad, regex);
            break;
        case 'cursos':
            promesa = busquedadCurso(busquedad, regex);
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'No se encuentra en los tipos de Busquedad',
                error: { message: 'Tipo de Coleccion/Tabla no valido' }

            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});


app.get('/todo/:busquedad', (req, res, next) => {
    var busquedad = req.params.busquedad;
    var regex = new RegExp(busquedad, 'i');

    Promise.all([busquedadCurso(busquedad, regex),
            busquedadProfesor(busquedad, regex),
            busquedadUsuario(busquedad, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                cursos: respuestas[0],
                profesores: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});

function busquedadCurso(busquedad, regex) {
    return new Promise((resolve, reject) => {
        Curso.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, cursos) => {
                if (err) {
                    reject('Error al cargar Cursos', err);
                } else {
                    resolve(cursos);
                }
            });
    });
}

function busquedadProfesor(busquedad, regex) {
    return new Promise((resolve, reject) => {
        Profesor.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('cursos')
            .exec((err, profesores) => {
                if (err) {
                    reject('Error al cargar Cursos', err);
                } else {
                    resolve(profesores);
                }
            });
    });
}

function busquedadUsuario(busquedad, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al Cargar Usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });

}


module.exports = app;