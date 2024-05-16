const express = require('express')
const router = express.Router()
const horarios = require('../controllers/horarios')



router.get('/select_horarios', horarios.select_horarios)



module.exports = (app) => {
    app.use('/horarios', router)//agrego las rutas de user al app del servidor
    //movie es la entrada a las diferentes peticiones de peliculas.
}