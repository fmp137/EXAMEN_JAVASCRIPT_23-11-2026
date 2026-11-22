<?php
// GET con parámetros:
//   idplataforma -> id de la plataforma
//   orden        -> "titulo" o "precio" (por defecto "titulo")
// Devuelve en "datos" un array de {idvideojuego, idplataforma, titulo, desarrolladora,
// precio, fechalanzamiento, portada, plataforma}, donde "plataforma" es el nombre.
require_once "conexion.php";

$idplataforma = isset($_GET["idplataforma"]) ? (int) $_GET["idplataforma"] : 0;
$orden = (($_GET["orden"] ?? "titulo") === "precio") ? "precio" : "titulo"; // lista blanca

try {
    $pdo = conectar();
    $sql = "SELECT v.idvideojuego, v.idplataforma, v.titulo, v.desarrolladora, v.precio,
                   v.fechalanzamiento, v.portada, p.nombre AS plataforma
            FROM videojuego v
            INNER JOIN plataforma p ON p.idplataforma = v.idplataforma
            WHERE v.idplataforma = :id
            ORDER BY v.$orden";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $idplataforma]);
    $filas = $stmt->fetchAll();

    responder(true, count($filas) . " videojuego(s) encontrado(s)", $filas);
} catch (PDOException $e) {
    responder(false, "Error de base de datos: " . $e->getMessage());
}
