const express = require('express')
const router = express.Router()
const login = require('../controllers/usuarios')



router.get('/verificar_login', login.verificarLogin)
router.post('/sign_in', login.registrarse)

module.exports = (app) => {
    app.use('/login', router)//agrego las rutas de user al app del servidor
}