const mongoose = require('mongoose');

const dbConection = async () => {
    try {
        await mongoose.connect('mongodb+srv://Xavier:3107635251@cluster0.ladrt.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Base de Datos: \x1b[31m%s\x1b[0m', 'online')

    }catch(error){
        console.log(error);
        throw new Error('Erro a la hora de iniciar la BD ver Logs');
    }
}

module.exports = {
    dbConection
}