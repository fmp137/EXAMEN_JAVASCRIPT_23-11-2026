"use strict";

// Codificar aquí las clases

//Definimos la clase con los atributos
class Libro{
    #idlibro;
    #idgenero;
    #titulo;
    #autor;
    #descripcion;
    #imagen;

    //Ponemos el constructor
    constructor(idlibro, idgenero, titulo, autor, descripcion, imagen) {
    this.#idlibro = idlibro;
    this.#idgenero = idgenero;
    this.#titulo = titulo;
    this.#autor = autor;
    this.#descripcion = descripcion;
    this.imagen = imagen;
  }

  //Ponemos los getters y setters
  get idlibro(){
        return this.#idlibro;
    }
    get idgenero(){
        return this.#idgenero;
    }
    get titulo(){
        return this.#titulo;
    }
    get autor(){
        return this.#autor;
    }
    get descripcion(){
        return this.#descripcion;
    }
    get imagen(){
        return this.#imagen;
    }

    set idlibro(idlibro) {
    this.#idlibro = idlibro;
  }
    set idgenero(idgenero) {
    this.#idgenero = idgenero;
  }
    set titulo(titulo) {
    this.#titulo = titulo;
  }
    set autor(autor) {
    this.#autor = autor;
  }
    set descripcion(descripcion) {
    this.#descripcion = descripcion;
  }
    set imagen(imagen) {
    this.#imagen = imagen;
  }

  //Y ponemos el metodo toJSON
  toJSON() {
    let oTipo = {
      idlibro: this.#idlibro,
      idgenero: this.#idgenero,
      titulo: this.#titulo,
      autor: this.#autor,
      descripcion: this.#descripcion,
      imagen: this.#imagen
    };
    return oTipo;
  }
}

//Declaramos la otra clase igual que la primera
class Genero{
    #idgenero;
    #genero;

    //Ponemos el constructor
    constructor(idgenero, genero) {
    this.#idgenero = idgenero;
    this.#genero = genero;

  }

  //Ponemos los getters y setters

    get idgenero(){
        return this.#idgenero;
    }
    get genero(){
        return this.#genero;
    }
    set idgenero(idgenero) {
    this.#idgenero = idgenero;
    }
    set genero(genero) {
    this.#genero = genero;
  }


  //Y ponemos el metodo toJSON
  toJSON() {
    let oTipo = {
      idgenero: this.#idgenero,
      genero: this.#genero
    };
    return oTipo;
  }
}

class GestorNotas{
    async crearLibro(oLibro){
        let datos = new FormData();

        datos.append("libro", JSON.stringify(oLibro));

        let respuesta = await peticionPOST("crear_libro.php", datos);

        return respuesta;
    }
    async getLibrosGenero(idgenero){
        let datos = new FormData();

        datos.append("idgenero", idgenero);

        let respuesta = await peticionGET("get_libros_genero.php", datos);

        return respuesta;
    }
    async getGeneros(){
        return await peticionGET("getGeneros.php", new FormData());
    }
}