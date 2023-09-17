import {
    Router
} from 'express';
import {
    userModel
} from '../dao/models/user.js';

const router = Router();

router.get('/', async (req, res) => {
    res.render('cookies')
})

router.post('/cookie', (req, res) => {
    const data = req.body;
    //res.cookie('CoderCookie', data, { maxAge: 100000 }).send({ status: "success", message: "cookie seteada" });
})

router.post('/logout', (req, res) => {
    // Verifica si el usuario tiene una sesión válida antes de intentar destruirla
    if (req.session && req.session.user) {
        req.session.destroy((err) => { // Destruye la sesión
            if (err) {
                console.error('Error al cerrar la sesión:', err);
                res.status(500).json({ error: 'Error al cerrar la sesión' });
            } else {
                // La sesión se ha destruido con éxito
                res.status(200).json({ message: 'Sesión cerrada exitosamente' });
            }
        });
    } else {
        res.status(200).json({ message: 'No hay sesión para cerrar' });
    }
});



router.post('/session', async (req, res) => {
    const { user, pass } = req.body; 
    console.log('Mensaje de prueba');

    if (user === "adminCoder@coder.com" && pass === "adminCod3r123") {
        // Datos de sesión para el Super Usuario
        req.session.user = {
            nombre: "Super Usuario",
            apellido: "de CODER",
            rol: "Administrador"
        };
        //console.log("Super Usuario");
        return res.redirect('/products');
    }

    const usuario = await userModel.findOne({ user: user });

    if (!usuario) {
        return res.status(404).json({
            result: 'error',
            message: 'Usuario no encontrado'
        });
    }

    if (pass !== usuario.pass) {
        return res.status(404).json({
            result: 'error',
            message: 'Contraseña incorrecta'
        });
    }

    // Sesión para usuarios normales
    req.session.user = {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol
    };
    console.log(req.session.user);

    res.redirect('/products');
});

export default router;