# CRUD Alumno

Un CRUD (acrónimo de Crear, Leer, Actualizar, Borrar) es un conjunto de operaciones básicas que podremos hacer contra un sistema de información. 

A continuación vamos a hacer un ejemplo para un modelo de alumno con los datos: nombre, apellidos y email.

1. **Modificar el modelo `models/Alumno.js`:**
   Agrega un nuevo modelo para representar a los alumnos. Crea un archivo llamado `Alumno.js` dentro de la carpeta `models`.

   ```javascript
   const mongoose = require('mongoose');

   const alumnoSchema = new mongoose.Schema({
     nombre: { type: String, required: true },
     apellidos: { type: String, required: true },
     email: { type: String, required: true, unique: true }
   });

   const Alumno = mongoose.model('Alumno', alumnoSchema);

   module.exports = Alumno;
   ```

2. **Modificar el archivo `routes/alumnos.js`:**
   Crea un nuevo archivo llamado `alumnos.js` dentro de la carpeta `routes`. Este archivo manejará las rutas relacionadas con los alumnos.

   ```javascript
   const express = require('express');
   const router = express.Router();
   const Alumno = require('../models/Alumno');

   // Obtener todos los alumnos
   router.get('/alumnos', async (req, res) => {
     try {
       const alumnos = await Alumno.find();
       res.render('alumnos/index', { alumnos });
     } catch (error) {
       res.send('Error al obtener los alumnos');
     }
   });

   // Formulario para agregar un nuevo alumno
   router.get('/alumnos/new', (req, res) => {
     res.render('alumnos/new');
   });

   // Agregar un nuevo alumno
   router.post('/alumnos', async (req, res) => {
     const { nombre, apellidos, email } = req.body;

     const nuevoAlumno = new Alumno({ nombre, apellidos, email });

     try {
       await nuevoAlumno.save();
       res.redirect('/alumnos');
     } catch (error) {
       res.send('Error al agregar el alumno');
     }
   });

   // Mostrar detalles de un alumno
   router.get('/alumnos/:id', async (req, res) => {
     try {
       const alumno = await Alumno.findById(req.params.id);
       res.render('alumnos/show', { alumno });
     } catch (error) {
       res.send('Error al obtener los detalles del alumno');
     }
   });

   // Formulario para editar un alumno
   router.get('/alumnos/:id/edit', async (req, res) => {
     try {
       const alumno = await Alumno.findById(req.params.id);
       res.render('alumnos/edit', { alumno });
     } catch (error) {
       res.send('Error al obtener los detalles del alumno para editar');
     }
   });

   // Actualizar un alumno
   router.put('/alumnos/:id', async (req, res) => {
     const { nombre, apellidos, email } = req.body;

     try {
       await Alumno.findByIdAndUpdate(req.params.id, { nombre, apellidos, email });
       res.redirect('/alumnos');
     } catch (error) {
       res.send('Error al actualizar el alumno');
     }
   });

   // Eliminar un alumno
   router.delete('/alumnos/:id', async (req, res) => {
     try {
       await Alumno.findByIdAndRemove(req.params.id);
       res.redirect('/alumnos');
     } catch (error) {
       res.send('Error al eliminar el alumno');
     }
   });

   module.exports = router;
   ```

3. **Crear las vistas correspondientes:**
   Crea las carpetas y archivos de vistas necesarios. Aquí tienes los archivos necesarios:

   - `views/alumnos/index.pug`: Lista de todos los alumnos.
   - `views/alumnos/new.pug`: Formulario para agregar un nuevo alumno.
   - `views/alumnos/show.pug`: Detalles de un alumno específico.
   - `views/alumnos/edit.pug`: Formulario para editar un alumno.

    A continuación detallamos el contenido de la carpeta `views/alumnos`:

     1. **`index.pug`:** Lista de todos los alumnos.

        ```pug
        html
        head
          title Lista de Alumnos
        body
          h1 Lista de Alumnos
          ul
            each alumno in alumnos
              li
                a(href=`/alumnos/${alumno._id}`) #{alumno.nombre} #{alumno.apellidos} (#{alumno.email})
          br
          a(href='/alumnos/new') Agregar Nuevo Alumno
        ```

     2. **`new.pug`:** Formulario para agregar un nuevo alumno.

        ```pug
        html
        head
          title Agregar Nuevo Alumno
        body
          h1 Agregar Nuevo Alumno
          form(action='/alumnos', method='POST')
            label(for='nombre') Nombre:
            input(type='text', name='nombre', required)
            br
            label(for='apellidos') Apellidos:
            input(type='text', name='apellidos', required)
            br
            label(for='email') Email:
            input(type='email', name='email', required)
            br
            input(type='submit', value='Agregar Alumno')
          br
          a(href='/alumnos') Volver a la Lista de Alumnos
        ```

     3. **`show.pug`:** Detalles de un alumno específico.

        ```pug
        html
        head
          title Detalles del Alumno
        body
          h1 Detalles del Alumno
          p
            strong Nombre:
            span #{alumno.nombre}
          p
            strong Apellidos:
            span #{alumno.apellidos}
          p
            strong Email:
            span #{alumno.email}
          br
          a(href=`/alumnos/${alumno._id}/edit`) Editar Alumno
          form(action=`/alumnos/${alumno._id}?_method=DELETE`, method='POST')
            input(type='submit', value='Eliminar Alumno')
          br
          a(href='/alumnos') Volver a la Lista de Alumnos
        ```

     4. **`edit.pug`:** Formulario para editar un alumno.

        ```pug
        html
        head
          title Editar Alumno
        body
          h1 Editar Alumno
          form(action=`/alumnos/${alumno._id}?_method=PUT`, method='POST')
            label(for='nombre') Nombre:
            input(type='text', name='nombre', value=alumno.nombre, required)
            br
            label(for='apellidos') Apellidos:
            input(type='text', name='apellidos', value=alumno.apellidos, required)
            br
            label(for='email') Email:
            input(type='email', name='email', value=alumno.email, required)
            br
            input(type='submit', value='Guardar Cambios')
          br
          a(href=`/alumnos/${alumno._id}`) Cancelar
          br
          a(href='/alumnos') Volver a la Lista de Alumnos
        ```

