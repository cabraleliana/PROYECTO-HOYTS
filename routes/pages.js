const express=require('express')
const router=express.Router()//Sirve para declarar rutas



router.get('/', (req, res) => {
    try {
        res.render('pages/index')
    } catch (error) {
        console.log(error)
    }

})


router.get('/login', (req, res) => {
    try {
        res.render('pages/login')
    } catch (error) {
        console.log(error)
    }

})

router.get('/registrarse', (req, res) => {
    try {
        res.render('pages/registrarse')
    } catch (error) {
        console.log(error)
    }

})

router.get('/administracion_usuarios', (req, res) => {
    try {
        res.render('pages/administracion_usuarios')
    } catch (error) {
        console.log(error)
    }

})


router.get('/administracion_peliculas', (req, res) => {
    try {
        res.render('pages/administracion_peliculas')
    } catch (error) {
        console.log(error)
    }

})



router.get('/administracion_funciones', (req, res) => {
    try {
        res.render('pages/administracion_funciones')
    } catch (error) {
        console.log(error)
    }

})



router.get('/administracion_salas', (req, res) => {
    try {
        res.render('pages/administracion_salas')
    } catch (error) {
        console.log(error)
    }

})



module.exports = (app)=>{
    app.use('/',router);
};
