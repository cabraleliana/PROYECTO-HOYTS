let config = {
    "user": 'sa',
    "password": 'elu1234',
    "server": 'localhost',
    "database": 'HOYTS',
    "port": 1433, //Puerto de sql por defecto
    "dialect": "mssql",
    "options": {
        "encrypt": false
    },
    "dialectOptions": {
        "instanceName": "SQLEXPRESS"
    }
};

module.exports= {config}

// Archivo con datos necesarios para conectarme a la base 