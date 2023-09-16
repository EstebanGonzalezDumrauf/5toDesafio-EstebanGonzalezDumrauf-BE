import {
    Router
} from 'express';
import {
    productModel
} from '../dao/models/product.js';
import {
    cartModel
} from '../dao/models/cart.js';
import session from 'express-session';


const router = Router();

// Configurar el middleware de sesión
router.use(session({
    secret: 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 300000, // 5 min
    },
}));

router.get('/products', async (req, res) => {
    const {
        page = 1
    } = req.query;

    const {
        docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    } = await productModel.paginate({}, {
        limit: 5,
        page
    })

    const prevLink = hasPrevPage ? `/products?page=${prevPage}` : null;
    const nextLink = hasNextPage ? `/products?page=${nextPage}` : null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    

    // Verificar si el usuario está autenticado antes de mostrar la página de productos
    if (req.session.user) {
        // Puedes usar req.session.user para acceder a los datos del usuario en cualquier lugar necesario
        const { username, isAdmin } = req.session.user;
        //res.render('index', { username, isAdmin }); // Renderiza la página de productos y pasa los datos del usuario
    } else {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión o muestra un mensaje de error
        return res.redirect('/'); // Cambia '/login' por la ruta correcta de tu página de inicio de sesión
    }


    //console.log(req.session.user);
    res.render('index', {
        docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        prevLink,
        nextLink,
        pageNumbers, 
        user: req.session.user
    });
})

router.get('/api/products/:pid', async (req, res) => {
    try {
        //console.log('Datos recibidos:', pid);
        const productId = req.params.pid;
        const producto = await productModel.findById(productId);

        const productoLimpiado = {
            title: producto.title,
            description: producto.description,
            price: producto.price,
            thumbnail: producto.thumbnail,
        };

        if (!producto) {
            return res.status(404).json({
                result: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.render('detail', {
            product: productoLimpiado,
            cartUrl: '/cart',
            user: req.session.user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor',
        });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        let carrito = await cartModel.findOne({ _id: cid }).populate('arrayCart.product');
        let totalCarrito = 0;

        const cartItems = carrito.arrayCart.map(item => {
            const subtotal = item.quantity * item.product.price;
            totalCarrito += subtotal;
            return {
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                id: item._id,
                thumbnail: item.product.thumbnail,
                subtotal: subtotal,
            };
        });

        console.log(cartItems, totalCarrito);

        res.render('cart', {
            cartProducts: cartItems,
            totalCarrito
        });

    } catch (error) {
        console.log(error);
    }
});

export default router;