var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cursosShema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, require: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collation: 'cursos' });


module.exports = mongoose.model('Curso', cursosShema);