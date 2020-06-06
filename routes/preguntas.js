var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Pregunta = require('../models/pregunta');


//===================================
//Editar Pregunta a Examen Creadro
//====================================
app.put('/editQuestion/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Pregunta.findById(id, (err, pregunta) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar curso',
                errors: err
            });
        }
        if (!pregunta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El curso con el id::>' + id + " no existe",
                errors: { message: 'No exite el usuario con ese ID' }
            });
        }

        pregunta.question = req.body.question;
        pregunta.optionA = req.body.optionA;
        pregunta.optionB = req.body.optionB;
        pregunta.optionC = req.body.optionC;
        pregunta.optionD = req.body.optionD;
        pregunta.answer = req.body.answer;

        pregunta.save((err, prGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar el  curso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pregunta: prGuardado
            });
        });
    });



});

/// ===========================================
// get Pregunta
//==================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Pregunta.find({})
        .skip(desde)
        .limit(1)
        .exec((err, preguntas) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Cargando Cursos',
                    errors: err
                });
            }
            Pregunta.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    preguntas: preguntas,
                    total: conteo
                });
            });
        });
});



module.exports = app;