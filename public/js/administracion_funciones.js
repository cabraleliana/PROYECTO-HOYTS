const get_all_funciones_formulario = () => {
    let columns = [
        { data: 'fecha' },
        { data: 'cine' },
        { data: 'pelicula' }
    ]
    let columnDefs = [
        {
            targets: 3, // quiere decir que en la columna de la posicion uno retorne ese boton
            render: function (data, type, row, meta) {
                return `
                <div class="d-flex">
                    <button class="btn btn-secondary editar">Editar</button>
                    <button class="btn btn-secondary borrar ml-2">Borrar</button>
                </div>
                `;
            }
        }
    ]

    generar_datatable('datatable_funciones', "http://localhost:3080/funciones/datatable_funciones", columns, columnDefs, eventos_tabla)//funcion general
}


function eventos_tabla() {
    // Agregar evento de clic a los botones editar y borrar
    $(`#datatable_funciones tbody`).on('click', 'tr .editar', function () {
        var tr = $(this).closest('tr');
        $('.row_selected').removeClass('row_selected') //aca elimino todas las clases de los elemetnos que la tengan con jquery , .row_seleted devulve un array y devuleve todos los elementos que tengan esa clase
        $(tr).addClass('row_selected') // aca agrego la clase a la fila seleccionada
        //la linera 31 y 32 son necesarioas para poder identificar el tr en la funcion guardar
        var data = grilla.row(tr).data();
        console.log(data)
        console.log(data.id)
        get_funcion_by_id_para_editar(data.id)
    });

    $(`#datatable_funciones tbody`).on('click', 'tr .borrar', function () {
        var tr = $(this).closest('tr');
        var data = grilla.row(tr).data();

        mostrarConfirmacion(
            '¿Estás seguro?',
            '¡No podrás revertir esto!',
            function () {
                // Acciones a realizar si se confirma la acción
                borrar(data.id, tr)
                //aca se la puedo mandar por parametro
            }
        );

    });
}


const get_funcion_by_id_para_editar = async (id) => {

    try {
        console.log(id)
        const url = `http://localhost:3080/funciones/${id}`;
        const response = await fetch(url);
        const data = await response.text();



        document.getElementById('formulario_planilla_funciones').innerHTML = data;

        cargar_cines()

        $('.fila_horario').each(function() {
    
           let select_horario = $(this).find('.horario')
           let select_formato = $(this).find('.formato')
           let select_sala = $(this).find('.sala')


           cargar_horarios(select_horario)
           cargar_formatos(select_formato) 
           //mando el select vacio y en esas funciones los carga y despues agarra el data valor y selecciona esa opcion
    
    
    
        });
    

        

    } catch (error) {
        console.log(error)
    }
}

const borrar = async (id, tr) => {

    try {
        const url = `http://localhost:3080/funciones/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        var indiceFila = grilla.row(tr).index();
        grilla.row(tr).remove().draw();

    } catch (error) {
        console.log(error)
    }



}


const guardar_funcion = async () => {

    let id = document.getElementById('id_funcion').value
    console.log(id)
    let fecha = document.getElementById('fecha').value
    let cine = document.getElementById('cine').value
    console.log(cine)
    let pelicula = document.getElementById('pelicula').value

    console.log(pelicula)

    let url = `http://localhost:3080/funciones`;

    

    let funciones = {}


    
    // esto es un array de objetos porque hay varios horario , formatos , sala , es decir , luego tengo que recorrerlo

    funciones.funcion_cabecera = {
        fecha: fecha,
        cine: cine,
        pelicula :pelicula,
        id : id

    }

    funciones.funcion_detalle = []

    console.log(funciones)


    $('.fila_horario').each(function() {

        //aca obtengo el valor del horario , this para que me posicione en la fila , esto lo hacemos porque es mas facil agarrarlo por clase
        //que por id , ya que si fuera por id deberia tener cada div que se crea por agregar un horario con un id diferente

       let horario = $(this).find('.horario').val()
       let formato = $(this).find('.formato').val()
       let sala = $(this).find('.sala').val()


        let detalle = {
            horario: horario,
            formato: formato,
            sala: sala
        };

        funciones.funcion_detalle.push(detalle);

    });


    let metodo = 'POST'

    if (id != 0) {
        url = `http://localhost:3080/funciones/${id}`
        metodo = 'PUT'
    }

    try {
        const response = await fetch(url, {
            method: metodo,
            body: JSON.stringify(funciones),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (id == 0) {
            if (data.status == 1) {
                let nueva_funcion = {
                    fecha: fecha,
                    cine: $('#cine option:selected').text(),
                    pelicula: $('#pelicula option:selected').text()
                }
                nueva_funcion.id = data.id
                grilla.row.add(nueva_funcion).draw() //ponemos false para que no recargue la pagina , pero si agrega la fila
                limpiar_campos()
            }

        } else {
            if (data.status == 1) {
                let tr = $('.row_selected')[0] // devuelve los elementos que tienen esa clase , pongo corchetes porque devuleve un array asi me quedo solo con el elemento puro
                var indiceFila = grilla.row(tr).index();
                // Modificar los datos en la DataTable
                let nueva_funcion = {
                    fecha: fecha,
                    cine: $('#cine option:selected').text(),
                    pelicula: $('#pelicula option:selected').text()
                }
                grilla.row(indiceFila).data(nueva_funcion).draw(false);
            }
        }

        //aca estamos agregando el id al objeto , cuando devuleve los resultados

        mostrar_mensaje(data.message)

    } catch (error) {
        console.log(error)
    }



}





const nueva_funcion = () => {

    document.getElementById("id_funcion").value = 0 //Para cuando le de a guardar sepa si es una alta o una modificacion 


}

const cargar_cines = async () => {

    try {
        const url = `http://localhost:3080/cines/select_cines`;


        const response = await fetch(url);
        const data = await response.text(); //transformo los datos en formato json



        document.getElementById('cine').insertAdjacentHTML('beforeend', data);
        //hicimos esto para que no me saque la opcion seleccione que tengo creada

        let cine_seleccionado = $('#cine').attr('data-valor')



        $('#cine').val(cine_seleccionado)
        //este lo hicimos asi porque no depende de nada

        if(cine_seleccionado != "") {
            
            $('#cine').trigger("change");
            //dispara el evento onchange del html que en el select de cines , y ejecuta una funcion cada vez que cambia el valor del select 

        }

        



    } catch (error) {
        console.log(error)
    }
}



const cargar_horarios = async (select) => {

    try {
        const url = `http://localhost:3080/horarios/select_horarios`;


        const response = await fetch(url);
        const data = await response.text(); //transformo los datos en formato json



        $(select).html(data)
        //este pisa todo el tiempo la info del select , ya que al cambiar todo el tiempo el cine , queda la info del cine amterior

        $(select).prepend("<option value=''>Seleccione horario</option>");
        //lo puse despues del insert porque sino se pisa con el html
        $(select).val($(select).attr('data-valor'))
        //selecciona el atributo que tengo en data valor y me marca el horario


    } catch (error) {
        console.log(error)
    }
}


const cargar_formatos = async (select) => {

    try {
        const url = `http://localhost:3080/formatos/select_formatos`;


        const response = await fetch(url);
        const data = await response.text(); //transformo los datos en formato json



        $(select).html(data)
        //este pisa todo el tiempo la info del select , ya que al cambiar todo el tiempo el cine , queda la info del cine amterior

        $(select).prepend("<option value=''>Seleccione formato</option>");
        //lo puse despues del insert porque sino se pisa con el html
        $(select).val($(select).attr('data-valor'))
        //selecciona el atributo que tengo en data valor y me marca el formato

        //disparo el evento change del select de formato para traer las salas si hay valor en data-valor
        if($(select).attr('data-valor') != "") {
            
            $(select).trigger("change");
        }



    } catch (error) {
        console.log(error)
    }
}


const cargar_salas_por_formato = async (select) => {

    try {
        let fila = $(select).closest('.fila_horario') //obtenemos la fila , llegamos al elemento padre
        let id_formato = $(select).val()
        let id_cine = $('#cine').val()

        const url = `http://localhost:3080/salas/select_salas_by_formato?id_formato=${id_formato}&id_cine=${id_cine}`;


        const response = await fetch(url);
        const data = await response.text(); //transformo los datos en formato json



        $(fila).find('.sala').html(data)
        $(fila).find('.sala').prepend("<option value=''>Seleccione sala</option>");
        //hicimos esto para que no me saque la opcion seleccione que tengo creada



    } catch (error) {
        console.log(error)
    }
}



const agregar_horario = async (id) => {

    try {

        let nuevo_horario = $('#fila_horario').clone()    // funcion de jquery que clona la fila de horarios



        let boton = '<button type="button" class="btn btn-secondary btn-block" onclick="eliminar_horario(this.parentNode)">Eliminar</button>'
        //lo creamos por javascript para poder borrar la fila , lo hacemos por aca porque la primera fila no puede tener borrar ,
        // porque se borraria el html de esa fila
        //parentNode agarra el primer elemento que lo contiene

        $(nuevo_horario).append(boton)//aca agregamos el boton a la fila

        $('#contenedor_horarios').append(nuevo_horario) // aca agregamos la fila al conedor filas


    } catch (error) {
        console.log(error)
    }
}





const eliminar_horario = async (fila) => {

    try {

        $(fila).remove() //borra la fila

    } catch (error) {
        console.log(error)
    }
}

get_all_funciones_formulario()
cargar_cines();
cargar_horarios($('#horario'));
cargar_formatos($('#formato'));
