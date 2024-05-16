const select_cines = async () => {

    try {
        const url = `http://localhost:3080/cines/select_cines`;
        // Lo tomo por parametro para saber si esos datos coinciden con los datos de la base

        const response = await fetch(url);
        const data = await response.text(); //transformo los datos en formato json
        
       

        document.getElementById('select_cines').insertAdjacentHTML('beforeend', data);


    } catch (error) {
        console.log(error)
    }
}




select_cines()
