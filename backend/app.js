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

const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${process.env.BACKEND_PORT}`);
});