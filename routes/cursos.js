var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Curso = require('../models/curso');
/// ===========================================
// Inicio Obtener Todos los Cursos
//==================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Curso.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, cursos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Cargando Cursos',
                    errors: err
                });
            }
            Curso.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    cursos: cursos,
                    total: conteo
                });
            });
        });
});

//===========================
// Actualizar Datos
//==============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Curso.findById(id, (err, curso) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar curso',
                errors: err
            });
        }
        if (!curso) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El curso con el id::>' + id + " no existe",
                errors: { message: 'No exite el usuario con ese ID' }
            });
        }

        curso.nombre = body.nombre;
        curso.usuario = req.usuario._id;

        curso.save((err, cursoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar el  curso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                curso: cursoGuardado
            });
        });
    });


});

//===================================
//Crear Nuevo Curso
//====================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var curso = new Curso({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    curso.save((err, cursoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al curso usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            curso: cursoGuardado,

        });
    });


});
// ===================================
// Eliminar Curso por id
//=======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Curso.findByIdAndRemove(id, (err, cursoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el  curso',
                errors: err
            });
        }
        if (!cursoBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un curso con ese id',
                errors: { message: 'No existe un curso con es ID' }
            });
        }
        res.status(201).json({
            ok: true,
            curso: cursoBorrado
        });
    });
});


module.exports = app;