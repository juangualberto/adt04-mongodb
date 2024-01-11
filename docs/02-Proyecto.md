
# Planteamiento del proyecto

El presente proyecto forma parte de una de las tareas de  la asignatura de Acceso a Datos del Ciclo Formativo de Grado Superior de Desarrollo de Aplicaciones Multiplataforma. Con este proyecto aprenderemos los contenidos del tema, en nuestro caso desarrollar una aplicación con NodeJS, Express, PUG y MongoDB.

## Introducción a la tarea

Tenemos que implementar un sencillo sistema de gestión para un instituto operado por el personal de administración y servicios del mismo. Básicamente se trata de crear un CRUD para alumnos, otro CRUD para  profesores, otro CRUD para asignaturas, un maestro-detalle para ver asignaciones de profesores a asignaturas y otro para matriculación de  alumnos en asignaturas. Todo protegido con un login para que los datos no puedan ser abusados.

## Casos de uso

Un caso de uso no es más que plasmar ejemplos de cómo los actores (usuarios  de nuestro sistema) interactúan con nuestra aplicación. Esto nos ayudará a dividir el problema en cada una de sus partes. Un ejemplo del problema que nos atañe es:

![Diagrama de caso de uso de primer nivel](docs/casodeuso.png)

## Diagrama entidad/relación

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

`matrícula`:

```json
{
    asignatura: {
        codigo: 486,
        nombre: "Acceso a Datos",
        curso: 2,
        ciclo: {
            grado: "Superior",
            denominacion: "Desarrollo de Aplicaciones Multiplataforma",
            normativa: "Real Decreto 405/2023"
        }
    }, 
    alumnos: [
        {
            nombre: "Juan",
            apellido: "Sin miedo",
            email: "juan@sincorreo.com",
            telefono: 123456789
        },
        {
            nombre: "Pedro",
            apellido: "El Cruel",
            email: "pedro@sincorreo.com",
            telefono: 987654321
        }         
    ]
}
```

## Diagrama de clases

Otro diagrama fundamental en UML es el diagrama de clases. En el vemos los objetos que habrá en nuestra aplicación y cómo 
interactuarán entre ellos. 

![Diagrama UML de caso de uso donde se ve la relación entre todas las clases.](docs/uml.png)

\pagebreak