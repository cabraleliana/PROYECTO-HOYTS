const express = require('express')
const router = express.Router()
const funciones = require('../controllers/funciones')



router.get('/datatable_funciones', funciones.todas_funciones)

router.post('/', funciones.agregar_funcion)

router.get('/cargar_fechas_por_pelicula_cine', funciones.cargar_fechas_por_pelicula_cine)

//como es por query no mando nada (porque estoy mandando id_cine y id_pelicula)


router.get('/cargar_salas_horarios_por_dia_pelicula', funciones.cargar_salas_horarios_por_dia_pelicula) 

router.get('/:id', funciones.get_funcion_by_id)

router.delete('/:id', funciones.delete_function)


router.put('/:id', funciones.modificar_function)





module.exports = (app) => {
    app.use('/funciones', router)//agrego las rutas de user al app del servidor
    //movie es la entrada a las diferentes peticiones de peliculas.
}