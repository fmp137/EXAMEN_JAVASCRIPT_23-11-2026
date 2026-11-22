"use strict";

// =====================================================================
// APARTADO B - Programa principal
// =====================================================================

const oGestor = new GestorTienda();

const formCrear = document.getElementById("frmCrearVideojuego");
const formListado = document.getElementById("frmListado");

const formatoEuros = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

// ---------------------------------------------------------------------
// B.1 - Visibilidad de los formularios y carga de los desplegables
// ---------------------------------------------------------------------

/**
 * Muestra un formulario y oculta el otro para que nunca se vean a la vez.
 * @param {HTMLFormElement} formulario - El formulario que se quiere mostrar
 */
function mostrarFormulario(formulario) {
    formCrear.style.display = "none";
    formListado.style.display = "none";
    formulario.style.display = "block";
}

/**
 * Sustituye las opciones de un desplegable por una opción por plataforma.
 */
function rellenarDesplegable(desplegable, plataformas) {
    desplegable.replaceChildren(
        ...plataformas.map(p => new Option(p.nombre, p.idplataforma))
    );
}

/**
 * Pide las plataformas al servidor y rellena el desplegable de los dos formularios.
 */
async function cargarDesplegables() {
    let respuesta = await oGestor.getPlataformas();

    if (!respuesta.ok) {
        alert("No se han podido cargar las plataformas: " + respuesta.mensaje);
        return;
    }

    let plataformas = respuesta.datos.map(fila => new Plataforma(fila.idplataforma, fila.nombre));

    // Cada desplegable necesita sus propios nodos <option>, por eso se crean dos veces
    rellenarDesplegable(formCrear.lstPlataforma, plataformas);
    rellenarDesplegable(formListado.lstPlataforma, plataformas);
}

// ---------------------------------------------------------------------
// B.2 - Crear un videojuego
// ---------------------------------------------------------------------

async function crearVideojuego() {
    if (!confirm("¿Seguro que quieres crear el videojuego?")) {
        return; // Si el usuario cancela no se hace nada
    }

    let oVideojuego = new Videojuego(
        null, // el idvideojuego lo genera la base de datos
        Number(formCrear.lstPlataforma.value),
        formCrear.txtTitulo.value,
        formCrear.txtDesarrolladora.value,
        Number(formCrear.txtPrecio.value), // el precio se envía como número, no como texto
        formCrear.dtFecha.value,
        formCrear.txtPortada.value
    );

    let respuesta = await oGestor.crearVideojuego(oVideojuego);

    alert(respuesta.mensaje);

    if (respuesta.ok) {
        formCrear.reset();
        formCrear.style.display = "none";
    }
    // Si hay error no se hace nada más: el formulario se queda con los datos del usuario
}

// ---------------------------------------------------------------------
// B.3 - Listado de videojuegos en una pestaña nueva
// ---------------------------------------------------------------------

/**
 * Evita que un texto de la base de datos se interprete como HTML.
 */
function escaparHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

/**
 * Convierte una fecha de MySQL (aaaa-mm-dd) a dd/mm/aaaa.
 */
function formatearFecha(fecha) {
    return fecha.split("-").reverse().join("/");
}

/**
 * Genera las filas <tr> de la tabla. Las de menos de 20 € se resaltan.
 */
function generarFilas(videojuegos) {
    return videojuegos.map(v => {
        // Desde MySQL el precio llega como texto ("24.99"), por eso se convierte
        let precio = Number(v.precio);
        let clase = precio < 20 ? "table-success" : "";

        return `
            <tr class="${clase}">
                <td><img src="${escaparHTML(v.portada)}" alt="Portada de ${escaparHTML(v.titulo)}"
                         class="img-thumbnail" style="width: 60px;"></td>
                <td>${escaparHTML(v.titulo)}</td>
                <td>${escaparHTML(v.desarrolladora)}</td>
                <td class="text-end">${formatoEuros.format(precio)}</td>
                <td>${formatearFecha(v.fechalanzamiento)}</td>
            </tr>`;
    }).join("");
}

/**
 * Genera el documento HTML completo que se escribe en la pestaña nueva.
 */
function generarHTMLListado(nombrePlataforma, videojuegos) {
    // La pestaña nueva es about:blank, así que se usa una ruta absoluta a Bootstrap
    let rutaBootstrap = new URL("bootstrap/css/bootstrap.min.css", document.baseURI).href;

    let contenido;
    if (videojuegos.length === 0) {
        contenido = `<div class="alert alert-warning">No hay videojuegos para esta plataforma.</div>`;
    } else {
        contenido = `
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Portada</th>
                        <th>Título</th>
                        <th>Desarrolladora</th>
                        <th class="text-end">Precio</th>
                        <th>Lanzamiento</th>
                    </tr>
                </thead>
                <tbody>${generarFilas(videojuegos)}
                </tbody>
            </table>
        </div>`;
    }

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Videojuegos de ${escaparHTML(nombrePlataforma)}</title>
    <link rel="stylesheet" href="${rutaBootstrap}">
</head>
<body>
    <main class="container my-4">
        <h2 class="mb-4">VIDEOJUEGOS DE LA PLATAFORMA ${escaparHTML(nombrePlataforma)}</h2>
        ${contenido}
    </main>
</body>
</html>`;
}

async function mostrarListado() {
    let desplegable = formListado.lstPlataforma;

    if (desplegable.selectedIndex < 0) {
        alert("No hay plataformas cargadas.");
        return;
    }

    let idplataforma = desplegable.value;
    let nombrePlataforma = desplegable.options[desplegable.selectedIndex].text;
    let orden = formListado.rdoOrden.value; // valor del radio marcado: "titulo" o "precio"

    // La pestaña se abre ANTES de esperar al servidor: así el navegador la asocia
    // con el clic del usuario y no la bloquea como ventana emergente.
    let ventana = window.open("", "_blank");
    if (!ventana) {
        alert("El navegador ha bloqueado la pestaña nueva. Permite las ventanas emergentes para este sitio.");
        return;
    }

    let respuesta = await oGestor.getVideojuegosPlataforma(idplataforma, orden);

    if (!respuesta.ok) {
        ventana.close();
        alert(respuesta.mensaje);
        return;
    }

    ventana.document.write(generarHTMLListado(nombrePlataforma, respuesta.datos));
    ventana.document.close();
}

// ---------------------------------------------------------------------
// Arranque: eventos y carga inicial
// ---------------------------------------------------------------------

document.getElementById("mnuCrearVideojuego").addEventListener("click", (evento) => {
    evento.preventDefault(); // el enlace es href="#", no debe saltar al inicio de la página
    mostrarFormulario(formCrear);
});

document.getElementById("mnuListado").addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarFormulario(formListado);
});

document.getElementById("btnCrear").addEventListener("click", crearVideojuego);
document.getElementById("btnListar").addEventListener("click", mostrarListado);

cargarDesplegables();
