const Sql = require('../db_SQL')
const config = require('../config/config').config



const select_horarios = async (req, res) => {

    try {

        let query_horarios = 'Select id, nombre from horarios'


        const db = new Sql(config)
        let results_horarios = await db.ejecutar(query_horarios) //aca se conecta a la base y me trae los resultados que necesito

        opcionesGeneradas=""

        results_horarios.forEach((opcion) => {
            opcionesGeneradas += `<option value="${opcion.id}">${opcion.nombre}</option>`;
            
          }); //este for each genera opciones para inyectarlas en el select del front . Mejor procesarlo en el back ya que se procesa todo en el servidor (mas rapido) y no del lado del cliente ( en caso que tengan maquina lenta )

          
        res.status(200).send(opcionesGeneradas)

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: -1, message: 'Hubo un error interno en el server' })
    }

};

module.exports = {
   select_horarios
};