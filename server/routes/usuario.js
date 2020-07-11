const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

app.get('/', function (req, res) {
  res.send('OSCAR JIMÉNEZ - PRUEBA 2 - REST FULL VENTA DE IMPRESORAS')
})

app.get('/impresora', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({ estado: true }, 'marca modelo serie color ip contador precio')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    numero: conteo
                });
            });
        })
});

app.post('/impresora', (req, res) => {

    let body = req.body

    let usuario = new Usuario({
        marca: body.marca,
        modelo: body.modelo,
        serie: body.serie,
        color: body.color,
        ip: body.ip,
        contador: body.contador,
        precio: body.precio
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/impresora/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['marca', 'modelo', 'serie', 'color', 'ip', 'contador', 'precio']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });
});

app.delete('/impresora/:id', (req, res) => {

    let id = req.params.id;
    // Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {
    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true, context: 'query' }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            res.json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioBD
            });
        }
    });
});



module.exports = app;
