

const get_all_users = () => {
    let columns = [
        { data: 'nombre' },
        { data: 'email' },
        { data: 'apellido' },
        { data: 'celular' },
        { data: 'complejo_habitual' }
    ]
    let columnDefs = [
        {
            targets: 5, // quiere decir que en la columna cinco retorne ese boton
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
    generar_datatable('datatable_usuarios', "http://localhost:3080/user/get_all_users", columns, columnDefs, eventos_tabla)
}

function eventos_tabla() {
    // Agregar evento de clic a los botones editar y borrar
    $(`#datatable_usuarios tbody`).on('click', 'tr .editar', function () {
        var tr = $(this).closest('tr');
        $('.row_selected').removeClass('row_selected') //aca elimino todas las clases de los elemetnos que la tengan con jquery , .row_seleted devulve un array y devuleve todos los elementos que tengan esa clase
        $(tr).addClass('row_selected') // aca agrego la clase a la fila seleccionada
        //la linera 31 y 32 son necesarioas para poder identificar el tr en la funcion guardar
        var data = grilla.row(tr).data();
        get_user_by_id_para_editar(data.id)
    });

    $(`#datatable_usuarios tbody`).on('click', 'tr .borrar', function () {
        var tr = $(this).closest('tr');
        var data = grilla.row(tr).data();

        mostrarConfirmacion(
            '¿Estás seguro?',
            '¡No podrás revertir esto!',
            function () {
                // Acciones a realizar si se confirma la acción
                borrar(data.id,tr) //aca se la puedo mandar por parametro
            }
        );

    });
}


const get_user_by_id_para_editar = async (id) => {

    try {
        const url = `http://localhost:3080/user/${id}`;
        const response = await fetch(url);
        const data = await response.text();
        document.getElementById('formulario_planilla_usuarios').innerHTML = data;

    } catch (error) {
        console.log(error)
    }
}

const borrar = async (id,tr) => {

    try {
        const url = `http://localhost:3080/user/${id}`;
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


const guardar_usuario = async () => {

    let id = document.getElementById('id_usuario').value
    let email = document.getElementById('email').value
    let nombre = document.getElementById('name').value
    let apellido = document.getElementById('apellido').value
    let celular = document.getElementById('celular').value
    let complejo_habitual = document.getElementById('complejo_habitual').value
    let genero = document.getElementById('genero').value
    let url = `http://localhost:3080/user`;




    let usuario = {
        email: email,
        nombre: nombre,
        apellido: apellido,
        celular: celular,
        complejo_habitual: complejo_habitual,
        genero: genero
    }

    //porque al datatable le tengo que mandar un objeto

    let metodo = 'POST'

    if (id != 0) {
        url = `http://localhost:3080/user/${id}`
        metodo = 'PUT'
    }

    try {
        const response = await fetch(url, {
            method: metodo,
            body: JSON.stringify(usuario),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (id == 0) {
            if(data.status == 1){
                usuario.id = data.id
                grilla.row.add(usuario).draw() //ponemos false para que no recargue la pagina , perp si agrega la fila
                limpiar_campos()
            }

        } else {
            if(data.status == 1){
                let tr=  $('.row_selected')[0] // devuelve los elementos que tienen esa clase , pongo corchetes porque devuleve un array asi me quedo solo con el elemento puro
                var indiceFila = grilla.row(tr).index();
                // Modificar los datos en la DataTable
                usuario.id=id
                grilla.row(indiceFila).data(usuario).draw(false);
            }
        }

        //aca estamos agregando el id al objeto , cuando devuleve los resultados

        mostrar_mensaje(data.message)

    } catch (error) {
        console.log(error)
    }




}





const nuevo_usuario = () => {

    document.getElementById("id_usuario").value = 0 //Para cuando le de a guardar sepa si es una alta o una modificacion 


}


get_all_users()


