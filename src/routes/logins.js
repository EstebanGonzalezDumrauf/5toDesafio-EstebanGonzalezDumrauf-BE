import {
    Router
} from 'express';
import {
    userModel
} from '../dao/models/user.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const router = Router();

//router.use(cookieParser());
// router.use(session({
//     store: MongoStore.create({
//         mongoUrl: 'mongodb+srv://estebangonzalezd:coder1234@clusterestebangonzalezd.wuhulk1.mongodb.net/Ecommerce',
//         ttl: 5000
//     }),
//     secret: "secretCoder",
//     resave: true,
//     saveUninitialized: true
// }));

router.get('/', async (req, res) => {
    res.render('cookies')
})

router.post('/cookie', (req, res) => {
    const data = req.body;
    //res.cookie('CoderCookie', data, { maxAge: 100000 }).send({ status: "success", message: "cookie seteada" });
})


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