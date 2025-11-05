# Configuración de conexiones a MySQL, MongoDB y Redis

Este proyecto expone la API de usuarios sobre tres almacenamientos diferentes:

- **MySQL** guarda los datos canónicos del usuario.
- **MongoDB** guarda información complementaria del perfil.
- **Redis** actúa como cache para respuestas frecuentes.

## Estado actual de la implementación

Las piezas siguientes ya están incluidas en el repositorio:

- `store/usuarios.js` combina registros de MySQL con perfiles de MongoDB y cachea las respuestas en Redis.
- `scripts/healthcheck.js` permite validar que las tres conexiones estén disponibles antes de levantar la API.
- Los gestores `store/_mysql.js`, `store/_mongo.js` y `store/_redis.js` centralizan la configuración de cada cliente.

Si se clona el repositorio y se prepara el entorno como se explica abajo, no hay cambios adicionales pendientes para disponer de la funcionalidad básica solicitada.

## Atributos esperados en cada base de datos

### MySQL

Tabla `usuarios` (ver `database.sql`):

| Columna     | Tipo          | Descripción                                  |
|-------------|---------------|----------------------------------------------|
| `id`        | `INT`         | Identificador autoincremental y llave primaria. |
| `username`  | `VARCHAR(30)` | Alias único del usuario.                     |
| `email`     | `VARCHAR(100)`| Correo único del usuario.                    |
| `created_at`| `TIMESTAMP`   | Fecha de creación, con valor por defecto `CURRENT_TIMESTAMP`. |

### MongoDB

Colección sugerida `usuario_perfiles`:

```json
{
  "usuarioId": Number,   // Debe coincidir con usuarios.id en MySQL
  "bio": String,         // Texto libre del perfil
  "intereses": [String], // Lista de intereses del usuario
  "ubicacion": String    // Ciudad o región del usuario
}
```

### Redis

No requiere estructura previa. Los controladores escriben:

- `usuarios:all` → Lista de usuarios serializada (respuesta de `GET /usuarios`).
- `usuarios:<id>` → Usuario individual serializado (respuesta de `GET /usuarios/:id`).

El TTL por defecto se controla con `REDIS_TTL` (segundos).

## Pasos para configurar las conexiones

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.dist .env
   ```
   Edita `.env` con las credenciales y hosts reales de tus servicios MySQL, MongoDB y Redis.

3. **Preparar datos de MySQL**
   ```bash
   mysql -u <usuario> -p < database.sql
   ```
   Esto crea la base `prueba_node`, la tabla `usuarios` y datos de ejemplo.

4. **Insertar perfiles en MongoDB**
   Ejecuta el siguiente bloque en tu instancia:
   ```javascript
   use prueba_node;
   db.usuario_perfiles.insertMany([
     { usuarioId: 1, bio: 'Desarrollador backend', intereses: ['node', 'mysql'], ubicacion: 'CDMX' },
     { usuarioId: 2, bio: 'Diseñadora UX', intereses: ['figma', 'investigación'], ubicacion: 'Guadalajara' },
     { usuarioId: 3, bio: 'Data engineer', intereses: ['etl', 'python'], ubicacion: 'Monterrey' }
   ]);
   ```

5. **Verificar conectividad**
   ```bash
   npm run check:connections
   ```
   El script realiza un `SELECT 1` contra MySQL, `ping` a MongoDB y `PING`/`PONG` en Redis.

6. **Levantar la API**
   ```bash
   npm start
   ```
   La API queda disponible en `http://localhost:3000`. Las rutas `/usuarios` y `/usuarios/:id` ya combinan la información de las tres fuentes.

## Próximos pasos opcionales

- Añadir endpoints de escritura (POST/PUT) que actualicen MySQL, sincronicen MongoDB y invaliden Redis.
- Dockerizar las tres bases de datos para automatizar el entorno de desarrollo.
- Implementar pruebas automatizadas para cada store y controlador.