# Bases de datos documentales

Las bases de datos documentales son un tipo de sistema de gestión de bases de datos (SGBD) que se centra en el almacenamiento y recuperación de datos en formato de documentos. En lugar de organizar la información en tablas como en las bases de datos relacionales, las bases de datos documentales utilizan documentos, que pueden ser en formatos como JSON (JavaScript Object Notation) o BSON (Binary JSON). Cada documento puede contener datos estructurados y no estructurados, lo que proporciona flexibilidad en la representación de la información.

Mientras que las bases de datos relacionales están más recomendadas a casos en los que hay mucha rotación de datos, las documentales se recomiendan para los casos donde hay pocas o nulas actualizaciones.

Características comunes de las bases de datos documentales:

1. **Documentos:** La unidad básica de almacenamiento es el documento, que puede contener datos en formato clave-valor, matrices, objetos anidados, etc.

2. **Esquema dinámico:** A diferencia de las bases de datos relacionales, las bases de datos documentales permiten esquemas dinámicos, lo que significa que cada documento en la colección puede tener diferentes campos.

3. **Flexibilidad:** Son adecuadas para datos semiestructurados y no estructurados, lo que facilita el almacenamiento de información variada y cambiante.

4. **Escalabilidad horizontal:** Muchas bases de datos documentales están diseñadas para escalar horizontalmente, distribuyendo la carga de trabajo en varios servidores para manejar grandes volúmenes de datos y tráfico.

5. **Consultas eficientes:** Permiten realizar consultas eficientes utilizando índices en los campos clave.

Ejemplos de bases de datos documentales:

1. **MongoDB:** Es una de las bases de datos documentales más populares y ampliamente utilizadas. Almacena datos en formato BSON (una representación binaria de JSON) y permite esquemas flexibles.

2. **Firebase Firestore:** Es una base de datos documental en la nube proporcionada por Firebase, que es parte de Google Cloud Platform. Almacena datos en formato JSON y es especialmente popular para aplicaciones web y móviles.

## Planteamiento del proyecto

El presente proyecto forma parte de una de las tareas de  la asignatura de Acceso a Datos del Ciclo Formativo de Grado Superior de Desarrollo de Aplicaciones Multiplataforma. 

### Introducción a la tarea

Tenemos que implementar un sencillo sistema de gestión para un instituto operado por el personal de administración y servicios del mismo. Básicamente se trata de crear un CRUD para alumnos, otro CRUD para  profesores, otro CRUD para asignaturas, un maestro-detalle para ver asignaciones de profesores a asignaturas y otro para matriculación de  alumnos en asignaturas. Todo protegido con un login para que los datos no puedan ser abusados.

### Casos de uso

Un caso de uso no es más que plasmar ejemplos de cómo los actores (usuarios  de nuestro sistema) interactúan con nuestra aplicación. Esto nos ayudará a dividir el problema en cada una de sus partes. Un ejemplo del problema que nos atañe es:

![Diagrama de caso de uso de primer nivel](docs/casodeuso.png)

### Diagrama entidad/relación

El diagrama entidad/relación es el paso previo al diseño de tablas de la base de datos y nunca debe faltar en la fase de diseño. No obstante, en la actualidad cada vez cogen más fuerza las bases de datos documentales que dan un giro de tuerca al modelo relacional tradicional. Si bien en un modelo relacional tradicional tendríamos el siguiente diagrama ER:

![Diagrama entidad-relación](docs/diagramaER.png)

Con un enfoque documental podemos tener información duplicada. Siempre ponemos el ejemplo de la famosa plataforma de ventas por internet de la que no diremos el nombre. Cuando tú compras una serie de productos, se genera una factura o recibo de compra que puedes consultar en cualquier momento. Esa factura es una fotografía del precio de los productos en ese momento. Cuando miramos el precio de los mismos productos unos días después, probablemente habrán fluctuado. La información de los precios es redundante para todos los que compramos esos productos en ese momento, pero es más rápido para consultas tenerlo como un documento que tenerlo como una tabla. 

En un modelo documental tendremos colecciones de documentos, como por ejemplo:

`alumno`:

```json
{
  nombre: "Juan",
  apellido: "Sin miedo",
  email: "juan@sincorreo.com",
  telefono: 123456789
}
```

`profesor`:

```json
{
  nombre: "Juan",
  apellido: "Sin miedo",
  email: "juan@sincorreo.com",
  departamento: "Informática y Comunicaciones"
}
```

`asignatura`:

```json
{
  codigo: 486,
  nombre: "Acceso a Datos",
  curso: 2,
  ciclo: {
    grado: "Superior",
    denominacion: "Desarrollo de Aplicaciones Multiplataforma",
    normativa: "Real Decreto 405/2023"
  }
}
```

```json

```

### Diagrama de clases

Otro diagrama fundamental en UML es el diagrama de clases. En el vemos los objetos que habrá en nuestra aplicación y cómo 
interactuarán entre ellos. 

![Diagrama UML de caso de uso donde se ve la relación entre todas las clases.](docs/uml.png)


## Instalación y configuración de MongoDB

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
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: 83uddjfp0cmMD
      ME_CONFIG_MONGODB_URL: mongodb://root:83uddjfp0cmMD@mongo:27017/
```

Aquí se define un segundo servicio llamado `mongo-express`. Este servicio utiliza la imagen de Mongo Express (`mongo-express`). Algunas configuraciones clave son similares al servicio `mongo`, pero específicas de Mongo Express:

- `restart: 'no'`: Al igual que en el servicio `mongo`, indica que el contenedor no se reiniciará automáticamente.
- `ports`: Mapea el puerto 8081 del host al puerto 8081 del contenedor, permitiendo acceder a la interfaz web de Mongo Express.
- `environment`: Configura las variables de entorno necesarias para la autenticación en MongoDB.
- `ME_CONFIG_MONGODB_URL`: Especifica la URL de conexión a la base de datos MongoDB. En este caso, utiliza el usuario root y la contraseña proporcionados en las variables de entorno anteriores.

Para poner en marcha estos servicios, debes tener Docker y Docker Compose instalados. Luego, ejecuta el siguiente comando en el directorio donde se encuentra el archivo `docker-compose.yml`:

```bash
docker-compose up -d
```

Esto descargará las imágenes necesarias, creará y ejecutará los contenedores según la configuración proporcionada. Después de que los contenedores estén en funcionamiento, podrás acceder a MongoDB a través del puerto 27017 y a Mongo Express a través del puerto 8081 en tu máquina local.

## Conexión interactiva a MongoDB

Aunque por lo general no usaremos MongoDB en modo interactivo, para ver algunos ejemplos 

1. **Iniciar el shell interactivo:**
   Abre tu terminal y ejecuta el comando `mongo` para ingresar al shell interactivo de MongoDB.

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
