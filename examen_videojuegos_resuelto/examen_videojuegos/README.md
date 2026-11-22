# Examen de práctica: tienda de videojuegos

Desarrollo de Interfaces · 2º DAM · JavaScript, AJAX y Bootstrap 5

Aplicación web para una pequeña tienda de videojuegos con dos entidades (plataformas y videojuegos).
El enunciado está en [`enunciado/examen_practica_tienda_videojuegos.pdf`](enunciado/examen_practica_tienda_videojuegos.pdf).

## Qué resuelve cada apartado

| Apartado | Fichero | Contenido |
|---|---|---|
| A (2 pt) | `js/objetos.js` | Clases `Videojuego` y `Plataforma` (atributos privados, get/set y `toJSON()`) y `GestorTienda` (`crearVideojuego`, `getVideojuegosPlataforma`, `getPlataformas`), todos devolviendo `{ok, mensaje, datos}` |
| B.1 (1,5 pt) | `js/codigo.js` | Visibilidad exclusiva de los formularios desde el menú y carga de los desplegables de plataformas |
| B.2 (2 pt) | `js/codigo.js` | Crear videojuego: `confirm()`, precio enviado como número, `alert` con el resultado, reseteo y ocultado solo si hay éxito |
| B.3 (2,5 pt) | `js/codigo.js` | Listado en pestaña nueva con tabla de Bootstrap: portada en miniatura, precio en € con dos decimales, fecha `dd/mm/aaaa`, filas de menos de 20 € resaltadas (`table-success`) y `alert-warning` si no hay resultados |
| C (2 pt) | `portada.html` | Navbar colapsable, carrusel, acordeón, modal y layout de dos columnas a partir de `lg` |

## Estructura

```
examen_videojuegos/
├── bootstrap/        Bootstrap 5.3.3 en local (css y js bundle)
├── css/estilos.css   Regla que oculta los formularios al inicio
├── enunciado/        Enunciado en PDF
├── js/
│   ├── ajax.js       peticionGET / peticionPOST (de la plantilla)
│   ├── objetos.js    Apartado A
│   └── codigo.js     Apartado B
├── php/              Backend (PDO): conexion, get_plataformas, get_videojuegos_plataforma, crear_videojuego
├── sql/tienda.sql    Base de datos con datos de ejemplo
├── index.html        Menú y formularios
└── portada.html      Apartado C
```

## Puesta en marcha

1. Copia la carpeta `examen_videojuegos` al directorio público del servidor (en XAMPP, `htdocs`).
2. Arranca Apache y MySQL e importa `sql/tienda.sql` desde phpMyAdmin (crea la base de datos `tienda`).
3. Si tu MySQL no es `root` sin contraseña, edita `php/conexion.php`.
4. Abre `http://localhost/examen_videojuegos/index.html` (por `http://localhost`, no con doble clic).
5. Si usas otra carpeta o puerto, cambia `rutaBackend` en `js/ajax.js`.

## Contrato del backend

Todos los scripts responden JSON `{ok, mensaje, datos}`.

| Script | Método | Parámetros | `datos` |
|---|---|---|---|
| `get_plataformas.php` | GET | — | `[{idplataforma, nombre}]` |
| `get_videojuegos_plataforma.php` | GET | `idplataforma`, `orden` (`titulo` o `precio`) | `[{idvideojuego, idplataforma, titulo, desarrolladora, precio, fechalanzamiento, portada, plataforma}]` |
| `crear_videojuego.php` | POST | `videojuego` (JSON de `toJSON()`) | `null` (error si el precio no es numérico) |

## Detalles que merece la pena recordar

- `JSON.stringify` no ve los atributos privados (`#`), por eso las clases necesitan `toJSON()`.
- `peticionGET` recorre un `FormData`, así que hay que pasarlo aunque vaya vacío.
- MySQL devuelve `DECIMAL` como texto (`"24.99"`): hay que convertirlo con `Number()` antes de comparar o formatear.
- La pestaña nueva se abre **antes** del `await` para que el navegador no la bloquee como ventana emergente, y se escribe después con los datos.
- La pestaña nueva es `about:blank`, por eso el `<link>` de Bootstrap usa una ruta absoluta.
- Los textos que vienen de la base de datos se escapan antes de insertarlos en el HTML.
