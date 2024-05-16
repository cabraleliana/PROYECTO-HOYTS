const express = require('express')
const router = express.Router()
const cines = require('../controllers/cines')



router.get('/select_cines', cines.select_cines)



module.exports = (app) => {
    app.use('/cines', router)//agrego las rutas de user al app del servidor
    //movie es la entrada a las diferentes peticiones de peliculas.
}