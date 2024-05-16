const express = require('express')
const app = express() //Instancia para levantar servidor

const routes_master = require('./routes/index') //LLamo a index porque ahi tengo todas las rutas

const cors = require('cors');



app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static('public'))




routes_master(app) //Lo pongo aca,donde se ejecuta para que app reconozca las rutas del index , app es el servidor que levantamos , lo mandamos por parametrom para poder agregarle rutas desde otro archivo



let port = 3080

app.listen(port, () => {
    console.log(`El servidor esta escuchando en el puerto ${port}`)
})
