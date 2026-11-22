-- Base de datos de la tienda de videojuegos (examen de práctica)
-- Importar desde phpMyAdmin (pestaña "Importar") o con: mysql -u root < tienda.sql

CREATE DATABASE IF NOT EXISTS tienda CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE tienda;

DROP TABLE IF EXISTS videojuego;
DROP TABLE IF EXISTS plataforma;

CREATE TABLE plataforma (
  idplataforma INT NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(30) NOT NULL,
  PRIMARY KEY (idplataforma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE videojuego (
  idvideojuego     INT NOT NULL AUTO_INCREMENT,
  idplataforma     INT NOT NULL,
  titulo           VARCHAR(100) NOT NULL,
  desarrolladora   VARCHAR(100) NOT NULL,
  precio           DECIMAL(6,2) NOT NULL,
  fechalanzamiento DATE NOT NULL,
  portada          VARCHAR(150) NOT NULL,
  PRIMARY KEY (idvideojuego),
  CONSTRAINT fk_videojuego_plataforma
    FOREIGN KEY (idplataforma) REFERENCES plataforma (idplataforma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO plataforma (idplataforma, nombre) VALUES
  (1, 'PC'),
  (2, 'PlayStation 5'),
  (3, 'Nintendo Switch'),
  (4, 'Xbox Series X');

-- Las portadas son imágenes de relleno (necesitan conexión a Internet).
INSERT INTO videojuego (idplataforma, titulo, desarrolladora, precio, fechalanzamiento, portada) VALUES
  (1, 'Hades',                       'Supergiant Games',    24.99, '2020-09-17', 'https://placehold.co/300x400/png?text=Hades'),
  (1, 'Hollow Knight',               'Team Cherry',         14.99, '2017-02-24', 'https://placehold.co/300x400/png?text=Hollow+Knight'),
  (2, 'God of War Ragnarök',         'Santa Monica Studio', 69.99, '2022-11-09', 'https://placehold.co/300x400/png?text=God+of+War'),
  (2, 'Elden Ring',                  'FromSoftware',        59.99, '2022-02-25', 'https://placehold.co/300x400/png?text=Elden+Ring'),
  (3, 'Zelda: Tears of the Kingdom', 'Nintendo',            59.99, '2023-05-12', 'https://placehold.co/300x400/png?text=Zelda+TotK'),
  (3, 'Super Mario Odyssey',         'Nintendo',            49.99, '2017-10-27', 'https://placehold.co/300x400/png?text=Mario+Odyssey'),
  (4, 'Forza Horizon 5',             'Playground Games',    59.99, '2021-11-09', 'https://placehold.co/300x400/png?text=Forza+Horizon+5'),
  (4, 'Halo Infinite',               '343 Industries',      59.99, '2021-12-08', 'https://placehold.co/300x400/png?text=Halo+Infinite');
