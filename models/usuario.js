var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var roleValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'PROF_ROLE'],
    message: '{VALUE} no es un rol valido'
};

var usuarioShema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: false, default: 'USER_ROLE', enum: roleValidos },
});

usuarioShema.plugin(uniqueValidator, { message: '{PATH} debe ser Unico' });
module.exports = mongoose.model('Usuario', usuarioShema);