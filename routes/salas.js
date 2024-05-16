const express = require('express')
const router = express.Router()
const salas = require('../controllers/salas')



router.get('/select_salas_by_formato', salas.select_salas_by_formato)



module.exports = (app) => {
    app.use('/salas', router)//agrego las rutas de user al app del servidor
    //movie es la entrada a las diferentes peticiones de peliculas.
}