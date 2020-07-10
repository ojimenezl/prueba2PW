const mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
    marca: {
        type: String,
        required: [true, 'La MARCA es requerida']
    },
    modelo: {
        type: String,
        required: [true, 'El MODELO es requerido']
    },
    serie: {
        type: Number,
        required: [true, 'El NUMERO DE SERIE es requerido']
    },
    color: {
        type: Boolean,
        default: false,
        required: false
    },
    ip: {
        type: String,
        required: [true, 'La IP es requerida']
    },
    estado: {
        type: Boolean,
        default: true
    },
    contador: {
        type: Number,
        default: 0
    },
    precio: {
        type: Number,
        required: [true, 'El precio es requerido']
    }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

module.exports = mongoose.model('impresoras', usuarioSchema);