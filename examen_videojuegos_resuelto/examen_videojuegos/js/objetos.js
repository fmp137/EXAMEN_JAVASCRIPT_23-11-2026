"use strict";

// =====================================================================
// APARTADO A - Clases del modelo y gestor de comunicación con el backend
// =====================================================================

/**
 * Videojuego: una fila de la tabla "videojuego".
 */
class Videojuego {
    #idvideojuego;
    #idplataforma;
    #titulo;
    #desarrolladora;
    #precio;
    #fechalanzamiento;
    #portada;

    constructor(idvideojuego, idplataforma, titulo, desarrolladora, precio, fechalanzamiento, portada) {
        this.#idvideojuego = idvideojuego;
        this.#idplataforma = idplataforma;
        this.#titulo = titulo;
        this.#desarrolladora = desarrolladora;
        this.#precio = precio;
        this.#fechalanzamiento = fechalanzamiento;
        this.#portada = portada;
    }

    get idvideojuego() { return this.#idvideojuego; }
    set idvideojuego(valor) { this.#idvideojuego = valor; }

    get idplataforma() { return this.#idplataforma; }
    set idplataforma(valor) { this.#idplataforma = valor; }

    get titulo() { return this.#titulo; }
    set titulo(valor) { this.#titulo = valor; }

    get desarrolladora() { return this.#desarrolladora; }
    set desarrolladora(valor) { this.#desarrolladora = valor; }

    get precio() { return this.#precio; }
    set precio(valor) { this.#precio = valor; }

    get fechalanzamiento() { return this.#fechalanzamiento; }
    set fechalanzamiento(valor) { this.#fechalanzamiento = valor; }

    get portada() { return this.#portada; }
    set portada(valor) { this.#portada = valor; }

    /**
     * JSON.stringify() llama automáticamente a este método.
     * Es necesario porque los atributos privados (#) no se serializan solos.
     * @returns {object} Objeto plano con los nombres de las columnas de la tabla
     */
    toJSON() {
        return {
            idvideojuego: this.#idvideojuego,
            idplataforma: this.#idplataforma,
            titulo: this.#titulo,
            desarrolladora: this.#desarrolladora,
            precio: this.#precio,
            fechalanzamiento: this.#fechalanzamiento,
            portada: this.#portada
        };
    }
}

/**
 * Plataforma: una fila de la tabla "plataforma".
 */
class Plataforma {
    #idplataforma;
    #nombre;

    constructor(idplataforma, nombre) {
        this.#idplataforma = idplataforma;
        this.#nombre = nombre;
    }

    get idplataforma() { return this.#idplataforma; }
    set idplataforma(valor) { this.#idplataforma = valor; }

    get nombre() { return this.#nombre; }
    set nombre(valor) { this.#nombre = valor; }

    toJSON() {
        return {
            idplataforma: this.#idplataforma,
            nombre: this.#nombre
        };
    }
}

/**
 * GestorTienda: se comunica con los scripts PHP del backend.
 * Todos los métodos devuelven siempre un objeto { ok, mensaje, datos },
 * incluso si la petición falla (servidor caído, sin red...).
 */
class GestorTienda {

    /**
     * Inserta un videojuego en la base de datos.
     * @param {Videojuego} oVideojuego
     * @returns {Promise<{ok: boolean, mensaje: string, datos: null}>}
     */
    async crearVideojuego(oVideojuego) {
        try {
            let datos = new FormData();
            datos.append("videojuego", JSON.stringify(oVideojuego)); // usa toJSON()

            return await peticionPOST("crear_videojuego.php", datos);
        } catch (error) {
            return this.#respuestaError(error);
        }
    }

    /**
     * Recupera los videojuegos de una plataforma junto al nombre de esta.
     * @param {number|string} idplataforma
     * @param {string} orden - "titulo" o "precio"
     * @returns {Promise<{ok: boolean, mensaje: string, datos: object[]|null}>}
     */
    async getVideojuegosPlataforma(idplataforma, orden) {
        try {
            let datos = new FormData();
            datos.append("idplataforma", idplataforma);
            datos.append("orden", orden);

            return await peticionGET("get_videojuegos_plataforma.php", datos);
        } catch (error) {
            return this.#respuestaError(error);
        }
    }

    /**
     * Recupera todas las plataformas.
     * @returns {Promise<{ok: boolean, mensaje: string, datos: object[]|null}>}
     */
    async getPlataformas() {
        try {
            // peticionGET recorre el FormData, así que hay que pasarlo aunque vaya vacío
            return await peticionGET("get_plataformas.php", new FormData());
        } catch (error) {
            return this.#respuestaError(error);
        }
    }

    /**
     * Respuesta con la misma forma que las del servidor para cuando falla la petición.
     */
    #respuestaError(error) {
        return {
            ok: false,
            mensaje: "No se ha podido contactar con el servidor: " + error.message,
            datos: null
        };
    }
}
