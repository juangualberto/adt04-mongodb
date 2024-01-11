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
   npm install express express-session mongoose bcrypt pug dotenv
   ```

3. **Configurar la Aplicación y el middleware para la gestión de sesiones:**
   Crea un archivo `app.js` (o cualquier nombre que prefieras) y configura tu aplicación Express y Express-Session:

   ```javascript
        const express = require('express');
        const mongoose = require('mongoose');
        const bcrypt = require('bcrypt');
        const app = express();
        const session = require('express-session');
        // para cargar configuración de la APP desde .env
        const dotenv = require('dotenv');
        // sistema de login y registro
        const authRoutes = require('./routes/auth');

        app.set('view engine', 'pug');
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));

        // Configuración middleware express-session
        app.use(session({
            secret: 'unsupersecretoinconfesable',
            resave: true,
            saveUninitialized: false
          }));

        // Middleware para pasar información de sesión a las vistas
        app.use((req, res, next) => {
            res.locals.currentUser = req.session.user;
            next();
          });

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

      router.get("/", (req, res) =>{
          res.render('index');
      });

      router.get('/login', (req, res) => {
          res.render('login');
      });

      router.post('/login', async (req, res) => {
          const { username, password } = req.body;

          const user = await User.findOne({ username });

          if (user && bcrypt.compareSync(password, user.password)) {
              req.session.user = user; // Almacenamos el usuario en la sesión
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

      router.get('/logout', (req, res) => {
          req.session.destroy();
          res.redirect('/auth');
        });

      module.exports = router;

   ```

6. **Vistas Pug:**
   Crea las vistas Pug en la carpeta `views`. Puedes tener archivos como `login.pug` y `register.pug`. Aquí tienes un ejemplo simple de `index.pug`:

   ```pug
      html
        head
          title Login y Registro
        body
          h1 Bienvenido, #{currentUser ? currentUser.username : 'Invitado'}

          if !currentUser
            h2 Iniciar Sesión
            form(action='/auth/login', method='POST')
              label(for='username') Usuario:
              input(type='text', name='username', required)
              br
              label(for='password') Contraseña:
              input(type='password', name='password', required)
              br
              input(type='submit', value='Iniciar Sesión')

            h2 Registrarse
            form(action='/auth/register', method='POST')
              label(for='username') Usuario:
              input(type='text', name='username', required)
              br
              label(for='password') Contraseña:
              input(type='password', name='password', required)
              br
              input(type='submit', value='Registrarse')
          else
            a(href='/auth/logout') Cerrar Sesión

   ```

   Puedes usar código de este `index` para la vista `login.pug` y `register.pug`.

7. **Configurar Rutas en la Aplicación Principal:**
   Modifica `app.js` para utilizar las rutas que hemos definido:

   ```javascript

      // configuramos rutas

      app.use('/auth', authRoutes);

      app.use('/', (req, res) => {
          res.redirect('/auth');
      });

      app.listen(process.env.BACKEND_PORT, () => {
          console.log(`Servidor en funcionamiento en el puerto ${process.env.BACKEND_PORT}`);
      });
   ```

   Aquí, las rutas de autenticación estarán bajo la ruta `/auth`.

1. **Ejecutar la Aplicación:**
   Ejecuta tu aplicación con:

   ```bash
    node app.js
   ```

   Visita `http://localhost:8000/auth/login` para ver la página de inicio de sesión.

