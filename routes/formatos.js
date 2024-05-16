const express = require('express')
const router = express.Router()
const formatos = require('../controllers/formatos')



router.get('/select_formatos', formatos.select_formatos)



module.exports = (app) => {
    app.use('/formatos', router)//agrego las rutas de user al app del servidor
    //movie es la entrada a las diferentes peticiones de peliculas.
}