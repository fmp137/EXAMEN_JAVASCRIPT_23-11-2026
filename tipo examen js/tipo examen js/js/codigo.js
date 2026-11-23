"use strict";

// Codificar aquí el programa principal
var oGestorNotas = new GestorNotas();

registrarEventos();


function registrarEventos() {

    // dropdown --------------------
    document
        .querySelector("#mnuCrearLibro")
        .addEventListener("click", mostrarFormulario);

    document
        .querySelector("#mnuListado")
        .addEventListener("click", mostrarFormulario);

    // Botones --------------------

    document
    frmCrearLibro.btnCrearLibro.addEventListener("click", procesarCrearLibro)

    document
    frmListado.btnListado.addEventListener("click", lsitarLibrosGenero)


}

function mostrarFormulario(oEvento) {
    let opcionMenu = oEvento.target.id; // Opción de menú pulsada (su id)

    ocultarFormularios();

    switch (opcionMenu) {
        case "mnuCrearLibro":
            frmCrearLibro.classList.remove("d-none");
            actualizarDesplegableGenero();
            break;
        case "mnuListado":
            frmListado.classList.remove("d-none");
            actualizarDesplegableGenero();
            break;
    }
}

function ocultarFormularios() {
    frmCrearLibro.classList.add("d-none");
    frmListado.classList.add("d-none");
}

async function procesarCrearLibro() {

    let titulo = frmCrearLibro.txtTitulo.value.trim();
    let autor = frmCrearLibro.txtAutor.value.trim();
    let descripcion = frmCrearLibro.txtDescripcion.value.trim();
    let imagen = frmCrearLibro.txtImagen.value.trim();
    let idGenero = parseInt(frmCrearLibro.txtTitulo.value);



    let respuesta = await oGestorNotas.CrearLibro(new libro(null,
        idGenero,
        titulo,
        autor,
        descripcion,
        imagen));

    alert(respuesta.mensaje);

    if (respuesta.ok) {
        // Si NO hay error
        //Resetear formulario
        frmCrearLibro.reset();
        // Ocultar el formulario
        frmCrearLibro.classList.add("d-none");
    }

}

async function actualizarDesplegableGenero(idGenero) {
    let respuesta = await oGestorNotas.getGenero();
    let options = "";

    for (let genero of respuesta.datos) {
        if (idGenero && idGenero == genero.idgenero) {
            // Si llega el parámetro ( != undefined )
            options +=
                "<option selected value='" +
                genero.idgenero +
                "' >" +
                genero.genero +
                "</option>";
        } else {
            options +=
                "<option value='" + genero.idgenero + "' >" + genero.genero + "</option>";
        }
    }
    // Agrego los options generados a partir del contenido de la BD en todos los desplegables
    frmCrearLibro.lstGenero.innerHTML = options;
    frmListado.lstGenero.innerHTML = options;
}

async function lsitarLibrosGenero() {
    let idGenero = parseInt(frmListado.lstGenero.value);

    let respuesta = await oGestorNotas.getLibrosGenero(idGenero);
    let genero = "";
    let tarjetas = "";

    for (let libro of respuesta.datos) {
        genero = libro.genero;

        tarjetas +=
            "<div class='card' style='width: 18rem;'>" +
            "<div class='card-body'>" +
            "<img src='" + libro.imagen + "' class='card-img'>" +
            "<h5 class='mt-2 mb-0'>" + libro.titulo + "</h5>" +
            "<p class='card-text fg-2'>" + libro.autor + "</p>" +
            "<p class='card-text fg-2'>" + libro.genero + "</p>" +
            "<small class='fg-3'>" + libro.descripcion + "</small>" +
            "</div></div>";


    }
    // Agrego los options generados a partir del contenido de la BD en todos los desplegables

    const nuevaVentana = window.open("", "_blank");

    let head = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/png" href="favicon.png"><link href="bootstrap/bootstrap.min.css" rel="stylesheet"><link href="css/estilos.css" rel="stylesheet"><title>Examen Librería</title></head><body>';

    let pagina = head + "<p>LISTADO LIBROS GENERO " + genero + "</p>" + tarjetas + '</body></html>';

    if (nuevaVentana) {
        nuevaVentana.document.write(pagina);

        nuevaVentana.document.close();
    }

}