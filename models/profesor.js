var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var profesorSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre  es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.Object, ref: 'Usuario', required: false },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        required: [true, 'El id del Curso es necesario']
    }

});

module.exports = mongoose.model('Profesor', profesorSchema);