CREATE DATABASE IF NOT EXISTS prueba_node;

USE prueba_node;

CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER NOT NULL AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (username),
    UNIQUE KEY (email)
);

INSERT INTO usuarios (username, email)
VALUES
    ('Erik', 'erik@example.com'),
    ('Frida', 'frida@example.com'),
    ('David', 'david@example.com')
ON DUPLICATE KEY UPDATE
    email = VALUES(email);

-- Colección recomendada en MongoDB (usuario_perfiles)
-- {
--   usuarioId: Number,
--   bio: String,
--   intereses: [String],
--   ubicacion: String
-- }
-- Insertar ejemplos:
-- db.usuario_perfiles.insertMany([
--   { usuarioId: 1, bio: 'Desarrollador backend', intereses: ['node', 'mysql'], ubicacion: 'CDMX' },
--   { usuarioId: 2, bio: 'Diseñadora UX', intereses: ['figma', 'investigación'], ubicacion: 'Guadalajara' },
--   { usuarioId: 3, bio: 'Data engineer', intereses: ['etl', 'python'], ubicacion: 'Monterrey' }
-- ]);

-- Redis se usa como cache, no requiere estructura previa.
