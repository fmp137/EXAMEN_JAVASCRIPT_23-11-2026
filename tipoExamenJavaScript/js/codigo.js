"use strict";

// Codificar aquí el programa principal

//MAIN
var oGestorNotas = new GestorNotas();

registrarEventos();

// Gestionar la visibilidad del formulario de creación de libros y del formulario del listado de
// forma que no se vean de forma simultánea. También se debe gestionar la carga de los
// desplegables que contienen los géneros literarios en los dos formularios de la aplicación.
// (1,5 puntos)
//Funcion para registrar los eventos
function registrarEventos(){
    //Opciones del menú
    //Mostramos cada formulario al hacer CLICK
    document.getElementById("mnuCrearLibro").addEventListener("click", mostrarFormulario);
    document.getElementById("mnuListado").addEventListener("click", mostrarFormulario);
   
    //Botones
    frmCrearLibro.btnCrearLibro.addEventListener("click", procesarAltaLibro);
    frmListado.btnListado.addEventListener("click", procesarListado);
}

//Funcion para mostrar los formularios dependiendo cual se elija
function mostrarFormulario(oEvento){
    let opcion = oEvento.target.id;

    ocultarFormularios();

    switch(opcion){
        case "mnuCrearLibro":
            cargarDesplegables();
            frmCrearLibro.classList.remove("d-none");
            break;
        
        case "mnuListado":
            cargarDesplegables();
            frmListado.classList.remove("d-none");
            break;
    }
}

//Funcion para ocultar los formularios
function ocultarFormularios(){
    frmCrearLibro.classList.add("d-none");
    frmListado.classList.add("d-none")
}

//Funcion para cargar los desplegables de la base de datos
async function cargarDesplegables(){
    let respuesta = await oGestorNotas.getGeneros();
    let options = "";
    if(respuesta.ok){
        for(let genero of respuesta.datos){
            options += `<option value="${genero.idgenero}">${genero.genero}</option>`
        }

        frmCrearLibro.lstGenero.innerHTML = options;
        frmListado.lstGenero.innerHTML = options;
    }else{
        alert(
            "No se han podido cargar los generos literarios: " +  respuesta.mensaje);
        }
    }

// Realizar el proceso de crear un libro en la base de datos. (2 puntos)
// No es necesario realizar ninguna validación de los datos del
// formulario.
// El éxito o el error de la operación se mostrarán al usuario con
// un mensaje de alerta.
// Si hay éxito se reseteará el formulario y se ocultará.
// Si se produce un error no se realizará ninguna acción,
// mostrándose el formulario con los mismos datos que el
// usuario introdujo.

//Funcion para procesar el alta de un libro
async function procesarAltaLibro(){
    //Recogemos los campos del formulario
    //Cogemos los campos de cada input
    let titulo = frmCrearLibro.txtTitulo.value.trim();
    let autor = frmCrearLibro.txtAutor.value.trim();
    let descripcion = frmCrearLibro.txtDescripcion.value.trim();
    let imagen = frmCrearLibro.txtImagen.value.trim();

    //De aqui lo cogemos del listado
    let idgenero = frmCrearLibro.lstGenero.value.trim();

    //No es necesario realizar validaciones

    //Llamamos al servidor, el id del libro a null porque se autoincrementa
    let respuesta = await oGestorNotas.crearLibro(new Libro(null, idgenero, titulo, autor, descripcion, imagen));

    alert(respuesta.mensaje);

    //Si se completa se resetea el formulario y se oculta
    if(respuesta.ok){
        frmCrearLibro.reset();
        frmCrearLibro.classList.add("d-none");
    }
}

// Realizar el proceso que mostrará los libros correspondientes al
// género seleccionado en el formulario frmListado. Los libros del
// género seleccionado se visualizarán mediante tarjetas (Cards) de
// Bootstrap en una pestaña nueva del navegador. (2,5 puntos)
// Habrá un título donde aparecerán el siguiente texto "LISTADO
// DE LIBROS DEL GÉNERO Z", donde Z es el nombre del género
// Las tarjetas deberán mostrar los campos: título, autor,
// descripción, imagen y el nombre del género.
// En la imagen se visualiza una tarjeta de ejemplo tal y como
// deben quedar al generarlas.

async function procesarListado(){
    let idgenero = frmListado.lstGenero.value.trim();
    let genero = frmListado.lstGenero.options[frmListado.lstGenero.selectedIndex].textContent;

    let parametros = new URLSearchParams({
        idgenero: idgenero,
        genero: genero
    });

    open("tarjetas.html?" + parametros.toString());
}

