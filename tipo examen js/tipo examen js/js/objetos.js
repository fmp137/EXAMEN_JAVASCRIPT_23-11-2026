"use strict";

class libro {
    #idLibro
    #idGenero
    #titulo
    #autor
    #descripcion
    #imagen
    constructor(idLibro,
        idGenero,
        titulo,
        autor,
        descripcion,
        imagen) {
        this.#idLibro = idLibro
        this.#idGenero = idGenero
        this.#titulo = titulo
        this.#autor = autor
        this.#descripcion = descripcion
        this.#imagen = imagen
    }

    get idLibro() {
        return this.#idLibro;
    }
    set idLibro(idLibro) {
        this.#idLibro = idLibro;
    }

    get idGenero() {
        return this.#idGenero;
    }
    set idGenero(idGenero) {
        this.#idGenero = idGenero;
    }

    get titulo() {
        return this.#titulo;
    }
    set titulo(titulo) {
        this.#titulo = titulo;
    }

    get autor() {
        return this.#autor;
    }
    set autor(autor) {
        this.#autor = autor;
    }

    get descripcion() {
        return this.#descripcion;
    }
    set descripcion(descripcion) {
        this.#descripcion = descripcion;
    }

    get imagen() {
        return this.#imagen;
    }
    set imagen(imagen) {
        this.#imagen = imagen;
    }

    toJSON() {
        let oLibro = {
            idLibro: this.#idLibro,
            idGenero: this.#idGenero,
            titulo: this.#titulo,
            autor: this.#autor,
            descripcion: this.#descripcion,
            imagen: this.#imagen
        };
        return oLibro;
    }

}


class genero {
    #idGenero
    #genero
    constructor(idGenero, genero) {
        this.#idGenero = idGenero
        this.#genero = genero

    }

    get idGenero() {
        return this.#idGenero;
    }
    set idGenero(idGenero) {
        this.#idGenero = idGenero;
    }

    get genero() {
        return this.#genero;
    }
    set genero(genero) {
        this.#genero = genero;
    }

    toJSON() {
        let oGenero = {
            idGenero: this.#idGenero,
            genero: this.#genero
        };
        return oGenero;
    }

}


class GestorNotas {
    async CrearLibro(oLibro) {
        let datos = new FormData();

        datos.append("idLibro", oLibro.idLibro);
        datos.append("idGenero", oLibro.idGenero);
        datos.append("titulo", oLibro.titulo);
        datos.append("autor", oLibro.autor);
        datos.append("descripcion", oLibro.descripcion);
        datos.append("imagen", oLibro.imagen);

        let respuesta = await peticionPOST("crear_libro.php", datos);

        return respuesta;
    }

    async getGenero() {

        let respuesta = await peticionGET("get_genero.php");

        return respuesta;
    }

    async getLibrosGenero(idgenero) {
        let datos = new FormData();
        datos.append("idgenero", idgenero);

        let respuesta = await peticionGET("get_libros_genero.php", datos);

        return respuesta;
    }


}