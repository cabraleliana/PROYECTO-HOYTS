const all_movies = async () => {

    try {
        const url = `http://localhost:3080/movies/all_movies`;
        // Lo tomo por parametro para saber si esos datos coinciden con los datos de la base

        const response = await fetch(url);
        const data = await response.text(); //transformo los datos en formato json

        console.log(data);

        
        console.log(data);

        document.getElementById('contenedor-peliculas').innerHTML = data


    } catch (error) {
        console.log(error)
    }
}











all_movies()







