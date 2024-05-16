const mssql = require('mssql');

module.exports = class Sql {
    constructor(stringConnection) {
        this.stringConnection = stringConnection;
        this.pool = null; // Añadido: mantener una referencia al pool
    }

    async connect() {
        return new Promise(async (resolve, reject) => {
            try {
                // Si ya existe un pool, no es necesario crear otro
                //cuando se requiera conectarse de nuevo , pregunta si ya esta conectado , si es asi no establece otra conexion
                if (this.pool) { 
                    resolve(); //es como un liberador de la promesa 
                    return;
                }

                this.pool = await mssql.connect(this.stringConnection); // se establece la conexion a la base y la guarda en this.pool
                
                resolve();
            } catch (err) {
                console.error('Error de conexión:', err);
                reject(err); //es lo mismo que return pero dice a la promise que termino con un error
            }
        });
    }

    async close() {
        try {
            if (this.pool) {
                await this.pool.close();
                this.pool = null; // Añadido: establecer la referencia del pool a null después de cerrar
            }
        } catch (err) {
            console.error('Error al cerrar la conexión:', err);
        }
    }

    async ejecutar(query) {
        try {
            await this.connect(); // Añadido: asegurarse de que la conexión está establecida , entonces el pool aca esta siempre bien (es decir una sola vez)
            const result = await this.pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error(`Ocurrió un error al solicitar los datos a la base de datos: ${error}`);
            throw error; // Añadido: lanzar la excepción para que pueda ser manejada externamente
        } finally {
            await this.close(); // Añadido: cerrar la conexión después de la ejecución
        }
    }
};
