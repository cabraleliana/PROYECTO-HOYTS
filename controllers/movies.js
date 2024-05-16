const Sql = require('../db_SQL')
const config = require('../config/config').config


const all_movies = async (req, res) => {

    try {

        let query = 'Select nombre , url_imagen from peliculas'

        
        const db = new Sql(config)
        let results = await db.ejecutar(query) //aca se conecta a la base y me trae los resultados que necesito


        res.render('pages/peliculas',{data: results} )

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

};



const select_movies = async (req, res) => {

    try {

        let query_movies = 'Select id, nombre from peliculas'


        const db = new Sql(config)
        let results_movies = await db.ejecutar(query_movies) //aca se conecta a la base y me trae los resultados que necesito

        opcionesGeneradas=""

        results_movies.forEach((opcion) => {
            opcionesGeneradas += `<option value="${opcion.id}">${opcion.nombre}</option>`;
          }); //este for each genera opciones para inyectarlas en el select del front

          
        res.status(200).send(opcionesGeneradas)

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

};


const get_movie_by_id = async (req,res) => {

    try {

        let query = `Select * from peliculas where id=${req.params.id}`

        
        const db = new Sql(config)
        let results = await db.ejecutar(query) //aca se conecta a la base y me trae los resultados que necesito


        res.render('pages/formulario_peliculas',{data: results} )

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}

const traer_peliculas_formulario = async (req, res) => {

    try {

        console.log("estoy por consultar a la base")

        let query = 'Select * from peliculas'

        
        let db = new Sql(config)
        let results = await db.ejecutar(query) //aca se conecta a la base y me trae los resultados que necesito
        console.log(results)


        let query_count = `select count(*) as cant from peliculas where eliminado=0` //count(*) me trae la cantidad de registros de esa tabla
        db = new Sql(config)
        let result_count = await db.ejecutar(query_count)

        let datos = {
            "draw": 1,
            "recordsTotal": result_count[0].cant, //las consultas siempre devulven arrays , al menos estas
            "recordsFiltered": result_count[0].cant,
            "data": results
          }

          console.log(datos)


        res.status(200).json(datos) 

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

};



const delete_movie = async (req, res) => {

    try {

        let id=req.params.id
        let query = `Delete from peliculas where id=${id}`
        const db = new Sql(config)
        let results = await db.ejecutar(query)
    
         res.status(200).json({ status: 1, message: 'Pelicula eliminado exitosamente', results }) //el status devuelve un objeto al front
    

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}

const add_movie = async (req, res) => {
   
    try {

        let query = `INSERT INTO movies (nombre,eliminado) VALUES ('${req.body.nombre}',0) ; select scope_identity() as id`
        console.log(query)
        const db = new Sql(config)
        let results = await db.ejecutar(query)
        console.log(results)
    
        res.status(200).json({ status: 1, message: 'Pelicula insertada exitosamente', id:results[0].id }) //el status devuelve un objeto al front
    

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }a

}


const modify_movie = async (req, res) => {


   
    try {

        let query = `update peliculas set nombre='${req.body.nombre}' where id=${req.params.id} `

        console.log(query)
        const db = new Sql(config)
        let results = await db.ejecutar(query)
        console.log(results)

    
        res.status(200).json({ status: 1, message: 'Pelicula actualizada exitosamente' }) //el status devuelve un objeto al front , saque el results porque no necesito devolver nada
    

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}


const select_movie_by_cine = async (req, res) => {

    try {

        let query = `select p.id, p.nombre 
        from peliculas as p
        inner join Cine_peliculas as cp on cp.id_pelicula = p.id
        where  cp.id_cine = ${req.params.id}`

        
        const db = new Sql(config)
        let results = await db.ejecutar(query) //aca se conecta a la base y me trae los resultados que necesito


        opcionesGeneradas=""

        results.forEach((opcion) => {
            opcionesGeneradas += `<option value="${opcion.id}">${opcion.nombre}</option>`;
            
          }); //este for each genera opciones para inyectarlas en el select del front . Mejor procesarlo en el back ya que se procesa todo en el servidor (mas rapido) y no del lado del cliente ( en caso que tengan maquina lenta )

          
        res.status(200).send(opcionesGeneradas)


    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

};








module.exports = {
    all_movies,
    select_movies,
    get_movie_by_id,
    traer_peliculas_formulario,
    delete_movie,
    add_movie,
    modify_movie,
    select_movie_by_cine
};