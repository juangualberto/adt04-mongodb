# Bases de datos documentales

Este repositorio está estructurado de la siguiente manera:

* Carpeta `backend`: contiene el código fuente para NodeJS de la aplicación, dentro, a su vez, en subcarpetas tenemos:
  * `models`: Modelos de datos
  * `public`: Carpeta pública con contenido estático (CSS, JS, IMG, etc.)
  * `routes`: Carpeta con las rutas.
  * `views`: Carpeta con las vistas.
  * Fichero `.env`: Configuración. **NUNCA** debe subirse al repositorio, debe ser secreto, debería estar en el **.gitignore**.
  * Fichero `app.js`: Aplicación de NodeJS.
  * Fichero `package.json`: Dependencias del proyecto. La primera vez tendrás que hacer npm install desde esta carpeta `backend`.
* Carpeta `docs`: Documentación, imágenes, etc.
* Carpeta `stack-mongo`: Archivos docker-compose para dar de alta los servicios para que funcione la aplicación.

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

\pagebreak

# Proyecto Express

Lo ideal es estructurar el proyecto según responsabilidades, utilizando controladores para la lógica de negocio, un enrutador para manejar las rutas y un directorio para las vistas:

```plaintext
|-- /controllers
|   |-- alumnosController.js
|   |-- asignaturasController.js
|   |-- authController.js
|-- /middlewares
|   |-- sessionMiddleware.js
|-- /models
|   |-- alumnoModel.js
|   |-- asignaturaModel.js
|-- /routes
|   |-- alumnosRoutes.js
|   |-- asignaturasRoutes.js
|   |-- authRoutes.js
|-- /views
|   |-- alumnos
|       |-- index.pug
|       |-- add.pug
|       |-- edit.pug
|   |-- asignaturas
|       |-- index.pug
|       |-- add.pug
|       |-- edit.pug
|   |-- layout.pug
|-- app.js
|-- db.js
|-- package.json
|-- ...
```

En donde:

- **controllers:** Contiene archivos que manejan la lógica de negocio para cada entidad o función específica.

- **middlewares:** Contiene archivos para los middlewares personalizados. Por ejemplo, el middleware de sesión podría ir aquí.

- **models:** Contiene archivos que definen los modelos de datos para interactuar con la base de datos.

- **routes:** Contiene archivos que definen las rutas y usan los controladores correspondientes.

- **views:** Contiene subdirectorios para cada entidad o función, y dentro de cada uno, las vistas relacionadas.

- **app.js:** Es el punto de entrada de la aplicación donde se configura Express y se definen las rutas principales.

- **db.js:** Contiene la configuración y la conexión a la base de datos.

- **package.json:** Archivo de configuración de Node.js.

Rutas de la aplicación:

RUTA | METODO | Observaciones
-----|--------|--------------
/auth | GET | Ventana bienvenida AUTH
/auth/register | GET | Mostrar formulario registro
/auth/register | POST | Guardar datos formulario registro
/auth/login | GET | Mostrar formulario login
/auth/login | POST | Enviar datos login y registrar sesion
/alumnos   | GET | Mostrar tabla lista alumnos
/alumnos/list/{id} | GET | Mostrar el alumno con ID
/alumnos/create | GET | Mostrar formulario para añadir un alumno 
/alumnos/create | POST | Guardar info del alumno nuevo
/alumnos/edit/{id} | GET | Mostrar formulario para editar alumno con ID
/alumnos/edit/{id} | POST | Guardar info del alumno con ID
/alumnos/delete/{id} | GET | Mostrar formulario desea borrar alumno con ID
/alumnos/delete/{id} | POST | Borrar alumno con ID


## Configuración del proyecto 

En la carpeta del proyecto creamos el fichero **package.json**

```bash
npm install --save express express-session mogoose pug body-parser
```

Esto añade a nuestro proyecto:

1. **express:** Este es el marco web de Node.js que te permite construir aplicaciones web y APIs de manera sencilla. Express proporciona una amplia gama de características para manejar rutas, manejo de middleware, gestionar sesiones y muchas otras utilidades para el desarrollo web.
2. **express-session:** Este paquete proporciona soporte para gestionar sesiones de usuario en Express. Permite almacenar datos de sesión en el servidor y asociar una cookie de sesión con el navegador del usuario. Puedes utilizarlo para implementar la autenticación y la persistencia de datos entre solicitudes del mismo usuario.
3. **mongoose:** Mongoose es una biblioteca de modelado de datos orientada a objetos (ODM) para MongoDB y Node.js. Administra las relaciones entre los datos, proporciona validación de esquemas y se utiliza para traducir entre objetos en el código y la representación de esos objetos en MongoDB.
4. **pug:** Anteriormente conocido como Jade, Pug es un motor de plantillas para Node.js que simplifica la creación de vistas HTML. Puedes utilizarlo para escribir HTML de una manera más concisa y expresiva.
5. **body-parser:** Este middleware de Express se utiliza para analizar el cuerpo de las solicitudes HTTP. Es especialmente útil cuando necesitas acceder a los datos enviados en una solicitud POST, ya que facilita la extracción de información de formularios y carga útil JSON.

Esto genera, además de la carpeta **node_modules**, un archivo **package.json**. En éste último archivo, deberías tener algo similar a esto: 

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "pug": "^3.0.2",
    "express-session": "^1.17.3"
  }
}
```


Dentro del archivo `package.json` de un proyecto Node.js, hay varias secciones y campos que especifican información sobre el proyecto y sus dependencias. Algunos de los campos más relevantes son:

1. **`name`:** Es el nombre del paquete. Debería ser único dentro del registro npm.

2. **`version`:** Indica la versión actual del paquete. Sigue un esquema de versión semántica (`SemVer`). Este número se incrementa cuando se realizan cambios en el código.

   - `Major (X)`: Cambios incompatibles con versiones anteriores. Si cambia este número, nuestro proyecto ya no funciona.
   - `Minor (Y)`: Nuevas características de forma compatible. En teoría debe funcionar igual.
   - `Patch (Z)`: Correcciones de errores compatibles con versiones anteriores. Casi con toda seguridad funcionará.

   Por ejemplo, `1.2.3` significa Major: 1, Minor: 2, Patch: 3.

3. **`description`:** Breve descripción del paquete.

4. **`main`:** El archivo principal que se ejecutará cuando alguien requiera tu módulo.

5. **`scripts`:** Una sección que define scripts de terminal que pueden ejecutarse con `npm run`.

6. **`dependencies`:** Lista de dependencias necesarias para que la aplicación funcione en producción.

7. **`devDependencies`:** Lista de dependencias necesarias solo para desarrollo.

8. **`author`:** El autor del paquete.

9. **`license`:** La licencia bajo la cual se distribuye el paquete.

10. **`keywords`:** Lista de palabras clave asociadas con el paquete.

11. **`repository`:** La ubicación del repositorio del código fuente del paquete.

12. **`engines`:** Restricciones sobre las versiones de Node.js y npm compatibles con el paquete.

13. **`scripts`:** Una sección que permite definir comandos personalizados que se pueden ejecutar con `npm run`.

14. **`eslintConfig`, `browserslist`, etc.:** Configuraciones específicas para herramientas como ESLint, Babel, etc.

Cada vez que instalas un paquete mediante `npm install`, se agrega una entrada en `dependencies`. Cuando instalas un paquete solo para desarrollo, se agrega a `devDependencies`. Estas secciones especifican las dependencias que se deben instalar para que la aplicación funcione correctamente.

Cuando alguien más descarga tu proyecto y ejecuta `npm install`, npm instalará las dependencias listadas en `dependencies` y `devDependencies` de acuerdo con las versiones especificadas. Esto garantiza que todos tengan el mismo entorno de desarrollo y producción.

**Las versiones de las dependencias** pueden tener diferentes **prefijos** que especifican cómo deben actualizarse esas dependencias en futuras instalaciones. Aquí hay una explicación de los prefijos más comunes:

1. **Sin prefijo (ningún carácter antes de la versión):**
   - Ejemplo: `"express": "4.17.1"`
   - Significado: La versión exacta especificada se instalará. No se realizarán actualizaciones automáticas.

2. **`^` (caret):**
   - Ejemplo: `"express": "^4.17.1"`
   - Significado: Permite actualizaciones automáticas de parches. Cuando ejecutas `npm update`, npm instalará automáticamente la última versión compatible con la versión especificada, pero sin cambiar la versión principal ni la menor.

3. **`~` (tilde):**
   - Ejemplo: `"express": "~4.17.1"`
   - Significado: Permite actualizaciones automáticas de parches y menores. npm instalará automáticamente la última versión compatible con la versión especificada, pero sin cambiar la versión principal.

4. **`>=`, `<=`, `<`, `>`:**
   - Ejemplo: `"express": ">=4.17.1 <5.0.0"`
   - Significado: Establece un rango de versiones permitidas. En este caso, cualquier versión mayor o igual a `4.17.1` y menor que `5.0.0` será aceptada.

Estos prefijos se utilizan para indicar cómo deben manejarse las actualizaciones de las dependencias cuando se ejecuta `npm install` o `npm update`. La elección del prefijo depende de las necesidades y restricciones del proyecto. En entornos de producción, es común especificar versiones exactas o utilizar prefijos más restrictivos para evitar actualizaciones automáticas que podrían romper la compatibilidad. En entornos de desarrollo, los prefijos `^` o `~` son comunes para permitir actualizaciones automáticas mientras se mantenga la compatibilidad.


## Los middlewares y su uso para gestionar sesiones

En Express, un middleware es una función que tiene acceso al objeto de solicitud (`req`), al objeto de respuesta (`res`), y a la siguiente función en la pila de middleware (`next`). Los middlewares en Express se utilizan para realizar tareas específicas durante el procesamiento de una solicitud, como modificar objetos de solicitud o respuesta, ejecutar código antes o después de la manipulación de rutas, y controlar el flujo de ejecución.

Los middlewares pueden realizar una variedad de tareas, como:

1. **Modificación de la solicitud y respuesta:** Pueden agregar, modificar o eliminar propiedades de los objetos `req` y `res`. Por ejemplo, parsear datos del cuerpo de la solicitud, agregar encabezados personalizados, etc.

2. **Ejecución de código antes de las rutas:** Pueden realizar acciones antes de que se ejecuten las rutas principales. Esto es útil para la autenticación, la autorización y otras tareas de preprocesamiento.

3. **Control del flujo de ejecución:** Pueden decidir si permitir que la solicitud continúe al siguiente middleware o ruta en la cadena, o si detener el flujo y enviar una respuesta al cliente.

Los middlewares se pueden utilizar de diversas maneras en Express:

- **Middleware de aplicación:** Se ejecutan en cada solicitud. Pueden ser configurados con `app.use()`.

  ```javascript
  const express = require('express');
  const app = express();

  // Middleware de aplicación
  app.use((req, res, next) => {
    // Código del middleware
    next(); // Llama al siguiente middleware o ruta
  });
  ```

- **Middleware de ruta:** Se aplican solo a rutas específicas.

  ```javascript
  app.get('/ruta', (req, res, next) => {
    // Middleware de ruta
    next();
  });
  ```

- **Middleware de error:** Se utilizan para manejar errores en la aplicación. Se definen con cuatro parámetros (err, req, res, next).

  ```javascript
  app.use((err, req, res, next) => {
    // Middleware de error
    res.status(500).send('Algo salió mal!');
  });
  ```

Los middlewares se ejecutan en orden y la ejecución continúa hasta que se completa la cadena de middlewares o se llama a `next(err)` con un error (en caso de middleware de error).

Un ejemplo sencillo de middleware que registra la hora de cada solicitud puede verse así:

```javascript
app.use((req, res, next) => {
  console.log('Hora de la solicitud:', new Date());
  next();
});
```

Este middleware se ejecutará en cada solicitud, registrando la hora antes de pasar al siguiente middleware o ruta.

**Volvamos a nuestro proyecto**. Vamos a crear un sencillo MiddleWare que compruebe si hemos hecho login o no. Recuarda que las peticiones HTTP son sin estado. Para ver si se han hecho unas operaciones u otras previamente necesitamos crear sesiones y almacenar en ellas información.

Para ver si estamos *loggeados* basta con comprobar si hemos grabado previamente, por tanto, una variable de sesión. Cuando hacemos *login*, vamos a crear una variable de sesión *user* que contiene el nombre de usuario. Si esa variable de sesión existe, se hizo login desde ese navegador. Si no existe, aún no se hizo. Esto hay que hacerlo antes del enrutador.

```javascript 
// Middleware para gestionar la sesión de usuario
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  if (!req.session.user && !req.path.match("/login")) 
    res.redirect("/login")
  else 
    next();  
});

// RUTAS
// ruta por defecto
app.get('/', (req, res) => {
    res.render('index');
  });
```
