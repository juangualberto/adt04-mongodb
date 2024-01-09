# Instalación y configuración de MongoDB

Para crear la infraestructura de servicios necesaria, en vez de instalar MongoDB, y como siempre hacemos, vamos a usar un contenedor para el servidor MongoDB y otro contenedor para Mongo-Express (una interfaz para interactuar con la base de datos).

Creamos la carpeta `stack` y dentro de ésta el archivo `docker-compose.yml` con el siguiente contenido: 

```yaml
# Use root/example as user/password credentials
version: '3.1'

services:

  mongo:
    image: mongo
    restart: 'no'
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: 83uddjfp0cmMD
    ports:
      - 27017:27017

  mongo-express:
    image: mongo-express
    restart: 'no'
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_BASICAUTH_USERNAME: mongo
      ME_CONFIG_BASICAUTH_PASSWORD: 83uddjfp0cmMD
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: 83uddjfp0cmMD
      ME_CONFIG_MONGODB_URL: mongodb://root:83uddjfp0cmMD@mongo:27017/
```

Aunque ya lo hemos visto anteriormente, este archivo `docker-compose.yml` lo utilizamos para definir y ejecutar servicios necesarios. Vamos a analizar las secciones y configuraciones de este archivo:

```yaml
version: '3.1'
```

Esta línea especifica la versión de la sintaxis de `docker-compose` que se está utilizando. En este caso, es la versión 3.1.

```yaml
services:
  mongo:
    image: mongo
    restart: 'no'
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: 83uddjfp0cmMD
    ports:
      - 27017:27017
```

Aquí se define un servicio llamado `mongo`. Este servicio utiliza la imagen oficial de MongoDB (`mongo`). Algunas configuraciones clave incluyen:

- `restart: 'no'`: Esto indica que el contenedor no se reiniciará automáticamente a menos que se haga manualmente.
- `environment`: Establece variables de entorno necesarias para configurar la base de datos MongoDB. En este caso, se especifica el nombre de usuario (`root`) y la contraseña (`83uddjfp0cmMD`) para el usuario root de MongoDB.
- `ports`: Mapea el puerto 27017 del host al puerto 27017 del contenedor, lo que permite la comunicación con la instancia de MongoDB.

```yaml
  mongo-express:
    image: mongo-express
    restart: 'no'
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_BASICAUTH_USERNAME: mongo
      ME_CONFIG_BASICAUTH_PASSWORD: 83uddjfp0cmMD
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: 83uddjfp0cmMD
      ME_CONFIG_MONGODB_URL: mongodb://root:83uddjfp0cmMD@mongo:27017/
```

Aquí se define un segundo servicio llamado `mongo-express`. Este servicio utiliza la imagen de Mongo Express (`mongo-express`). Algunas configuraciones clave son similares al servicio `mongo`, pero específicas de Mongo Express:

- `restart: 'no'`: Al igual que en el servicio `mongo`, indica que el contenedor no se reiniciará automáticamente.
- `ports`: Mapea el puerto 8081 del host al puerto 8081 del contenedor, permitiendo acceder a la interfaz web de Mongo Express.
- `environment`: Configura las variables de entorno necesarias para la autenticación en MongoDB.
- `ME_CONFIG_MONGODB_URL`: Especifica la URL de conexión a la base de datos MongoDB. En este caso, utiliza el usuario root y la contraseña proporcionados en las variables de entorno anteriores.
- `ME_CONFIG_BASICAUTH_USERNAME` y `ME_CONFIG_BASICAUTH_PASSWORD` definen el usuario y contraseña para la interfaz Web. 

Recuerda que una cosa es Express (interfaz Web) y otra el servicio Mongo (base de datos documental). **SIEMPRE** debemos de usar password fuertes incluso en desarrollo, por si en algún momento, por accidente, nuestros servicios estuviesen expuestos en Internet o a toda la Intranet de la empresa, ningún dato sensible sería accesible.

Para poner en marcha estos servicios, debes tener Docker y Docker Compose instalados. Luego, ejecuta el siguiente comando en el directorio donde se encuentra el archivo `docker-compose.yml`:

```bash
docker-compose up -d
```

Esto descargará las imágenes necesarias, creará y ejecutará los contenedores según la configuración proporcionada. Después de que los contenedores estén en funcionamiento, podrás acceder a MongoDB a través del puerto 27017 y a Mongo Express a través del puerto 8081 en tu máquina local.

## Conexión interactiva a MongoDB

Aunque por lo general no usaremos MongoDB en modo interactivo, vamos a ver algunos ejemplos de cómo interactuar con la shell de mongo (mongosh):

![Ejemplo de conexión en modo interactivo.](docs/mongodbinteractivo.png)

1. **Iniciar el shell interactivo:**
   Abre tu terminal y ejecuta los siguientes comandos:
   1. `docker exec -ti stack-mongo_mongo_1 /bin/bash`: para abrir una terminal interactiva en el contenedor de nuestro servicio **mongo**.
   2. `mongosh -u root -p`: para ingresar al shell interactivo de MongoDB, la contraseña es *83uddjfp0cmMD*, como fijamos en el docker-compose.
   3. `use('GestionAcademica')`: desde la shell de mongo, indicamos qué base de datos queremos usar de esta manera.

2. **Crear un documento (Create):**
   Para insertar un nuevo documento en una colección llamada `alumnos`, puedes utilizar el siguiente comando:

   ```javascript
   db.alumnos.insertOne({ nombre: "Juan Perez", edad: 20, carrera: "Ingeniería Informática" })
   ```

3. **Leer documentos (Read):**
   Para recuperar todos los documentos de la colección `alumnos`, puedes usar el comando `find()`:

   ```javascript
   db.alumnos.find()
   ```

   Esto mostrará todos los documentos que representan a los alumnos.

4. **Actualizar un documento (Update):**
   Para actualizar un documento, puedes utilizar el comando `updateOne()`. Supongamos que Juan Pérez cambió su carrera a "Ingeniería Eléctrica":

   ```javascript
   db.alumnos.updateOne({ nombre: "Juan Perez" }, { $set: { carrera: "Ingeniería Eléctrica" } })
   ```

   Esto actualiza el documento de Juan Pérez con la nueva información sobre su carrera.

5. **Eliminar un documento (Delete):**
   Para eliminar un documento, puedes utilizar el comando `deleteOne()`. Supongamos que Juan Pérez ya no es alumno:

   ```javascript
   db.alumnos.deleteOne({ nombre: "Juan Perez" })
   ```
   
   Esto eliminará el documento que representa a Juan Pérez de la colección.

Recuerda, para buscar un objeto en una colección usamos el método find. Así el formato para consultar la colección `profesor` sería:

```javascript
db.profesor.find( { "nombre":"Juan"}).pretty();
```

Pero ¿y si quiero buscar profesore con asignaturas con más de 5 horas (inclusive)?

```javascript
db.profesor.find({ 
    asignaturas: 
        {
            $elemMatch: {
                    horas: { $gt: 4}
            }
        }
});
```

Tienes más ejemplos sobre la sintaxis de consulta en la Web de MongoDB: <https://www.mongodb.com/docs/manual/tutorial/query-documents/>.

## Colección de ejemplo

Vamos a utilizar una colección ficticia llamada `estudiantes` que contiene información sobre estudiantes en una universidad. Aquí tienes algunos documentos de ejemplo en esta colección:

```javascript
db.estudiantes.insertMany([
  { nombre: "Ana García", edad: 22, carrera: "Biología", semestre: 5, promedio: 8.5 },
  { nombre: "Carlos López", edad: 21, carrera: "Ingeniería Civil", semestre: 4, promedio: 7.2 },
  { nombre: "María Torres", edad: 20, carrera: "Psicología", semestre: 3, promedio: 9.0 },
  { nombre: "Juan Rodríguez", edad: 23, carrera: "Historia", semestre: 6, promedio: 7.8 },
  { nombre: "Elena Pérez", edad: 19, carrera: "Matemáticas", semestre: 2, promedio: 9.5 }
])
```

Ahora, puedes realizar diversas consultas utilizando el método `find()` de MongoDB. Aquí tienes algunos ejemplos:

1. **Recuperar todos los estudiantes:**
   ```javascript
   db.estudiantes.find({})
   ```

2. **Filtrar estudiantes por carrera:**
   ```javascript
   db.estudiantes.find({ carrera: "Biología" })
   ```

3. **Estudiantes mayores de 21 años:**
   ```javascript
   db.estudiantes.find({ edad: { $gt: 21 } })
   ```

4. **Estudiantes con promedio mayor o igual a 8.0:**
   ```javascript
   db.estudiantes.find({ promedio: { $gte: 8.0 } })
   ```

5. **Estudiantes de Psicología en el tercer semestre:**
   ```javascript
   db.estudiantes.find({ carrera: "Psicología", semestre: 3 })
   ```

6. **Ordenar estudiantes por promedio en orden descendente:**
   ```javascript
   db.estudiantes.find().sort({ promedio: -1 })
   ```

7. **Limitar la cantidad de resultados a 3:**
   ```javascript
   db.estudiantes.find().limit(3)
   ```

Estos son solo ejemplos básicos de consultas utilizando el método `find()` en MongoDB. La sintaxis puede variar según las necesidades específicas de tu aplicación, y MongoDB ofrece una amplia variedad de operadores y opciones para realizar consultas más avanzadas. Puedes consultar la documentación oficial de MongoDB para obtener más detalles sobre la sintaxis y los operadores de consulta: [MongoDB Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/).

\pagebreak
