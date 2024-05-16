const express = require('express')
const router = express.Router()
const peliculas = require('../controllers/movies')



router.get('/all_movies', peliculas.all_movies)
router.get('/select_movies', peliculas.select_movies)
router.get('/peliculas', peliculas.traer_peliculas_formulario)
router.get('/select_movie_by_cine/:id', peliculas.select_movie_by_cine)
router.post('/', peliculas.add_movie)
router.get('/:id', peliculas.get_movie_by_id)
router.delete('/:id', peliculas.delete_movie)
router.put('/:id', peliculas.modify_movie)


module.exports = (app) => {
    app.use('/movies', router)//agrego las rutas de user al app del servidor
    //movie es la entrada a las diferentes peticiones de peliculas.
}