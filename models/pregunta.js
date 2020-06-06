//Including Mongoose model...
const mongoose = require('mongoose');

//creating object 
const Schema = mongoose.Schema;

const PreguntaSchema = new Schema({
    question: { type: String },
    optionA: { type: String },
    optionB: { type: String },
    optionC: { type: String },
    optionD: { type: String },
    answer: { type: Number }
});

module.exports = mongoose.model('Pregunta', PreguntaSchema);