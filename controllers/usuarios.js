const { response, request } = require('express');





const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get Api - controldor usuarios',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: 'post Api - controldor usuarios',
        nombre,
        edad
    })
}

const usuariosPut = (req, res = response) => {

    const { id }  = req.params;

    res.json({
        msg: 'put Api - controldor usuarios',
        id
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch Api - controldor usuarios'
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'get Api - controldor usuarios'
    })
}






module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}