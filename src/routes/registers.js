import {
    Router
} from 'express';
import {
    userModel
} from '../dao/models/user.js';

const router = Router();

router.get('/registro', (req, res) => {
    res.render('registro'); // Puedes usar un motor de plantillas como EJS o enviar el archivo HTML directamente
});

router.post('/registro', async (req, res) => {
    const { nombre, apellido, user, pass } = req.body;

    // Verificar si el email ya está registrado
    const usuarioExistente = await userModel.findOne({ user });

    if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    let result = await userModel.create({ user, pass, nombre, apellido });

    try {
        res.redirect('/'); 
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

export default router;