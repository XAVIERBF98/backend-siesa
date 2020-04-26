var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

//Modelos
var Usuario = require('../models/usuario');
var Profesor = require('../models/profesor');
var Curso = require('../models/curso');
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposColeccionValidos = ['cursos', 'profesores', 'usuarios'];
    if (tiposColeccionValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de Coleccion no es valida ',
            erros: {
                message: 'Tipos de Coleccion Validad' + tiposColeccionValidos.join(', ')
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada ',
            erros: { message: 'seleccion una Imagen o Pdf' }
        });
    }
    //Obtner nombre del Archivo 
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    // Solo esta extensiones se aceptan
    var extensionValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf'];
    if (extensionValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no Valida',
            erros: { message: 'Las extensiones son:' + extensionValidas.join(', ') }
        });
    }
    //Nombre del Archivo
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el Archivo del temporal al Path

    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Eror al Mover Archivo ',
                erros: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });


});
//===============
//Funcion por tipo Coleccion
//====================
function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }
            var pathAntiguo = './uploads/usuarios' + usuario.img;
            //Si exite elimina la imagen anterior
            if (fs.existsSync(pathAntiguo)) {
                fs.unlink(pathAntiguo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Usuario Actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo == 'cursos') {
        Curso.findById(id, (err, curso) => {
            if (!curso) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Curso no existe',
                    errors: { message: 'Curso no existe' }
                });
            }
            var pathAntiguo = './uploads/cursos' + curso.img;
            //Si exite elimina la imagen anterior
            if (fs.existsSync(pathAntiguo)) {
                fs.unlink(pathAntiguo);
            }

            curso.img = nombreArchivo;

            curso.save((err, cursoActualizado) => {

                cursoActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Usuario Actualizada',
                    curso: cursoActualizado
                });
            });
        });

    }
    if (tipo == 'profesores') {
        Profesor.findById(id, (err, profesor) => {
            if (!profesor) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }
            var pathAntiguo = './uploads/profesores' + profesor.img;
            //Si exite elimina la imagen anterior
            if (fs.existsSync(pathAntiguo)) {
                fs.unlink(pathAntiguo);
            }

            profesor.img = nombreArchivo;

            profesor.save((err, profesorActualizado) => {

                profesorActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Usuario Actualizada',
                    profesor: profesorActualizado
                });
            });
        });
    }

}


module.exports = app;