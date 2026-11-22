# Chuleta de examen: Desarrollo de Interfaces (JavaScript + AJAX + Bootstrap 5)

Basada en tres exámenes: **recuperación 20/06/2024** (notas), **UD1 21/11/2024** (librería) y el **examen de práctica** (videojuegos).
Cada bloque se puede copiar tal cual. Lo que cambia de un examen a otro son los nombres (entidades, campos, ids): están marcados con comentarios.

> **Regla de oro:** lo primero es abrir los `.php` de la plantilla y mirar qué parámetros leen y qué campos devuelven. Los nombres de esos PHP mandan sobre los de esta chuleta.

## Índice

1. [Antes de empezar](#1-antes-de-empezar)
2. [Estructura y orden de los scripts](#2-estructura-y-orden-de-los-scripts)
3. [HTML y formularios con Bootstrap](#3-html-y-formularios-con-bootstrap)
4. [CSS y fuente local](#4-css-y-fuente-local)
5. [Apartado A: clases y gestor](#5-apartado-a-clases-y-gestor)
6. [Apartado B: programa principal](#6-apartado-b-programa-principal)
7. [Apartado C: rejillas y tarjetas](#7-apartado-c-rejillas-y-tarjetas)
8. [Componentes de Bootstrap](#8-componentes-de-bootstrap)
9. [JavaScript esencial](#9-javascript-esencial)
10. [Validación de formularios](#10-validación-de-formularios)
11. [Cómo leer los PHP del examen](#11-cómo-leer-los-php-del-examen)
12. [Depuración: errores típicos](#12-depuración-errores-típicos)
13. [Checklist final](#13-checklist-final)

---

## 1. Antes de empezar

1. Lee el enunciado entero y apunta los puntos de cada apartado (reparte el tiempo en proporción).
2. En `js/ajax.js` cambia **solo** `rutaBackend` y deja la barra final:

```js
const rutaBackend = "http://localhost/examen/backend/";
```

3. Importa el `.sql` (phpMyAdmin → Importar) y mira las tablas.
4. Abre cada `.php` y apunta: **método** (`$_GET` / `$_POST`), **nombre de los parámetros** y **campos que devuelve**.
5. Prueba un script en el navegador, por ejemplo `http://localhost/examen/backend/get_generos.php`: debe salir un JSON `{ok, mensaje, datos}` (o `{error, mensaje, datos}` en el examen de las notas).
6. Orden recomendado: **A** (clases) → HTML del formulario → CSS → **B.1** → **B.2** → **B.3** → **C**. Haz funcionar cada parte antes de pasar a la siguiente.

Reglas que repiten todos los enunciados:

- No tocar el HTML salvo para añadir los campos del formulario de crear.
- Las clases van en `/js/objetos.js` y el programa principal en `/js/codigo.js`.
- En `estilos.css` viene `form { display: none; }`: los formularios empiezan ocultos y se muestran con JS.
- Las operaciones muestran su resultado con `alert`.

## 2. Estructura y orden de los scripts

```
proyecto/
├── bootstrap/      css y js (bundle)
├── css/estilos.css
├── fonts/          fuente local (si la hay)
├── js/ajax.js      peticionGET / peticionPOST  (ya viene hecho)
├── js/objetos.js   Apartado A
├── js/codigo.js    Apartado B
├── php/            backend (ya viene hecho)
├── sql/            base de datos
├── index.html
└── tarjetas.html   Apartado C
```

El orden importa: cada fichero usa el anterior.

```html
<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="css/estilos.css">   <!-- después de Bootstrap, para que gane -->

<!-- al final del body -->
<script src="bootstrap/js/bootstrap.bundle.min.js"></script>   <!-- el BUNDLE: carrusel, modal, acordeón, navbar -->
<script src="js/ajax.js"></script>
<script src="js/objetos.js"></script>
<script src="js/codigo.js"></script>
```

Hay que abrir la página por `http://localhost/...` (Apache arrancado), **no** con doble clic (`file://`).

## 3. HTML y formularios con Bootstrap

### Fila de formulario (etiqueta a la izquierda, campo a la derecha)

`name` sirve para acceder desde JS (`formulario.txtTitulo.value`); `id` para el `for` de la etiqueta. Si hay dos formularios con un desplegable del mismo `name`, los `id` deben ser distintos.

```html
<div class="row mb-3">
    <label for="txtTitulo" class="col-sm-4 col-form-label">Título</label>
    <div class="col-sm-8">
        <input type="text" id="txtTitulo" name="txtTitulo" class="form-control" maxlength="100" placeholder="Título">
    </div>
</div>
```

### Formulario completo: crear nota (examen de las notas)

La fecha de creación **no lleva campo** (se pone en el momento de crear).

```html
<form id="frmCrearNota" class="p-3 rounded bg-light">
    <h4 class="mb-3">Crear nota</h4>

    <div class="row mb-3">
        <label for="txtTitulo" class="col-sm-4 col-form-label">Título</label>
        <div class="col-sm-8">
            <input type="text" id="txtTitulo" name="txtTitulo" class="form-control" maxlength="100" placeholder="Título">
        </div>
    </div>

    <div class="row mb-3">
        <label for="txtTexto" class="col-sm-4 col-form-label">Texto</label>
        <div class="col-sm-8">
            <textarea id="txtTexto" name="txtTexto" class="form-control" rows="3" maxlength="1000" placeholder="Texto"></textarea>
        </div>
    </div>

    <div class="row mb-3">
        <label for="txtUrlImagen" class="col-sm-4 col-form-label">Url de la imagen</label>
        <div class="col-sm-8">
            <input type="text" id="txtUrlImagen" name="txtUrlImagen" class="form-control" maxlength="200" placeholder="Url de la imagen">
        </div>
    </div>

    <div class="row">
        <div class="col-sm-8 offset-sm-4">
            <button type="button" id="btnCrear" class="btn btn-primary">Crear nota</button>
        </div>
    </div>
</form>
```

### Formulario de listado con fecha (examen de las notas)

```html
<form id="frmVerNotas" class="p-3 rounded bg-light">
    <h4 class="mb-3">Ver notas</h4>
    <div class="row mb-3">
        <label for="dtFecha" class="col-sm-4 col-form-label">Notas desde</label>
        <div class="col-sm-8">
            <input type="date" id="dtFecha" name="dtFecha" class="form-control">
        </div>
    </div>
    <div class="row">
        <div class="col-sm-8 offset-sm-4">
            <button type="button" id="btnVerNotas" class="btn btn-primary">Ver notas</button>
        </div>
    </div>
</form>
```

### Otros campos

```html
<!-- Número con decimales -->
<input type="number" name="txtPrecio" class="form-control" min="0" step="0.01">

<!-- Con símbolo al lado -->
<div class="input-group">
    <input type="number" name="txtPrecio" class="form-control" step="0.01">
    <span class="input-group-text">€</span>
</div>

<!-- Fecha / hora / correo / contraseña -->
<input type="date" name="dtFecha" class="form-control">
<input type="datetime-local" name="dtFechaHora" class="form-control">
<input type="email" name="txtEmail" class="form-control">
<input type="password" name="txtClave" class="form-control">

<!-- Desplegable (se rellena desde JS) -->
<select name="lstGenero" class="form-select"></select>

<!-- Radios en línea (mismo name = solo uno marcado) -->
<div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" name="rdoOrden" id="rdoTitulo" value="titulo" checked>
    <label class="form-check-label" for="rdoTitulo">Título</label>
</div>
<div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" name="rdoOrden" id="rdoPrecio" value="precio">
    <label class="form-check-label" for="rdoPrecio">Precio</label>
</div>

<!-- Casilla -->
<div class="form-check">
    <input class="form-check-input" type="checkbox" name="chkAcepto" id="chkAcepto">
    <label class="form-check-label" for="chkAcepto">Acepto las condiciones</label>
</div>
```

### Botón: `type="button"` o `type="submit"`

- `type="button"`: no recarga la página. Se escucha el `click`. Es lo más cómodo.
- `type="submit"`: hay que escuchar el `submit` del formulario y llamar a `evento.preventDefault()` o se recarga la página.

## 4. CSS y fuente local

La plantilla ya trae la regla que oculta los formularios y, si hay fuente, el `@font-face`. Solo hay que **usarla**:

```css
/* Viene en la plantilla: los formularios empiezan ocultos */
form {
    display: none;
}

/* Fuente local en formularios y listados (tras cargar Bootstrap) */
body, input, select, textarea, button {
    font-family: 'Anta', sans-serif;
}
```

Si hubiera que definirla tú (la ruta es relativa al propio `.css`):

```css
@font-face {
    font-family: 'Anta';
    src: url('../fonts/Anta-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
```

> **Ojo:** los listados se escriben en una pestaña nueva. Si quieres que usen la fuente, esa página tiene que enlazar también `estilos.css` (ver `generarPagina` en la sección 6.5).

## 5. Apartado A: clases y gestor

### Clase con atributos privados, get/set y `toJSON()`

`JSON.stringify` **no ve** los atributos privados (`#`), por eso hace falta `toJSON()`: devuelve un objeto plano con los **nombres de las columnas** de la tabla.

```js
"use strict";

class Libro {
    #idlibro;
    #idgenero;
    #titulo;
    #autor;
    #descripcion;
    #imagen;

    constructor(idlibro, idgenero, titulo, autor, descripcion, imagen) {
        this.#idlibro = idlibro;
        this.#idgenero = idgenero;
        this.#titulo = titulo;
        this.#autor = autor;
        this.#descripcion = descripcion;
        this.#imagen = imagen;
    }

    get idlibro() { return this.#idlibro; }
    set idlibro(valor) { this.#idlibro = valor; }

    get idgenero() { return this.#idgenero; }
    set idgenero(valor) { this.#idgenero = valor; }

    get titulo() { return this.#titulo; }
    set titulo(valor) { this.#titulo = valor; }

    get autor() { return this.#autor; }
    set autor(valor) { this.#autor = valor; }

    get descripcion() { return this.#descripcion; }
    set descripcion(valor) { this.#descripcion = valor; }

    get imagen() { return this.#imagen; }
    set imagen(valor) { this.#imagen = valor; }

    toJSON() {
        return {
            idlibro: this.#idlibro,
            idgenero: this.#idgenero,
            titulo: this.#titulo,
            autor: this.#autor,
            descripcion: this.#descripcion,
            imagen: this.#imagen
        };
    }
}

class Genero {
    #idgenero;
    #genero;

    constructor(idgenero, genero) {
        this.#idgenero = idgenero;
        this.#genero = genero;
    }

    get idgenero() { return this.#idgenero; }
    set idgenero(valor) { this.#idgenero = valor; }

    get genero() { return this.#genero; }
    set genero(valor) { this.#genero = valor; }

    toJSON() {
        return { idgenero: this.#idgenero, genero: this.#genero };
    }
}
```

La de las notas (tabla `notas`: idnota, titulo, texto, fcreacion, urlimagen):

```js
class Nota {
    #idnota;
    #titulo;
    #texto;
    #fcreacion;
    #urlimagen;

    constructor(idnota, titulo, texto, fcreacion, urlimagen) {
        this.#idnota = idnota;
        this.#titulo = titulo;
        this.#texto = texto;
        this.#fcreacion = fcreacion;
        this.#urlimagen = urlimagen;
    }

    get idnota() { return this.#idnota; }
    set idnota(valor) { this.#idnota = valor; }

    get titulo() { return this.#titulo; }
    set titulo(valor) { this.#titulo = valor; }

    get texto() { return this.#texto; }
    set texto(valor) { this.#texto = valor; }

    get fcreacion() { return this.#fcreacion; }
    set fcreacion(valor) { this.#fcreacion = valor; }

    get urlimagen() { return this.#urlimagen; }
    set urlimagen(valor) { this.#urlimagen = valor; }

    toJSON() {
        return {
            idnota: this.#idnota,
            titulo: this.#titulo,
            texto: this.#texto,
            fcreacion: this.#fcreacion,
            urlimagen: this.#urlimagen
        };
    }
}
```

> Si en clase usáis la convención con guion bajo (`this._titulo`), el patrón es el mismo: `get titulo() { return this._titulo; }` y `set titulo(valor) { this._titulo = valor; }`. En ese caso `JSON.stringify` sí ve los atributos, pero el enunciado pide `toJSON()` igualmente.

### Gestor (examen de la librería, respuesta `{ok, mensaje, datos}`)

Reglas que lo hacen funcionar:

- **POST** → `peticionPOST` · **GET** → `peticionGET`.
- Los parámetros van siempre en un `FormData`, **también en GET** (`peticionGET` lo recorre: si le pasas `undefined`, falla). Sin parámetros: `new FormData()`.
- El **nombre del parámetro** (`"libro"`, `"idgenero"`...) tiene que coincidir con lo que lee el PHP.
- Dentro del `try` se usa `return await`; si pones solo `return`, el error se escapa del `catch`.
- Así los métodos devuelven siempre `{ok, mensaje, datos}`, incluso con el servidor caído.

```js
// En el examen de la librería la clase se llama GestorNotas aunque gestione libros: usa el nombre del enunciado
class GestorNotas {

    async crearLibro(oLibro) {
        try {
            const datos = new FormData();
            datos.append("libro", JSON.stringify(oLibro));      // usa toJSON()
            return await peticionPOST("crear_libro.php", datos);
        } catch (error) {
            return this.#respuestaError(error);
        }
    }

    async getLibrosGenero(idgenero) {
        try {
            const datos = new FormData();
            datos.append("idgenero", idgenero);
            return await peticionGET("get_libros_genero.php", datos);
        } catch (error) {
            return this.#respuestaError(error);
        }
    }

    async getGeneros() {
        try {
            return await peticionGET("get_generos.php", new FormData());
        } catch (error) {
            return this.#respuestaError(error);
        }
    }

    #respuestaError(error) {
        return { ok: false, mensaje: "No se ha podido contactar con el servidor: " + error.message, datos: null };
    }
}
```

### Gestor (examen de las notas, respuesta `{error, mensaje, datos}`)

Aquí el booleano es `error` y significa **lo contrario** que `ok`: `error: false` = todo bien.

```js
class GestorNotas {

    async crearNota(oNota) {
        try {
            const datos = new FormData();
            datos.append("nota", JSON.stringify(oNota));          // nombre del parámetro: míralo en crear_nota.php
            return await peticionPOST("crear_nota.php", datos);
        } catch (error) {
            return { error: true, mensaje: "No se ha podido contactar con el servidor: " + error.message, datos: null };
        }
    }

    async getNotasFecha(fechaInicio) {
        try {
            const datos = new FormData();
            datos.append("fechaInicio", fechaInicio);             // idem: míralo en get_notas_fecha.php
            return await peticionGET("get_notas_fecha.php", datos);
        } catch (error) {
            return { error: true, mensaje: "No se ha podido contactar con el servidor: " + error.message, datos: null };
        }
    }
}
```

## 6. Apartado B: programa principal

### 6.1 Arranque (`codigo.js`)

Mira en el `index.html` los ids reales del menú y de los formularios.

```js
"use strict";

const oGestor = new GestorNotas();                                  // clase del gestor de este examen
const frmCrear = document.getElementById("frmCrearLibro");          // id del formulario de crear
const frmListado = document.getElementById("frmListado");           // id del formulario del listado
```

### 6.2 Visibilidad de los formularios (que no se vean a la vez)

Se usa `style.display` porque el CSS tiene `form { display: none; }`.

```js
function mostrarFormulario(formulario) {
    frmCrear.style.display = "none";
    frmListado.style.display = "none";
    formulario.style.display = "block";
}

// El enlace del menú es href="#": preventDefault evita que salte al inicio de la página
document.getElementById("mnuCrear").addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarFormulario(frmCrear);
});

document.getElementById("mnuListado").addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarFormulario(frmListado);
});
```

### 6.3 Cargar los desplegables

`new Option(texto, valor)` crea un `<option>`. Cada desplegable necesita sus **propios** nodos, por eso se crean dentro del bucle.

```js
async function cargarDesplegables() {
    const respuesta = await oGestor.getGeneros();

    if (!respuesta.ok) {
        alert("No se han podido cargar los géneros: " + respuesta.mensaje);
        return;
    }

    for (const desplegable of [frmCrear.lstGenero, frmListado.lstGenero]) {
        desplegable.replaceChildren(
            ...respuesta.datos.map(g => new Option(g.genero, g.idgenero))   // (texto, valor)
        );
    }
}

cargarDesplegables();   // al final del fichero, para que se ejecute al cargar la página
```

Variante con `innerHTML` y una primera opción vacía:

```js
let opciones = `<option value="">Selecciona...</option>`;
for (const g of respuesta.datos) {
    opciones += `<option value="${g.idgenero}">${g.genero}</option>`;
}
frmCrear.lstGenero.innerHTML = opciones;
frmListado.lstGenero.innerHTML = opciones;
```

### 6.4 Crear un registro

Orden de la lógica: confirmar (si lo piden) → construir el objeto → enviar → `alert` con el mensaje → **solo si hay éxito**, resetear y ocultar. Con error no se toca nada (el usuario ve sus datos).

```js
async function crearLibro() {
    if (!confirm("¿Seguro que quieres crear el libro?")) {
        return;                                          // solo si el enunciado pide confirmación
    }

    const oLibro = new Libro(
        null,                                            // idlibro: lo genera la base de datos
        Number(frmCrear.lstGenero.value),                // Number(): el select devuelve texto
        frmCrear.txtTitulo.value,
        frmCrear.txtAutor.value,
        frmCrear.txtDescripcion.value,
        frmCrear.txtImagen.value
    );

    const respuesta = await oGestor.crearLibro(oLibro);

    alert(respuesta.mensaje);

    if (respuesta.ok) {                                  // en el examen de las notas: if (!respuesta.error)
        frmCrear.reset();
        frmCrear.style.display = "none";
    }
}

document.getElementById("btnCrear").addEventListener("click", crearLibro);
```

Para el examen de las notas, la fecha de creación se genera al crear (formato `DATETIME` de MySQL):

```js
function fechaHoraMySQL(fecha = new Date()) {
    const dos = (n) => String(n).padStart(2, "0");
    return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())} ` +
           `${dos(fecha.getHours())}:${dos(fecha.getMinutes())}:${dos(fecha.getSeconds())}`;
}

// new Nota(null, titulo, texto, fechaHoraMySQL(), urlimagen)
```

### 6.5 Listado en una pestaña nueva

Tres ideas clave:

1. `window.open("", "_blank")` se llama **antes** del `await`; si no, el navegador puede bloquearla como ventana emergente.
2. Se escribe con `ventana.document.write(html)` y se termina con `ventana.document.close()`.
3. La pestaña nueva es `about:blank`: las rutas relativas no valen. Se usan **URL absolutas** con `new URL(ruta, document.baseURI)`.

Utilidades:

```js
// Evita que un texto de la base de datos se interprete como HTML
function escaparHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

// "2024-02-19" o "2024-02-19 23:59:25"  →  "19/02/2024"
function formatearFecha(fecha) {
    return fecha.split(" ")[0].split("-").reverse().join("/");
}

// 24.99 → "24,99 €"   (MySQL devuelve el DECIMAL como texto: pasa por Number() antes)
const formatoEuros = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
```

Página completa de la pestaña nueva (enlaza Bootstrap y tu CSS):

```js
function generarPagina(titulo, contenido) {
    const ruta = (r) => new URL(r, document.baseURI).href;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escaparHTML(titulo)}</title>
    <link rel="stylesheet" href="${ruta("bootstrap/css/bootstrap.min.css")}">
    <link rel="stylesheet" href="${ruta("css/estilos.css")}">
</head>
<body>
    <main class="container my-4">
        <h2 class="mb-4">${escaparHTML(titulo)}</h2>
        ${contenido}
    </main>
</body>
</html>`;
}
```

Proceso completo (librería: tarjetas de los libros del género elegido):

```js
async function mostrarListado() {
    const select = frmListado.lstGenero;

    if (select.selectedIndex < 0) {
        alert("No hay géneros cargados.");
        return;
    }

    const idgenero = select.value;
    const nombreGenero = select.options[select.selectedIndex].text;   // texto de la opción marcada

    const ventana = window.open("", "_blank");                        // ANTES del await
    if (!ventana) {
        alert("El navegador ha bloqueado la pestaña nueva. Permite las ventanas emergentes.");
        return;
    }

    const respuesta = await oGestor.getLibrosGenero(idgenero);

    if (!respuesta.ok) {
        ventana.close();
        alert(respuesta.mensaje);
        return;
    }

    ventana.document.write(generarPagina(
        "LISTADO DE LIBROS DEL GÉNERO " + nombreGenero,
        generarTarjetasLibros(respuesta.datos)
    ));
    ventana.document.close();
}

document.getElementById("btnListar").addEventListener("click", mostrarListado);
```

Tarjetas de libros (el campo del género depende del PHP: mira `console.table(respuesta.datos)`):

```js
function generarTarjetasLibros(libros) {
    if (libros.length === 0) {
        return `<div class="alert alert-warning">No hay libros de este género.</div>`;
    }

    return `<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">` +
        libros.map(l => `
        <div class="col">
            <div class="card h-100">
                <img src="${escaparHTML(l.imagen)}" class="card-img-top" alt="Portada de ${escaparHTML(l.titulo)}">
                <div class="card-body">
                    <h5 class="card-title">${escaparHTML(l.titulo)}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${escaparHTML(l.autor)}</h6>
                    <p class="small text-muted mb-1">${escaparHTML(l.genero)}</p>
                    <p class="card-text">${escaparHTML(l.descripcion)}</p>
                </div>
            </div>
        </div>`).join("") +
        `</div>`;
}
```

Examen de las notas: 4 columnas en escritorio (`lg`), 2 en móvil (`xs`), orden por `FCREACION` descendente, título con la fecha:

```js
function generarTarjetasNotas(notas) {
    // Orden por fecha de creación descendente (si el PHP no lo hace ya). El texto "aaaa-mm-dd hh:mm:ss" se ordena bien como texto
    notas.sort((a, b) => b.fcreacion.localeCompare(a.fcreacion));

    return `<div class="row row-cols-2 row-cols-lg-4 g-3">` +
        notas.map(n => `
        <div class="col">
            <div class="card h-100">
                <img src="${escaparHTML(n.urlimagen)}" class="card-img-top" alt="">
                <div class="card-body">
                    <h6 class="card-title">${n.idnota} - ${escaparHTML(n.titulo)}</h6>
                    <p class="card-text small">${escaparHTML(n.texto)}</p>
                </div>
                <div class="card-footer"><small class="text-muted">${escaparHTML(n.fcreacion)}</small></div>
            </div>
        </div>`).join("") +
        `</div>`;
}

async function mostrarNotas() {
    const fechaInicio = frmVerNotas.dtFecha.value;                    // "aaaa-mm-dd" (input type="date")

    const ventana = window.open("", "_blank");
    if (!ventana) {
        alert("El navegador ha bloqueado la pestaña nueva.");
        return;
    }

    const respuesta = await oGestor.getNotasFecha(fechaInicio);

    if (respuesta.error) {                                            // aquí el booleano es "error"
        ventana.close();
        alert(respuesta.mensaje);
        return;
    }

    // Título con la fecha que ha escrito el usuario (si la piden como 01-01-2024: fechaInicio.split("-").reverse().join("-"))
    ventana.document.write(generarPagina("Notas desde " + fechaInicio, generarTarjetasNotas(respuesta.datos)));
    ventana.document.close();
}
```

Listado en **tabla** (videojuegos: precio con € y fecha `dd/mm/aaaa`, resaltar filas de menos de 20 €):

```js
function generarTablaVideojuegos(videojuegos) {
    if (videojuegos.length === 0) {
        return `<div class="alert alert-warning">No hay videojuegos para esta plataforma.</div>`;
    }

    const filas = videojuegos.map(v => {
        const precio = Number(v.precio);                              // llega como texto desde MySQL
        return `
            <tr class="${precio < 20 ? "table-success" : ""}">
                <td><img src="${escaparHTML(v.portada)}" alt="" class="img-thumbnail" style="width: 60px;"></td>
                <td>${escaparHTML(v.titulo)}</td>
                <td>${escaparHTML(v.desarrolladora)}</td>
                <td class="text-end">${formatoEuros.format(precio)}</td>
                <td>${formatearFecha(v.fechalanzamiento)}</td>
            </tr>`;
    }).join("");

    return `
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-dark">
                    <tr><th>Portada</th><th>Título</th><th>Desarrolladora</th><th class="text-end">Precio</th><th>Lanzamiento</th></tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        </div>`;
}
```

Leer el radio marcado (ordenar por título / precio):

```js
const orden = frmListado.rdoOrden.value;     // valor del radio marcado: "titulo" o "precio"
```

## 7. Apartado C: rejillas y tarjetas

### Puntos de corte (mobile-first)

Una clase sin prefijo vale **desde xs hacia arriba**; `-md-` vale **desde md hacia arriba**.

| Prefijo | Ancho mínimo | Dispositivo |
|---|---|---|
| (ninguno) = xs | 0 | móvil |
| `sm` | 576 px | móvil grande |
| `md` | 768 px | tablet |
| `lg` | 992 px | escritorio |
| `xl` | 1200 px | escritorio grande |
| `xxl` | 1400 px | pantalla muy grande |

### Recetas de rejilla

```html
<!-- 2 por fila en móvil y 4 por fila en escritorio (lg) -->
<div class="row row-cols-2 row-cols-lg-4 g-3"> ... </div>

<!-- XS apiladas · MD 3 por fila · LG 4 por fila -->
<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3"> ... </div>

<!-- Lo mismo contando columnas (la fila tiene 12): 12/4 = 3 por fila, 12/3 = 4 por fila -->
<div class="row g-3">
    <div class="col-12 col-md-4 col-lg-3"> ... </div>
</div>

<!-- Dos columnas a partir de lg, apiladas por debajo -->
<div class="row g-4">
    <div class="col-12 col-lg-6"> ... </div>
    <div class="col-12 col-lg-6"> ... </div>
</div>
```

`g-3` es el espacio entre columnas; `h-100` en la tarjeta hace que todas de una fila midan lo mismo.

### Tarjeta

```html
<div class="col">
    <div class="card h-100">
        <img src="https://placehold.co/300x400/png?text=Portada" class="card-img-top" alt="Portada">
        <div class="card-body">
            <h5 class="card-title">El señor de los anillos</h5>
            <h6 class="card-subtitle mb-2 text-muted">J.R.R. Tolkien</h6>
            <p class="small text-muted mb-1">Ficción épica</p>
            <p class="card-text">La épica lucha entre el bien y el mal en la Tierra Media.</p>
        </div>
        <div class="card-footer"><small class="text-muted">2024-02-19 23:59:25</small></div>   <!-- opcional -->
    </div>
</div>
```

Tarjeta horizontal (imagen a la izquierda):

```html
<div class="card mb-3">
    <div class="row g-0">
        <div class="col-md-4">
            <img src="imagen.jpg" class="img-fluid rounded-start" alt="">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">Título</h5>
                <p class="card-text">Texto de la tarjeta.</p>
            </div>
        </div>
    </div>
</div>
```

Otras partes de una tarjeta: `card-header`, `card-footer`, `list-group list-group-flush` dentro de la tarjeta, `card-img-overlay` (texto sobre la imagen), `card-link` (enlaces), `text-bg-primary` o `bg-primary text-white` (color).

## 8. Componentes de Bootstrap

Todos los que se abren, cierran o animan necesitan **`bootstrap.bundle.min.js`**.

### Navbar (se colapsa por debajo de `md` tras el botón de hamburguesa)

```html
<nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
    <div class="container">
        <a class="navbar-brand" href="#">GameStore</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal"
                aria-controls="menuPrincipal" aria-expanded="false" aria-label="Mostrar u ocultar el menú">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="menuPrincipal">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Inicio</a></li>
                <li class="nav-item"><a class="nav-link" href="#novedades">Novedades</a></li>
                <li class="nav-item"><a class="nav-link" href="#plataformas">Plataformas</a></li>
            </ul>
        </div>
    </div>
</nav>
```

`navbar-expand-md` = expandido desde md (colapsado por debajo). `ms-auto` empuja los enlaces a la derecha.

### Carrusel (indicadores, diapositivas con pie y controles)

```html
<div id="carrusel" class="carousel slide">
    <div class="carousel-indicators">
        <button type="button" data-bs-target="#carrusel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Diapositiva 1"></button>
        <button type="button" data-bs-target="#carrusel" data-bs-slide-to="1" aria-label="Diapositiva 2"></button>
        <button type="button" data-bs-target="#carrusel" data-bs-slide-to="2" aria-label="Diapositiva 3"></button>
    </div>

    <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="https://placehold.co/800x450/png?text=Uno" class="d-block w-100" alt="Uno">
            <div class="carousel-caption d-block bg-dark bg-opacity-75 rounded">
                <h5>Título</h5>
                <p>24,99 €</p>
            </div>
        </div>
        <div class="carousel-item">
            <img src="https://placehold.co/800x450/png?text=Dos" class="d-block w-100" alt="Dos">
            <div class="carousel-caption d-block bg-dark bg-opacity-75 rounded"><h5>Título</h5><p>59,99 €</p></div>
        </div>
        <div class="carousel-item">
            <img src="https://placehold.co/800x450/png?text=Tres" class="d-block w-100" alt="Tres">
            <div class="carousel-caption d-block bg-dark bg-opacity-75 rounded"><h5>Título</h5><p>69,99 €</p></div>
        </div>
    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#carrusel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carrusel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
    </button>
</div>
```

Solo **una** diapositiva (y un indicador) lleva `active`. Para que pase sola: `class="carousel slide" data-bs-ride="carousel"`. Efecto de fundido: añade `carousel-fade`.

### Acordeón (solo un panel abierto a la vez gracias a `data-bs-parent`)

```html
<div class="accordion" id="acordeon">

    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panel1"
                    aria-expanded="true" aria-controls="panel1">PC</button>
        </h2>
        <div id="panel1" class="accordion-collapse collapse show" data-bs-parent="#acordeon">
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Hades <span class="badge bg-primary rounded-pill">24,99 €</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Hollow Knight <span class="badge bg-primary rounded-pill">14,99 €</span>
                </li>
            </ul>
        </div>
    </div>

    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panel2"
                    aria-expanded="false" aria-controls="panel2">PlayStation 5</button>
        </h2>
        <div id="panel2" class="accordion-collapse collapse" data-bs-parent="#acordeon">
            <div class="accordion-body">Contenido del segundo panel</div>
        </div>
    </div>

</div>
```

El panel abierto lleva `show` y su botón **no** lleva `collapsed`; los demás, al revés. Si quitas `data-bs-parent`, se pueden abrir varios a la vez. Con `list-group` + `badge` a la derecha: `d-flex justify-content-between align-items-center` en el `li`.

### Modal

```html
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCondiciones">
    Condiciones de compra
</button>

<div class="modal fade" id="modalCondiciones" tabindex="-1" aria-labelledby="tituloModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="tituloModal">Condiciones de compra</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
                <p class="mb-0">Texto del modal.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>
```

Desde JavaScript:

```js
const modal = new bootstrap.Modal(document.getElementById("modalCondiciones"));
modal.show();
modal.hide();
```

### Tabla, alertas y botones

```html
<table class="table table-striped table-hover table-bordered align-middle">
    <thead class="table-dark">
        <tr><th>#</th><th>Título</th><th class="text-end">Precio</th></tr>
    </thead>
    <tbody>
        <tr><td>1</td><td>Hades</td><td class="text-end">24,99 €</td></tr>
        <tr class="table-success"><td>2</td><td>Hollow Knight</td><td class="text-end">14,99 €</td></tr>
    </tbody>
</table>
<!-- Que no se salga en móvil: envuelve la tabla en <div class="table-responsive"> -->

<div class="alert alert-success">Todo correcto</div>
<div class="alert alert-warning">Aviso</div>
<div class="alert alert-danger">Error</div>
<div class="alert alert-info">Información</div>

<button class="btn btn-primary">Primario</button>
<button class="btn btn-outline-secondary btn-sm">Contorno pequeño</button>
<button class="btn btn-danger btn-lg w-100">Ancho completo</button>
```

Colores contextuales: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`. Sirven con `btn-`, `alert-`, `table-`, `bg-`, `text-`, `badge bg-`.

### Más componentes por si caen

```html
<!-- Collapse suelto -->
<button class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#detalle" aria-expanded="false" aria-controls="detalle">Mostrar / ocultar</button>
<div class="collapse mt-2" id="detalle"><div class="card card-body">Contenido</div></div>

<!-- Desplegable -->
<div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Menú</button>
    <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Acción</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#">Otra acción</a></li>
    </ul>
</div>

<!-- Pestañas -->
<ul class="nav nav-tabs" role="tablist">
    <li class="nav-item" role="presentation">
        <button class="nav-link active" id="tab1-tab" data-bs-toggle="tab" data-bs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">Uno</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link" id="tab2-tab" data-bs-toggle="tab" data-bs-target="#tab2" type="button" role="tab" aria-controls="tab2" aria-selected="false">Dos</button>
    </li>
</ul>
<div class="tab-content p-3 border border-top-0">
    <div class="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab" tabindex="0">Contenido 1</div>
    <div class="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab" tabindex="0">Contenido 2</div>
</div>

<!-- Panel lateral -->
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#panelLateral" aria-controls="panelLateral">Abrir panel</button>
<div class="offcanvas offcanvas-start" tabindex="-1" id="panelLateral" aria-labelledby="tituloPanel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="tituloPanel">Panel</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
    </div>
    <div class="offcanvas-body">Contenido</div>
</div>

<!-- Barra de progreso y spinner -->
<div class="progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar" style="width: 60%">60%</div>
</div>
<div class="spinner-border" role="status"><span class="visually-hidden">Cargando...</span></div>

<!-- Aviso emergente (toast): hay que mostrarlo con JS -->
<div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="miToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong class="me-auto">Aviso</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
        <div class="toast-body">Mensaje</div>
    </div>
</div>
```

```js
bootstrap.Toast.getOrCreateInstance(document.getElementById("miToast")).show();
```

### Utilidades más usadas

| Qué | Clases |
|---|---|
| Márgenes y rellenos | `m-3` `mt-2` `mb-4` `mx-auto` `p-3` `py-2` `ps-2` (valores 0 a 5; `auto` en márgenes) |
| Flex | `d-flex` `justify-content-between` `justify-content-center` `align-items-center` `gap-2` `flex-wrap` `flex-column` |
| Mostrar / ocultar | `d-none` `d-md-block` (oculto en móvil, visible desde md) `visually-hidden` |
| Texto | `text-center` `text-end` `fw-bold` `fst-italic` `text-uppercase` `small` `h1` a `h6` `text-muted` |
| Color | `text-primary` `text-white` `bg-light` `bg-dark` `bg-success` `bg-opacity-75` |
| Bordes y sombras | `border` `rounded` `rounded-pill` `shadow` |
| Tamaño e imágenes | `w-100` `h-100` `img-fluid` `img-thumbnail` |
| Posición | `sticky-top` `fixed-top` `position-relative` |
| Contenedor | `container` (centrado con ancho máximo) · `container-fluid` (todo el ancho) |

> **Versiones:** las clases de esta chuleta funcionan en toda la 5.x. Si tu Bootstrap es la 5.3 también puedes usar `text-body-secondary`, `bg-info-subtle`, `text-bg-primary` y `data-bs-theme="dark"`, que en versiones anteriores no existen.

## 9. JavaScript esencial

### DOM

```js
document.getElementById("id");                   // un elemento por id
document.querySelector(".clase");                // el primero que coincide con el selector CSS
document.querySelectorAll("tr.activa");          // todos (se recorre con for...of)

elemento.textContent = "texto";                  // texto plano (seguro)
elemento.innerHTML = "<b>html</b>";              // interpreta HTML (cuidado con datos externos)
elemento.classList.add("d-none");                // también remove, toggle("x"), contains("x")
elemento.style.display = "none";                 // "block", "flex", ""...
elemento.setAttribute("src", "foto.png");
elemento.dataset.id;                             // lee data-id="..."

const li = document.createElement("li");         // crear nodos
li.textContent = "Nuevo";
lista.appendChild(li);                           // o lista.append(li)
lista.replaceChildren();                         // vaciar (o reemplazar con nodos nuevos)
li.remove();
```

### Eventos

```js
boton.addEventListener("click", () => { /* ... */ });
select.addEventListener("change", () => { /* ... */ });         // select, radios, checkbox
input.addEventListener("input", () => { /* ... */ });           // cada tecla
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();                              // evita recargar la página
});
enlace.addEventListener("click", (evento) => evento.preventDefault());

// Si el <script> está en el <head> en vez de al final del body:
document.addEventListener("DOMContentLoaded", () => { /* ... */ });
```

### Leer y escribir formularios

```js
formulario.txtTitulo.value                         // input / textarea / select (por su atributo name)
formulario.txtTitulo.value = "";
formulario.chkAcepto.checked                       // casilla: true / false
formulario.rdoOrden.value                          // radio marcado (su value)
select.value                                       // value de la opción marcada
select.options[select.selectedIndex].text          // TEXTO de la opción marcada
select.selectedIndex                               // posición (-1 si no hay opciones)
formulario.reset();                                // vuelve a los valores iniciales
```

### Arrays

```js
const nums = [3, 1, 2];

nums.map(n => n * 2);                      // transforma cada elemento → [6, 2, 4]
nums.filter(n => n > 1);                   // los que cumplen → [3, 2]
nums.find(n => n > 1);                     // el primero que cumple → 3 (o undefined)
nums.some(n => n > 2);                     // ¿alguno cumple? → true
nums.every(n => n > 0);                    // ¿todos cumplen? → true
nums.includes(2);                          // ¿está? → true
nums.reduce((total, n) => total + n, 0);   // acumula → 6
nums.join(", ");                           // "3, 1, 2"
nums.slice(0, 2);                          // copia parcial → [3, 1]
Math.max(...nums);                         // 3

// sort MODIFICA el array; copia primero con [...arr] si no quieres tocar el original
[...nums].sort((a, b) => a - b);                              // numérico ascendente
[...nums].sort((a, b) => b - a);                              // numérico descendente
lista.sort((a, b) => a.titulo.localeCompare(b.titulo));       // texto A → Z
lista.sort((a, b) => b.fecha.localeCompare(a.fecha));         // fecha "aaaa-mm-dd..." más reciente primero
```

### Textos, números y fechas

```js
const nombre = "Ana";
`Hola ${nombre}, tienes ${2 + 3} años`;               // plantillas con comillas invertidas
"  hola ".trim();                                     // "hola"
"hola".toUpperCase();                                 // "HOLA"
"a-b-c".split("-");                                   // ["a", "b", "c"]
"5".padStart(2, "0");                                 // "05"
"2024-02-19".split("-").reverse().join("/");          // "19/02/2024"
"a.b.c".replaceAll(".", "-");                         // "a-b-c"

Number("24.99");                                      // 24.99 (NaN si no es número)
parseInt("42px", 10);                                 // 42
(24.5).toFixed(2);                                    // "24.50" (devuelve TEXTO)
Number.isNaN(Number("abc"));                          // true

new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(24.99);   // "24,99 €"

const hoy = new Date();
hoy.getFullYear();  hoy.getMonth() + 1;  hoy.getDate();      // el mes empieza en 0
hoy.getHours();  hoy.getMinutes();  hoy.getSeconds();
hoy.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });   // "19/02/2024"
```

Hoy en formato `aaaa-mm-dd` (el que usa `input type="date"`), en hora local:

```js
const dos = (n) => String(n).padStart(2, "0");
const hoy = new Date();
const fechaISO = `${hoy.getFullYear()}-${dos(hoy.getMonth() + 1)}-${dos(hoy.getDate())}`;
```

### Objetos y JSON

```js
const { ok, mensaje, datos } = respuesta;             // desestructurar
const copia = { ...objeto, titulo: "Nuevo" };         // copiar y cambiar campos

JSON.stringify({ a: 1 });                             // '{"a":1}'   (usa toJSON() si existe)
JSON.parse('{"a":1}');                                // { a: 1 }
```

### Asíncrono: async / await / fetch / try-catch

```js
async function ejemplo() {
    try {
        const respuesta = await oGestor.getGeneros();      // espera la respuesta del servidor
        console.log(respuesta);
    } catch (error) {
        console.error(error.message);
    }
}
```

Si no hubiera `ajax.js`, así se hace a mano:

```js
// GET con parámetros en la URL
const url = new URL("http://localhost/examen/backend/get_libros_genero.php");
url.searchParams.append("idgenero", 2);
const respuestaGET = await fetch(url);
const datosGET = await respuestaGET.json();

// POST con FormData
const datos = new FormData();
datos.append("libro", JSON.stringify(oLibro));
const respuestaPOST = await fetch("http://localhost/examen/backend/crear_libro.php", { method: "POST", body: datos });
const resultadoPOST = await respuestaPOST.json();

// Varias peticiones a la vez
const [generos, libros] = await Promise.all([oGestor.getGeneros(), oGestor.getLibrosGenero(1)]);
```

### Otros

```js
alert("Mensaje");
confirm("¿Seguro?");                                  // true / false
setTimeout(() => { /* ... */ }, 2000);                      // una vez, dentro de 2 s
const id = setInterval(() => { /* ... */ }, 1000);          // cada segundo
clearInterval(id);

localStorage.setItem("clave", JSON.stringify(objeto));
JSON.parse(localStorage.getItem("clave"));            // null si no existe
localStorage.removeItem("clave");

console.log(x);   console.table(arrayDeObjetos);   console.error("fallo");
```

## 10. Validación de formularios

Atributos HTML5: `required`, `minlength`, `maxlength`, `min`, `max`, `step`, `pattern="[0-9]{8}[A-Za-z]"`, y los tipos `email`, `url`, `number`, `date`.

Validación nativa con estilos de Bootstrap:

```html
<form id="frmValidar" class="needs-validation" novalidate>
    <input type="text" name="txtTitulo" class="form-control" required>
    <div class="invalid-feedback">El título es obligatorio.</div>
    <div class="valid-feedback">Correcto.</div>
    <button type="submit" class="btn btn-primary mt-2">Enviar</button>
</form>
```

```js
const form = document.getElementById("frmValidar");

form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!form.checkValidity()) {                // ¿cumplen todos los campos sus reglas?
        evento.stopPropagation();
    }
    form.classList.add("was-validated");        // Bootstrap pinta en verde / rojo
});
```

Con expresiones regulares:

```js
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reDNI = /^\d{8}[A-Za-z]$/;
const reTelefono = /^[6789]\d{8}$/;

reEmail.test("ana@correo.es");                  // true / false
```

Mensajes propios y marcar un campo como no válido:

```js
campo.setCustomValidity("Texto del error");     // con texto = no válido; con "" = válido
campo.reportValidity();                         // muestra el mensaje del navegador
campo.classList.add("is-invalid");              // o "is-valid"
```

## 11. Cómo leer los PHP del examen

Lo que haga el PHP decide **qué nombres** tienes que usar en JavaScript.

```php
$libro = json_decode($_POST["libro"], true);     // POST  → datos.append("libro", JSON.stringify(oLibro)) + peticionPOST
$idgenero = $_GET["idgenero"];                   // GET   → datos.append("idgenero", idgenero) + peticionGET
```

- `$_POST["x"]` / `$_GET["x"]`: el `"x"` es el primer argumento de `datos.append("x", ...)`.
- `json_decode(..., true)` sobre un parámetro: se envía con `JSON.stringify(oObjeto)`, y el objeto necesita `toJSON()`.
- Mira qué **claves** del JSON lee (`$libro["titulo"]`...): coinciden con las de `toJSON()`.
- Mira el `SELECT`: sus columnas (o los `AS`) son los **nombres de campo** que llegarán en `respuesta.datos` (`l.titulo`, `n.fcreacion`...).
- Si la respuesta usa `ok` o `error` (y con qué significado) también está ahí.

Para ver los datos reales: `console.table(respuesta.datos)`, o abre la URL del PHP en el navegador.

## 12. Depuración: errores típicos

Abre las herramientas de desarrollo con **F12**: pestaña *Consola* (errores) y *Red* (qué se envió y qué devolvió el PHP).

| Síntoma | Causa probable |
|---|---|
| `Failed to fetch` / `NetworkError` | Apache parado, `rutaBackend` mal (carpeta, puerto, barra final) o página abierta con `file://` |
| `Unexpected token '<' ... is not valid JSON` | El PHP devuelve un error o aviso en HTML en vez de JSON: abre la URL del PHP en el navegador |
| `Cannot read properties of undefined (reading 'value')` | `name` del campo mal escrito (`formulario.txtX`) o el campo no existe en el HTML |
| `X is not defined` / `X is not a constructor` | Orden de los scripts (ajax → objetos → codigo) o nombre de la clase mal escrito |
| `undefined` dentro de la tarjeta o la tabla | El campo se llama distinto en el PHP: `console.table(respuesta.datos)` |
| La pestaña nueva sale sin estilos ni fuente | Rutas relativas: usa URLs absolutas con `new URL(ruta, document.baseURI)` y enlaza `estilos.css` |
| El navegador no deja abrir la pestaña | Llama a `window.open` **antes** del `await` |
| El formulario no aparece | Con `form { display: none }` hay que usar `style.display = "block"`; `classList.remove("d-none")` no basta |
| Los dos formularios se ven a la vez | Falta ocultar uno al mostrar el otro (`mostrarFormulario`) |
| El PHP dice que el precio no es numérico | Envía `Number(...)`, no el texto del campo |
| `peticionGET` falla recorriendo `undefined` | Pasa siempre un `FormData` (vacío si no hay parámetros) |
| Salen acentos raros (`Ã³`) | Falta `<meta charset="UTF-8">` o el fichero no está guardado en UTF-8 |
| Carrusel, modal, acordeón o navbar no responden | Falta `bootstrap.bundle.min.js` (el bundle, no solo el CSS) |
| El `catch` no salta con el servidor caído | Estás haciendo `return peticionGET(...)` sin `await` dentro del `try` |

## 13. Checklist final

Antes de entregar, repasa:

- [ ] `rutaBackend` apunta a mi carpeta y es lo **único** que he tocado en `ajax.js`.
- [ ] El HTML solo tiene añadidos los campos del formulario de crear.
- [ ] Las clases están en `objetos.js` y el programa principal en `codigo.js`.
- [ ] Cada clase tiene constructor, get/set y `toJSON()` con los nombres de las columnas.
- [ ] Los métodos del gestor devuelven siempre `{ok, mensaje, datos}` (o `{error, ...}`), también cuando falla la red.
- [ ] Los formularios no se ven a la vez y empiezan ocultos.
- [ ] Los desplegables se rellenan al cargar la página.
- [ ] Crear: el resultado sale en un `alert`; con éxito se resetea **y** se oculta; con error no cambia nada.
- [ ] El listado sale en una **pestaña nueva** con el título exacto que pide el enunciado.
- [ ] Las tarjetas muestran **todos** los campos pedidos y en el orden pedido.
- [ ] Rejilla responsive correcta (`row-cols-*` / `col-*`) y comprobada reduciendo la ventana.
- [ ] Probé el caso "sin resultados" y el caso de error.
- [ ] Sin errores rojos en la consola (F12).
- [ ] La fuente local se ve en formularios y listados.
