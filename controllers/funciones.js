const Sql = require('../db_SQL')
const config = require('../config/config').config


const todas_funciones = async (req, res) => {

    try {
        let query = `SELECT  cf.id , convert(varchar,cf.fecha,103) as fecha, c.nombre as cine , p.nombre as pelicula
        FROM Cabecera_funcion AS cf
        INNER JOIN cines AS c ON c.id = cf.id_cine
        INNER JOIN peliculas AS p ON p.id = cf.id_pelicula
        WHERE cf.eliminado is null`


        let db = new Sql(config)
        let result = await db.ejecutar(query)


        let query_count = `select count(*) as cant from cabecera_funcion` //count(*) me trae la cantidad de registros de esa tabla
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

};


const agregar_funcion = async (req, res) => {


    let { funcion_cabecera, funcion_detalle } = req.body


    try {
        let query = `INSERT INTO cabecera_funcion (fecha,id_cine,id_pelicula) VALUES ('${funcion_cabecera.fecha}','${funcion_cabecera.cine}','${funcion_cabecera.pelicula}') ; select scope_identity() as id`
        let db = new Sql(config)
        let results = await db.ejecutar(query)

        query = ""

        let id_funcion = results[0].id

        funcion_detalle.forEach(element => {

            query += `INSERT INTO detalle_funcion (id_cab_funcion,id_formato,id_horario,id_sala) VALUES ('${id_funcion}','${element.formato}',
         '${element.horario}', '${element.sala}')`

        });

        db = new Sql(config)
        await db.ejecutar(query)




        res.status(200).json({ status: 1, message: 'Datos guardados con exito', id: id_funcion })


    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })

    }

}

const get_funcion_by_id = async (req, res) => {

    try {

        let query = `select id, convert(varchar,fecha,31) fecha , id_cine , id_pelicula from cabecera_funcion where id=${req.params.id}`


        let db = new Sql(config)
        let results = await db.ejecutar(query) //aca se conecta a la base y me trae los resultados que necesito


        let funcion = {}


        funcion.cabecera = results[0]

        query = `Select * from detalle_funcion where id_cab_funcion = ${req.params.id} `

        db = new Sql(config)

        results = await db.ejecutar(query)


        funcion.detalle = results





        res.render('pages/formulario_funciones', { data: funcion })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}




const delete_function = async (req, res) => {

    try {

        let query = `Update cabecera_funcion set eliminado = 1 ; Update detalle_funcion set eliminado = 1 where id=${req.params.id}`


        let db = new Sql(config)
        let results = await db.ejecutar(query) //aca se conecta a la base y me trae los resultados que necesito



        res.status(200).json({ status: 1, message: 'Funcion eliminada exitosamente', results })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}

const modificar_function = async (req, res) => {



    try {

        let { funcion_cabecera, funcion_detalle } = req.body
        console.log('Hola estoy por modificar el registro')
        console.log(req.body.funcion_cabecera.cine)
        console.log(req.body.funcion_cabecera.fecha)
        console.log(req.body.funcion_cabecera.pelicula)
        console.log(req.body.funcion_detalle[0].formato)



        let query = `Update cabecera_funcion set fecha ='${funcion_cabecera.fecha}', id_cine =${funcion_cabecera.cine} , id_pelicula =${funcion_cabecera.pelicula}`


        let db = new Sql(config)
        let results = await db.ejecutar(query) //aca se conecta a la base y me trae los resultados que necesito

        query = ""

        console.log(funcion_detalle)

        funcion_detalle.forEach(element => {

            query += `Update detalle_funcion set id_formato = '${element.formato}', id_horario='${element.horario}',id_sala='${element.sala}' where id_cab_funcion=${funcion_cabecera.id}`

        });

        db = new Sql(config)
        await db.ejecutar(query)


        res.status(200).json({ status: 1, message: 'Funcion eliminada exitosamente', results })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}



const cargar_fechas_por_pelicula_cine = async (req, res) => {

    try {

        let query = `select convert(varchar(5),fecha,103) fecha , convert(varchar,fecha,112) as fecha_completa,
            case when fecha = convert(varchar,getdate(),112) then 'Hoy'
            when fecha = convert(varchar,getdate()+1,112) then 'Mañana'
            when DATEPART(DW, fecha) = 1 then 'Domingo'
            when DATEPART(DW, fecha) = 2 then 'Lunes'
            when DATEPART(DW, fecha) = 3 then 'Martes'
            when DATEPART(DW, fecha) = 4 then 'Miercoles'
            when DATEPART(DW, fecha)= 5 then 'Jueves'
            when DATEPART(DW, fecha)= 6 then 'Viernes'
            when DATEPART(DW, fecha) = 7 then 'Sabado'
            end as dia
            from cabecera_funcion where id_cine = ${req.query.id_cine} and id_pelicula = ${req.query.id_pelicula}
            and fecha >= convert(varchar,getdate(),112)`


        let db = new Sql(config)
        let results = await db.ejecutar(query)

        let html = ""

        results.forEach((resultado) => {
            html += `<div onclick="marcar_fecha_funcion(this)" class="fecha">
            <span class="dia">${resultado.dia}</span>
            <h5 class="valor" data-valor="${resultado.fecha_completa}">${resultado.fecha}</h5>
            </div>`;
        });

        console.log(results)

        res.status(200).send(html)

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}


const cargar_salas_horarios_por_dia_pelicula = async (req, res) => {

    try {

        let query = `select f.nombre as formato , h.nombre as horarios , df.id_sala as sala , df.id_formato,c.nombre as cine  from  cabecera_funcion  as cf
        inner join Detalle_funcion as df on df.id_cab_funcion = cf.id
        inner join formatos as f on f.id = df.id_formato
        inner join horarios as h on h.id = df.id_horario
        inner join cines as c on c.id = cf.id_cine
        where id_cine = ${req.query.id_cine} and id_pelicula = ${req.query.id_pelicula} and fecha = '${req.query.fecha}'`




        let db = new Sql(config)
        let results = await db.ejecutar(query)

        console.log(results)

        let html = ""


        results.forEach((resultado, index) => {

            if (index == 0) {
                html += 
                `
                <div class="titulo">
                    <h5 class="bold white span left">HORARIOS ${resultado.cine} PARA ${req.query.fecha}</h5>
                </div>
                <div class="horarios_cine">
                <div class="top">
                    <span class="span white left">${resultado.formato}</span>
                </div>
                <div onclick="marcar_fecha_funcion(this)" class="fecha salas_funciones">
                    <h5>${resultado.horarios}</h5>
                </div>
                </div>`
            } else if (index > 0) {

                html += `
                    <div class="horarios_cine">
                        <div class="top">
                            <span class="span white left">${resultado.formato}</span>
                        </div>
                        <div onclick="marcar_fecha_funcion(this)" class="fecha salas_funciones">
                            <h5>${resultado.horarios}</h5>
                        </div>
                    </div>

                   
                    `;
            }

        });

        console.log(results)

        res.status(200).send(html)

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

}




module.exports = {
    todas_funciones,
    agregar_funcion,
    get_funcion_by_id,
    delete_function,
    cargar_fechas_por_pelicula_cine,
    cargar_salas_horarios_por_dia_pelicula,
    modificar_function
};