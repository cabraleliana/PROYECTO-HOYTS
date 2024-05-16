const express = require('express')
const router = express.Router()
const usuarios = require('../controllers/usuarios')



router.get('/get_all_users', usuarios.get_all_users)
router.get('/:id', usuarios.get_user_by_id)
router.put('/:id', usuarios.modify_user)
router.delete('/:id', usuarios.delete_user)
router.post('/', usuarios.add_user)

module.exports = (app) => {
    app.use('/user', router)//agrego las rutas de user al app del servidor
}