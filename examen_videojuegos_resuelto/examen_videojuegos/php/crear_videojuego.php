<?php
// POST con un parámetro "videojuego": el objeto Videojuego en JSON (lo que devuelve toJSON()).
//   {idvideojuego, idplataforma, titulo, desarrolladora, precio, fechalanzamiento, portada}
// El idvideojuego se ignora (lo genera la base de datos).
// El precio debe llegar como NÚMERO en el JSON; si llega como texto, se devuelve un error.
// Devuelve {ok, mensaje, datos: null}.
require_once "conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isset($_POST["videojuego"])) {
    responder(false, "Falta el parámetro 'videojuego' (POST)");
}

$v = json_decode($_POST["videojuego"], true);
if (!is_array($v)) {
    responder(false, "El videojuego recibido no es un JSON válido");
}

$precio = $v["precio"] ?? null;
if (!is_int($precio) && !is_float($precio)) {
    responder(false, "El precio debe enviarse como número");
}

try {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        "INSERT INTO videojuego (idplataforma, titulo, desarrolladora, precio, fechalanzamiento, portada)
         VALUES (:idplataforma, :titulo, :desarrolladora, :precio, :fecha, :portada)"
    );
    $stmt->execute([
        ":idplataforma"   => (int) ($v["idplataforma"] ?? 0),
        ":titulo"         => $v["titulo"] ?? "",
        ":desarrolladora" => $v["desarrolladora"] ?? "",
        ":precio"         => $precio,
        ":fecha"          => $v["fechalanzamiento"] ?? "",
        ":portada"        => $v["portada"] ?? "",
    ]);
    responder(true, "Videojuego creado correctamente (id " . $pdo->lastInsertId() . ")");
} catch (PDOException $e) {
    responder(false, "Error de base de datos: " . $e->getMessage());
}
