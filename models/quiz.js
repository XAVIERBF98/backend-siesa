var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var quizSchema = new Schema({
    titulo: {
        type: String
    },
    descripcion: {
        type: String
    },
    tiempo: {
        type: String
    },
    instrucciones: {
        type: String
    },
    intentos: [],
    preguntas: [QuestionSchema],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);