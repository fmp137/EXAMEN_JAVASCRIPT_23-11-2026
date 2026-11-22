<?php
// Configuración de la base de datos (valores por defecto de XAMPP: root sin contraseña)
const DB_HOST = "localhost";
const DB_NAME = "tienda";
const DB_USER = "root";
const DB_PASS = "";

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

/**
 * Envía la respuesta JSON {ok, mensaje, datos} y termina el script.
 */
function responder(bool $ok, string $mensaje, $datos = null): void
{
    echo json_encode(
        ["ok" => $ok, "mensaje" => $mensaje, "datos" => $datos],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

/**
 * Devuelve una conexión PDO a la base de datos (lanza PDOException si falla).
 */
function conectar(): PDO
{
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    return new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}
