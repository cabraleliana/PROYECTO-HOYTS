const Sql = require('../db_SQL')
const config = require('../config/config').config



const verificarLogin = async (req, res) => {
    try {
        const query = `select * from usuarios where email='${req.query.email}' and contraseña='${req.query.password}' and eliminado=0`
        const db = new Sql(config)
        const result = await db.ejecutar(query)

        console.log("el resultado de la consulta es" , result)

        if (result.length > 0) {

            res.status(200).json({ status: 1, message: 'Usuario correcto', id: result[0].id })

        } else {

            res.status(401).json({ status: -1, message: 'Usuario incorrecto' })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Se produjo error interno' })
    }
}

const registrarse = async (req, res) => {



    try {
        let query = `select * from usuarios where email='${req.body.email}' and contraseña='${req.body.password}' and eliminado=0`
        let db = new Sql(config)
        let result = await db.ejecutar(query)

        if (result.length > 0) {
            res.status(200).json({ status: 0, message: 'Ya existe un usuario con el email ingresado' })
        } else {

            query = `INSERT INTO usuarios (nombre, apellido, email, contraseña,fecha_nacimiento,genero,celular,complejo_habitual) VALUES ('${req.body.nombre}', '${req.body.apellido}', '${req.body.email}', '${req.body.contraseña}','${req.body.fecha_nacimiento}','${req.body.genero}','${req.body.celular}','${req.body.complejo_habitual}')`

            result = await db.ejecutar(query)


            res.status(200).json({ status: 1, message: 'Usuario registrado correctamente', id: result})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}




const get_all_users = async (req, res) => {



    try {
        let query = `select * from usuarios where eliminado=0`
        let db = new Sql(config)
        let result = await db.ejecutar(query)

        let query_count = `select count(*) as cant from usuarios where eliminado=0` //count(*) me trae la cantidad de registros de esa tabla
        db = new Sql(config)
        let result_count = await db.ejecutar(query_count)

        let datos = {
            "draw": 1,
            "recordsTotal": result_count[0].cant, //las consultas siempre devulven arrays , al menos estas
            "recordsFiltered": result_count[0].cant,
            "data": result
          }


        res.status(200).json(datos) //porque no lo manda en formato json?

        } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })

    }
}


const get_user_by_id = async (req, res) => {



    try {
        let id=req.params.id
        let query = `select * from usuarios where id=${id}`
        let db = new Sql(config)
        let results = await db.ejecutar(query)

        res.render('pages/formulario_usuarios',{data: results} )

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })

    }
}

const delete_user = async (req, res) => {

    try {

        let id=req.params.id
        let query = `Delete from usuarios where id=${id}`
        const db = new Sql(config)
        let results = await db.ejecutar(query)
    
         res.status(200).json({ status: 1, message: 'Usuario eliminado exitosamente', results }) //el status devuelve un objeto al front
    

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}

const add_user = async (req, res) => {
   
    try {

        let query = `INSERT INTO usuarios (nombre, email, apellido, celular, complejo_habitual, genero,eliminado) VALUES ('${req.body.nombre}', '${req.body.email}','${req.body.apellido}','${req.body.celular}','${req.body.complejo_habitual}','${req.body.genero}',0) ; select scope_identity() as id`
        console.log(query)
        const db = new Sql(config)
        let results = await db.ejecutar(query)
        console.log(results)
    
        res.status(200).json({ status: 1, message: 'Usuario insertado exitosamente', id:results[0].id }) //el status devuelve un objeto al front
    

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}


const modify_user = async (req, res) => {


   
    try {

        let query = `update usuarios set email='${req.body.email}', nombre='${req.body.nombre}', apellido='${req.body.apellido}', genero='${req.body.genero}',celular='${req.body.celular}', complejo_habitual='${req.body.complejo_habitual}' where id=${req.params.id} `

        console.log(query)
        const db = new Sql(config)
        let results = await db.ejecutar(query)
        console.log(results)

    
        res.status(200).json({ status: 1, message: 'Usuario actualizado exitosamente' }) //el status devuelve un objeto al front , saque el results porque no necesito devolver nada
    

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}


module.exports = {
    verificarLogin,
    registrarse,
    get_all_users,
    get_user_by_id,
    delete_user,
    add_user,
    modify_user
};