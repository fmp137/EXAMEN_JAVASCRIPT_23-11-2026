<?php

include_once('/config.php');

try {
    $conexion = obtenerConexion();

    $idGenero = trim($_POST['idGenero']);
    $titulo = trim($_POST['titulo']);
    $autor = trim($_POST['autor']);
    $descripcion = trim($_POST['descripcion']);
    $imagen = trim($_POST['imagen']);

    // Prepared statement para insertar de forma segura
    $sql = "INSERT INTO `libro` (`idgenero`, `titulo`, `autor`, `descripcion`, `imagen`) VALUES (?, ?, ?, ?, ?);";
    $stmt = $conexion->prepare($sql);
    if (!$stmt) {
        throw new mysqli_sql_exception('Error al preparar la consulta: ' . $conexion->error);
    }

    // Bind y ejecución ('s' -> string)
    $stmt->bind_param('issss', $idGenero, $titulo, $autor, $descripcion, $imagen);
    if (!$stmt->execute()) {
        throw new mysqli_sql_exception('Error al ejecutar INSERT: ' . $stmt->error);
    }

    // Éxito
    responder(null, true, 'Se ha insertado el libro', $conexion);
} catch (mysqli_sql_exception $e) {
    // Responder con información controlada sobre el error de BBDD
    responder(null, false, 'Error en la base de datos: ' . $e->getMessage(), $conexion ?? null);
} catch (Exception $e) {
    responder(null, false, 'Error inesperado: ' . $e->getMessage(), $conexion ?? null);
}
