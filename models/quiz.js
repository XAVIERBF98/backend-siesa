var mongoose = require('mongoose');
var Schema = mongoose.Schema;
Pregunta = require('./pregunta'),
    PreguntaSchema = mongoose.model('Pregunta').schema;
var quizSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    tiempo: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    instrucciones: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    intentos: [],
    preguntas: [PreguntaSchema],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);