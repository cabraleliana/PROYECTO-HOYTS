const Sql = require('../db_SQL')
const config = require('../config/config').config



const select_salas_by_formato = async (req, res) => {

    try {

        let query_salas = `
        select s.id, s.nombre 
        from salas as s
        inner join Cine_sala as cs on cs.id_sala = s.id
        inner join Sala_formato as sf on sf.id_sala = s.id 
        where sf.id_formato = ${req.query.id_formato} and cs.id_cine = ${req.query.id_cine}`
    
    
        const db = new Sql(config)
        let results_salas = await db.ejecutar(query_salas) //aca se conecta a la base y me trae los resultados que necesito

        opcionesGeneradas=""

        results_salas.forEach((opcion) => {
            opcionesGeneradas += `<option value="${opcion.id}">${opcion.nombre}</option>`;
            
          }); //este for each genera opciones para inyectarlas en el select del front . Mejor procesarlo en el back ya que se procesa todo en el servidor (mas rapido) y no del lado del cliente ( en caso que tengan maquina lenta )

          
        res.status(200).send(opcionesGeneradas)

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

};

module.exports = {
    select_salas_by_formato
};