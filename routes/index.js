const pages=require('./pages')//llamo las paginas que se renderizan
const login=require('./login')
const movies=require('./movies')
const cines=require('./cines')
const usuarios=require('./usuarios')
const horarios=require('./horarios')
const formatos=require('./formatos')
const salas=require('./salas')
const funciones=require('./funciones')


module.exports = (app)=>{
    pages(app)//las ejecuto y mando la variable app , que me sirve para pasarsela a todas mis rutas , lo cual sirve para que me levante las rutas
    login(app)
    movies(app)
    cines(app)
    usuarios(app)
    horarios(app)
    formatos(app)
    salas(app)
    funciones(app)

}