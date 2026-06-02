const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requestController = require('../controllers/requestController');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateLogin, validateRegister, validateUserCreate, validateRequest, handleValidationErrors } = require('../middleware/validators');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 username:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.post('/logout', authController.logout);
router.get('/verify', auth, authController.verifyToken);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */
router.post('/register', validateRegister, handleValidationErrors, authController.register);

/**
 * @swagger
 * /create-request:
 *   post:
 *     summary: Create a new contact request
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - telefono
 *               - empresa
 *               - mensaje
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               empresa:
 *                 type: string
 *               mensaje:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created successfully
 *       400:
 *         description: Missing fields
 */
router.post('/create-request', validateRequest, handleValidationErrors, requestController.createSolicitud);

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all contact requests
 *     tags: [Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 */
router.get('/requests', auth, requestController.getSolicitudes);

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Delete a contact request
 *     tags: [Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 */
router.delete('/requests/:id', auth, requestController.deleteSolicitud);

const roleController = require('../controllers/roleController');

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 */
router.get('/roles', auth, roleController.getRoles);
router.post('/roles', auth, roleController.createRole);
router.put('/roles/:name', auth, roleController.updateRole);
router.delete('/roles/:name', auth, roleController.deleteRole);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User created
 */
router.get('/users', auth, userController.getUsers);
router.post('/users', auth, validateUserCreate, handleValidationErrors, userController.createUser);
router.put('/users/:id', auth, userController.updateUser);
router.delete('/users/:id', auth, userController.deleteUser);


const casoController = require('../controllers/casoController');
const comentarioController = require('../controllers/comentarioController');
const testController = require('../controllers/testController');

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Get all cases
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a new case (and optionall delete request)
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 */
router.get('/casos', auth, casoController.getCases);
router.post('/casos', auth, casoController.createCaso);
router.get('/casos/:id', auth, casoController.getCasoById); // New
router.put('/casos/:id', auth, casoController.updateCaso);   // New
router.delete('/casos/:id', auth, casoController.deleteCase);

// Comentarios Routes
router.get('/casos/:id/comentarios', auth, comentarioController.getComentariosByCaso);
router.post('/casos/:id/comentarios', auth, comentarioController.createComentario);

// Tests Routes
router.get('/casos/:id/tests', auth, testController.getTestsByCaso);
router.post('/casos/:id/tests', auth, testController.createTest);

// Actividades Routes (Kanban)
const actividadController = require('../controllers/actividadController');
router.get('/casos/:id/actividades', auth, actividadController.getActividadesByCaso);
router.post('/casos/:id/actividades', auth, actividadController.createActividad);
router.put('/casos/:id/actividades/:actividadId', auth, actividadController.updateActividad);
router.delete('/casos/:id/actividades/:actividadId', auth, actividadController.deleteActividad);

// Dashboard Stats
const statsController = require('../controllers/StatsController');
router.get('/stats', auth, statsController.getDashboardStats);

/**
 * @swagger
 * /data:
 *   get:
 *     summary: Get protected data
 *     tags: [Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/data', auth, (req, res) => {
    res.status(200).json({
        message: `Bienvenido, ${req.user.username}`,
        data: [
            { id: 1, name: 'Producto A', price: 100 },
            { id: 2, name: 'Producto B', price: 200 },
            { id: 3, name: 'Producto C', price: 300 }
        ]
    });
});

// Cliente Routes
const clienteController = require('../controllers/ClienteController');
router.get('/clientes', auth, clienteController.getClientes);
router.get('/clientes/:id', auth, clienteController.getClienteById);
router.post('/clientes', auth, clienteController.createCliente);
router.put('/clientes/:id', auth, clienteController.updateCliente);
router.delete('/clientes/:id', auth, clienteController.deleteCliente);
router.patch('/clientes/:id/reactivate', auth, clienteController.reactivateCliente);

// Proyecto Routes
const proyectoController = require('../controllers/ProyectoController');
// Proyectos
router.get('/proyectos', auth, proyectoController.getProyectos);
router.get('/proyectos/:id', auth, proyectoController.getProyectoById);
router.post('/proyectos', auth, proyectoController.createProyecto);
router.put('/proyectos/:id', auth, proyectoController.updateProyecto);
router.delete('/proyectos/:id', auth, proyectoController.deleteProyecto);
// Fases
router.get('/proyectos/:id/fases', auth, proyectoController.getFasesByProyecto);
router.post('/proyectos/:id/fases', auth, proyectoController.createFase);
router.put('/proyectos/:id/fases/:faseId', auth, proyectoController.updateFase);
router.delete('/proyectos/:id/fases/:faseId', auth, proyectoController.deleteFase);
// Tareas
router.get('/proyectos/:id/tareas', auth, proyectoController.getTareasByProyecto);
router.post('/proyectos/:id/tareas', auth, proyectoController.createTarea);
router.put('/proyectos/:id/tareas/:tareaId', auth, proyectoController.updateTarea);
router.delete('/proyectos/:id/tareas/:tareaId', auth, proyectoController.deleteTarea);

module.exports = router;
