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
