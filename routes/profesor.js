var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Profesor = require('../models/profesor');
/// ===========================================
// Inicio Obtener Todos los Profesors
//==================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Profesor.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('curso')
        .exec((err, profesors) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Cargando Profesors',
                    errors: err
                });
            }
            Profesor.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    profesors: profesors,
                    total: conteo
                });
            });
        });
});
//===========================
// Obtener  Profesor
//==============================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Profesor.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('curso')
        .exec((err, profesor) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al Buscar profesor',
                    errors: err
                });
            }
            if (!profesor) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El profesor con el id::>' + id + " no existe",
                    errors: { message: 'No exite el usuario con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                profesor: profesor
            })

        });
});

//===========================
// Actualizar Datos
//==============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Profesor.findById(id, (err, profesor) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar profesor',
                errors: err
            });
        }
        if (!profesor) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El profesor con el id::>' + id + " no existe",
                errors: { message: 'No exite el usuario con ese ID' }
            });
        }

        profesor.nombre = body.nombre;
        profesor.usuario = req.usuario._id;
        profesor.curso = body.curso;

        profesor.save((err, profesorGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar el  profesor',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                profesor: profesorGuardado
            });
        });
    });


});

//===================================
//Crear Nuevo Profesor
//====================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var profesor = new Profesor({
        nombre: body.nombre,
        usuario: req.usuario._id,
        curso: body.curso
    });
    profesor.save((err, profesorGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al profesor usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            profesor: profesorGuardado,

        });
    });


});
// ===================================
// Eliminar Profesor por id
//=======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Profesor.findByIdAndRemove(id, (err, profesorBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el  profesor',
                errors: err
            });
        }
        if (!profesorBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un profesor con ese id',
                errors: { message: 'No existe un profesor con es ID' }
            });
        }
        res.status(201).json({
            ok: true,
            profesor: profesorBorrado
        });
    });
});


module.exports = app;