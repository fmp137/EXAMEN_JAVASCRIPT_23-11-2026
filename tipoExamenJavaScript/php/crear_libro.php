<?php
require_once('config.php'); // Incluye obtenerConexion() y responder()

try {
    if (!isset($_POST["libro"])) {
        responder(null, false, "No se han recibido los datos del libro");
    }

    $libro = json_decode($_POST["libro"], true);

    if (
        !is_array($libro) ||
        !isset($libro["idgenero"], $libro["titulo"], $libro["autor"],
            $libro["descripcion"], $libro["imagen"])
    ) {
        responder(null, false, "Los datos del libro no tienen el formato esperado");
    }

    if (strlen($libro["imagen"]) > 1000) {
        responder(null, false, "La URL de la imagen es demasiado larga");
    }

    // Obtener conexión a la BBDD (usa la configuración centralizada)
    $conexion = obtenerConexion();

    $sql = "INSERT INTO libro (idgenero, titulo, autor, descripcion, imagen)
            VALUES (?, ?, ?, ?, ?)";
    $sentencia = $conexion->prepare($sql);
    $sentencia->bind_param(
        "issss",
        $libro["idgenero"],
        $libro["titulo"],
        $libro["autor"],
        $libro["descripcion"],
        $libro["imagen"]
    );
    $sentencia->execute();

    if ($sentencia->affected_rows !== 1) {
        $sentencia->close();
        responder(null, false, "No se ha podido registrar el libro", $conexion);
    }

    $sentencia->close();

    // responder() enviará un JSON con estructura { ok, datos, mensaje }
    // y cerrará la conexión si se le pasa.
    responder(null, true, "Libro guardado en la base de datos", $conexion);

} catch (mysqli_sql_exception $e) {
    // Errores específicos de mysqli (p. ej. problemas con la consulta o la conexión)
    // Enviamos un JSON de error. Usamos $conexion ?? null para evitar usar
    // una variable no definida si la conexión falló al crearse.
    responder(null, false, "Error en la base de datos: " . $e->getMessage(), $conexion ?? null);
} catch (Exception $e) {
    // Captura cualquier otra excepción / error inesperado
    responder(null, false, "Error general: " . $e->getMessage(), $conexion ?? null);
}
