# Gestión de sesiones (login)

Vamos a comenzar nuestro proyecto con el sistema de Login. Creamos una carpeta `backend` y ejecutamos estos comandos: 

1. **Inicializar el Proyecto:**
   Crea un nuevo directorio y navega a él en la terminal. Luego, ejecuta el siguiente comando para inicializar un proyecto de Node.js:

   ```bash
   npm init -y
   ```

   Esto creará un archivo `package.json` con la configuración predeterminada.

2. **Instalar Dependencias:**
   Instala las dependencias necesarias: Express, Mongoose para interactuar con MongoDB, Bcrypt para el cifrado de contraseñas y Pug para las plantillas.

   ```bash
   npm install express mongoose bcrypt pug
   ```

3. **Configurar la Aplicación Express:**
   Crea un archivo `app.js` (o cualquier nombre que prefieras) y configura tu aplicación Express:

   ```javascript
        const express = require('express');
        const mongoose = require('mongoose');
        const bcrypt = require('bcrypt');
        const app = express();
        // para cargar configuración de la APP desde .env
        const dotenv = require('dotenv');

        app.set('view engine', 'pug');
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));

        // cargamos configuración desde .env
        dotenv.config();

        mongoose.connect(process.env.MONGO_URI);
   ```

   Crea un archivo `.env` con este contenido:

   ```environment
    MONGO_URI=mongodb://root:83uddjfp0cmMD@localhost:27017/GestionAcademica?authSource=admin
    BACKEND_PORT=8000
   ```

   Asegúrate de cambiar `'tuBaseDeDatos'` por el nombre de tu base de datos MongoDB.

4. **Definir el Modelo de Usuario:**
   Crea un archivo `models/User.js` para definir el modelo de usuario:

   ```javascript
   const mongoose = require('mongoose');

   const userSchema = new mongoose.Schema({
     username: { type: String, unique: true, required: true },
     password: { type: String, required: true }
   });

   const User = mongoose.model('User', userSchema);

   module.exports = User;
   ```

5. **Rutas y Controladores:**
   Crea un archivo `routes/auth.js` para manejar las rutas relacionadas con la autenticación:

   ```javascript
   const express = require('express');
   const router = express.Router();
   const bcrypt = require('bcrypt');
   const User = require('../models/User');

   router.get('/login', (req, res) => {
     res.render('login');
   });

   router.post('/login', async (req, res) => {
     const { username, password } = req.body;

     const user = await User.findOne({ username });

     if (user && bcrypt.compareSync(password, user.password)) {
       res.send('Inicio de sesión exitoso');
     } else {
       res.send('Credenciales incorrectas');
     }
   });

   router.get('/register', (req, res) => {
     res.render('register');
   });

   router.post('/register', async (req, res) => {
     const { username, password } = req.body;

     const hashedPassword = bcrypt.hashSync(password, 10);

     const newUser = new User({ username, password: hashedPassword });

     try {
       await newUser.save();
       res.send('Usuario registrado exitosamente');
     } catch (error) {
       res.send('Error al registrar el usuario');
     }
   });

   module.exports = router;
   ```

6. **Vistas Pug:**
   Crea las vistas Pug en la carpeta `views`. Puedes tener archivos como `login.pug` y `register.pug`. Aquí tienes un ejemplo simple de `login.pug`:

   ```pug
   html
   head
     title Login
   body
     h1 Iniciar Sesión
     form(action='/login', method='POST')
       label(for='username') Usuario:
       input(type='text', name='username', required)
       br
       label(for='password') Contraseña:
       input(type='password', name='password', required)
       br
       input(type='submit', value='Iniciar Sesión')
   ```

   Repite un proceso similar para la vista `register.pug`.

7. **Configurar Rutas en la Aplicación Principal:**
   Modifica `app.js` para utilizar las rutas que hemos definido:

   ```javascript
   const authRoutes = require('./routes/auth');

   app.use('/auth', authRoutes);

   app.listen(8000, () => {
     console.log('Servidor en funcionamiento en el puerto 8000');
   });
   ```

   Aquí, las rutas de autenticación estarán bajo la ruta `/auth`.

8. **Ejecutar la Aplicación:**
   Ejecuta tu aplicación con:

   ```bash
   node app.js
   ```

   Visita `http://localhost:8000/auth/login` para ver la página de inicio de sesión.

