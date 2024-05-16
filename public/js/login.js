const logIn = async () => {

    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let mensajeError=document.getElementById('mensajeError')

    console.log(email)
    console.log(password)

    try {
        const url = `http://localhost:3080/login/verificar_login?email=${email}&password=${password}`;
        // Lo tomo por parametro para saber si esos datos coinciden con los datos de la base

        const response = await fetch(url);
        const data = await response.json();
        console.log("este es el resultado de data" , data);

        if (data.status===1){
            localStorage.setItem("id_user", data.id) //si encontro coincidencia setea un atributo con el id del usuario correspondiente
            localStorage.setItem("carrito", '[]' ) //y empieza la compra con 0 consumisiones
            location.href='/' //lo dirige al index
            
        }else{
            mensajeError.innerText= data.message // si no hay coincidencia arroja error
        }
        }

    catch (error) {
        console.log(error)
    }
}

if(localStorage.getItem("id_user")){ //si usuario coincide al setear el atributo en la linea 19 , entonces usuario logeado
    console.log('usuario logeado')
   location.href='/'

 }



 const signIn = async () => {
    console.log('hizo click')
    try {

        let nombre = document.getElementById('name').value
        let apellido = document.getElementById('apellido').value
        let email = document.getElementById('email').value
        let contraseña = document.getElementById('password').value
        let confirm_password = document.getElementById('confirm_password').value
        let fecha_nacimiento= document.getElementById('fecha_nacimiento').value
        let genero = document.getElementById('genero').value
        let celular = document.getElementById('celular').value
        let complejo_habitual = document.getElementById('complejo_habitual').value
        
    
        const url = "http://localhost:3080/login/sign_in";

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({nombre, apellido,email,contraseña,fecha_nacimiento,genero,celular,complejo_habitual}),
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response);
        const data = await response.json();
        console.log(data);

        if (data.status === 1) {

            location.href = '/'

        }else{
            
        usuarioExistente.innerHTML=data.message
        }


    } catch (error) {
        console.log(error)
        console.log("Hubo un error");
    }

}
