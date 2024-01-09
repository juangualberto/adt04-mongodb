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

// configuramos rutas

app.use('/auth', authRoutes);

app.use('/', (req, res) => {
    res.redirect('/auth');
});

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${process.env.BACKEND_PORT}`);
});