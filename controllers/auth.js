const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/generar-jwt')

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos - correo'
            });
        }

        // Verificar si el usuario está activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos - estado: false'
            });
        }

        // Varificar la constraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos - password'
            });
        }

        // General el JWT
        const token = await generarJWT(usuario.id);



        res.json({
           usuario,
           token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });

    }




    
}



module.exports = {
    login
}