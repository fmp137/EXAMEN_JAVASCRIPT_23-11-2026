<?php
// GET sin parámetros. Devuelve en "datos" un array de {idplataforma, nombre}.
require_once "conexion.php";

try {
    $pdo = conectar();
    $filas = $pdo->query("SELECT idplataforma, nombre FROM plataforma ORDER BY nombre")->fetchAll();
    responder(true, "Plataformas recuperadas correctamente", $filas);
} catch (PDOException $e) {
    responder(false, "Error de base de datos: " . $e->getMessage());
}
