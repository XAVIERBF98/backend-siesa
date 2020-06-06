var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Quiz = require('../models/quiz');
var Pregunta = require('../models/pregunta');




//===========================
// Actualizar Datos
//==============================
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Quiz.findById(id, (err, quiz) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar curso',
                errors: err
            });
        }
        if (!quiz) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El quiz con el id::>' + id + " no existe",
                errors: { message: 'No exite el usuario con ese ID' }
            });
        }

        quiz.titulo = body.titulo;
        quiz.descripcion = body.descripcion;
        quiz.tiempo = body.tiempo;
        quiz.instrucciones = body.instrucciones;

        quiz.save((err, quizGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar el  curso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                quiz: quizGuardado
            });
        });
    });


});








//===================================
//Crear Nuevo Quiz
//====================================
app.post('/', (req, res) => {
    var body = req.body;
    var quiz = new Quiz({
        titulo: body.titulo,
        descripcion: body.descripcion,
        tiempo: body.tiempo,
        instrucciones: body.instrucciones,
    });

    quiz.save((err, quizGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al quiz usuario',
                errors: err
            });
        }
        console.log(quizGuardado);
        res.status(201).json({
            ok: true,
            quiz: quizGuardado,

        });
    });


});


/// ===========================================
// Inicio Obtener Todos los Quizes
//==================================
app.get('/All', (req, res, next) => {
    Quiz.find({})

    .exec((err, quizes) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error Cargando Quizes',
                errors: err
            });
        }
        Quiz.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                quizes: quizes,
                total: conteo
            });
        });
    });
});

/// ===========================================
// Inicio Obtener Todos los Cursos Paginados
//==================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Quiz.find({})
        .skip(desde)
        .limit(5)
        .exec((err, quizes) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Cargando Quizes',
                    errors: err
                });
            }
            Quiz.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    quizes: quizes,
                    total: conteo
                });
            });
        });
});

// ==========================================
// Obtener Quiz por Id
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Quiz.findById(id)
        .exec((err, quiz) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar quiz',
                    errors: err
                });
            }
            if (!quiz) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El quiz con el id ' + id + 'no existe ',
                    errors: {
                        message: 'No existe un quiz con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                quiz: quiz
            });
        });
});
//===================================
//Añadir Pregunta a Examen Creadro
//====================================
app.post('/:id/addQuestion', (req, res) => {
    var body = req.body;
    var pregunta = new Pregunta({
        question: body.question,
        optionA: body.optionA,
        optionB: body.optionB,
        optionC: body.optionC,
        optionD: body.optionD,
        answer: body.answer
    });
    pregunta.save();
    Quiz.findByIdAndUpdate({ '_id': req.params.id }, {
            '$push': {
                preguntas: pregunta
            }
        })
        .exec((err, quizActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar quiz',
                    errors: err
                });
            }
            if (!quizActualizado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El quiz con el id ' + id + 'no existe ',
                    errors: {
                        message: 'No existe un quiz con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                quiz: quizActualizado
            });
        });

});

//===================================
//Eliminar Pregunta a Examen Creadro
//====================================
app.post('/:id/deleteQuestion/:qid', (req, res) => {
    var body = req.body;
    Pregunta.findByIdAndRemove({ '_id': req.params.qid });
    Quiz.findByIdAndUpdate({ '_id': req.params.id }, {
            '$pull': {
                'preguntas': {
                    _id: req.params.qid
                }
            }
        })
        .exec((err, quizActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar quiz',
                    errors: err
                });
            }
            if (!quizActualizado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El quiz con el id ' + id + 'no existe ',
                    errors: {
                        message: 'No existe un quiz con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                quiz: quizActualizado
            });
        });
});


// API to edit question
app.put('/editQuestionTest/:qid', (req, res) => {
    Quiz.findOneAndUpdate({
        "preguntas._id": req.params.qid
    }, {
        "$set": {
            "questions.$.question": req.body.question,
            "questions.$.optionA": req.body.optionA,
            "questions.$.optionB": req.body.optionB,
            "questions.$.optionC": req.body.optionC,
            "questions.$.optionD": req.body.optionD,
            "questions.$.answer": req.body.answer
        }
    }).exec((err, quizActualizado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar quiz',
                errors: err
            });
        }
        if (!quizActualizado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El quiz con el id ' + id + 'no existe ',
                errors: {
                    message: 'No existe un quiz con ese ID '
                }
            });
        }
        res.status(200).json({
            ok: true,
            quiz: quizActualizado
        });
    });
});




module.exports = app;