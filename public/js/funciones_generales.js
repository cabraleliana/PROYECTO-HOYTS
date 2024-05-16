var grilla;

// $(document).ready(function() {
//     $('#container_oculto').addClass('display-none');
// });


function generar_datatable(id_tabla, url, columns, columnDefs,eventos_tabla){
    grilla = $(`#${id_tabla}`).DataTable({
        ajax: {
            url: url,
            // Otras configuraciones AJAX
        },
        dataSrc: function(json) {
            console.log(json);
            return json.data;
        },
        columns,
        columnDefs,
        pageLength: 5, // Número de registros por página
        lengthMenu: [5, 10, 20],
    });

    eventos_tabla();
}

function mostrarConfirmacion(titulo, mensaje, confirmCallback) {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ¡hazlo!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si se hace clic en "Sí, ¡hazlo!", ejecuta la función de confirmación
            if (confirmCallback && typeof confirmCallback === 'function') {
                confirmCallback();
            }
        }
    });
}



const mostrar_mensaje =  (mensaje) => {
Swal.fire({
    title: '¡Notificacion!',
    text: mensaje,
    icon: 'info',
    confirmButtonText: 'Aceptar'
});
}


const limpiar_campos =  (clase) => {
$(clase).val('') //asi limpiamos los campos
}


const cargar_fechas_por_pelicula_cine = async () => {

    try {

       

        let id_cine = $('#select_cines').val()
        let id_pelicula = $('#select_movies').val()

        const url = `http://localhost:3080/funciones/cargar_fechas_por_pelicula_cine?id_cine=${id_cine}&id_pelicula=${id_pelicula}`;


        const response = await fetch(url);
        const data = await response.text(); 
        
       
        console.log(data)
        document.getElementById('contenedor_funciones').innerHTML = data


    } catch (error) {
        console.log(error)
    }

   
}

const cargar_salas_horarios_por_dia_pelicula = async () => {

    try {


      

        let id_cine = $('#select_cines').val()
        let id_pelicula = $('#select_movies').val()
        let fecha= $('.fecha.seleccionada .valor').attr('data-valor')
        let desc_cine =  $("#select_cine option:selected").text();
        let dia =$('.fecha.seleccionada .dia').text()

        console.log(fecha)



        const url = `http://localhost:3080/funciones/cargar_salas_horarios_por_dia_pelicula?id_cine=${id_cine}&id_pelicula=${id_pelicula}&fecha=${fecha}&desc_cine=${desc_cine}&dia=${dia}`;


        const response = await fetch(url);
        const data = await response.text(); 
        
       
        console.log(data)
        document.getElementById('contenedor_funciones_totales').innerHTML = data

    


    } catch (error) {
        console.log(error)
    }
}




const cargar_peliculas_por_cine = async (select_cine,select_id_peliculas) => {

    let id = $(select_cine).val()
    //es el select de cine

    try {
        const url = `http://localhost:3080/movies/select_movie_by_cine/${id}`;


        const response = await fetch(url);
        const data = await response.text();




        $(`#${select_id_peliculas}`).html(data)
        //este pisa todo el tiempo la info del select , ya que al cambiar todo el tiempo el cine , queda la info del cine amterior
        $(`#${select_id_peliculas}`).prepend("<option value=''>Seleccione pelicula</option>");
        //lo puse despues del insert porque sino se pisa con el html
        $(`#${select_id_peliculas}`).val($(`#${select_id_peliculas}`).attr('data-valor'))
        //selecciona el atributo que tengo en data valor y me marca la pelicula que corresponda


    } catch (error) {
        console.log(error)
    }
}



const marcar_fecha_funcion = async (div) => {

    try {

        $('.fecha.seleccionada').removeClass('seleccionada')
        $(div).addClass('seleccionada')

        
        
        // Mostrar el elemento en respuesta a algún evento

        

        $('#container_oculto').removeClass('oculto');
        container_oculto
        $('#container_oculto').addClass('container_oculto')

        cargar_salas_horarios_por_dia_pelicula()
       

    } catch (error) {
        console.log(error)
    }

}


