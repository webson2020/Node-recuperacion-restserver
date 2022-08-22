const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { DefaultTransporter } = require('google-auth-library');



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
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   
}

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;

    try{

        const { correo, nombre, img } = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({ correo });

        if(!usuario) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                rol: 'USER_ROLE',
                password: ':P',
                img,
                google: true,

            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado' 
            });
        }

        // General el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(400).json({
            msg: 'Token de google no es válido'
        })
    }
}



module.exports = {
    login,
    googleSignIn
}