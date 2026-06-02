const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/api');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 3000;

// Update CORS to allow credentials
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Stricter limiter for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again after 15 minutes'
});

app.use('/api/login', loginLimiter);
app.use('/api', limiter);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

app.use('/api', apiRoutes);

const { swaggerUi, specs } = require('./config/swagger');
console.log('Swagger loaded');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
    res.send('Backend API is running. Go to <a href="/api-docs/">/api-docs/</a> for documentation.');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
});

const startServer = async () => {
    try {
        // Import all models BEFORE sync to ensure proper order
        const Role = require('./models/Role');
        const User = require('./models/User');
        const Caso = require('./models/Caso');
        const Comentario = require('./models/Comentario');
        const Test = require('./models/Test');
        const Actividad = require('./models/Actividad');
        const Cliente = require('./models/Cliente');
        const Proyecto = require('./models/Proyecto');
        const Fase = require('./models/Fase');
        const Tarea = require('./models/Tarea');

        // Define Associations BEFORE sync
        Caso.hasMany(Comentario, { foreignKey: 'casoId' });
        Comentario.belongsTo(Caso, { foreignKey: 'casoId' });

        Caso.hasMany(Test, { foreignKey: 'casoId' });
        Test.belongsTo(Caso, { foreignKey: 'casoId' });

        Caso.hasMany(Actividad, { foreignKey: 'casoId' });
        Actividad.belongsTo(Caso, { foreignKey: 'casoId' });

        // User Assignment Association
        Caso.belongsTo(User, { as: 'assignedUser', foreignKey: 'assignedUserId' });
        User.hasMany(Caso, { foreignKey: 'assignedUserId' });

        // Caso-Cliente Association
        Caso.belongsTo(Cliente, { foreignKey: 'clienteId' });
        Cliente.hasMany(Caso, { foreignKey: 'clienteId' });

        // Proyecto Associations
        Cliente.hasMany(Proyecto, { foreignKey: 'clienteId' });
        Proyecto.belongsTo(Cliente, { foreignKey: 'clienteId' });

        Proyecto.belongsTo(User, { as: 'responsable', foreignKey: 'responsableId' });
        User.hasMany(Proyecto, { as: 'proyectosResponsable', foreignKey: 'responsableId' });

        Proyecto.hasMany(Fase, { foreignKey: 'proyectoId' });
        Fase.belongsTo(Proyecto, { foreignKey: 'proyectoId' });

        Proyecto.hasMany(Tarea, { foreignKey: 'proyectoId' });
        Tarea.belongsTo(Proyecto, { foreignKey: 'proyectoId' });

        Fase.hasMany(Tarea, { foreignKey: 'faseId' });
        Tarea.belongsTo(Fase, { foreignKey: 'faseId' });

        Tarea.belongsTo(User, { as: 'asignado', foreignKey: 'asignadoA' });
        User.hasMany(Tarea, { as: 'tareasAsignadas', foreignKey: 'asignadoA' });

        // NOW sync the database
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully');

        const adminRole = await Role.findByPk('administrador');
        const adminModules = [
            'home',
            'requests',
            'dashboard',
            'users',
            'roles',
            'casos',
            'clientes',
            'proyectos',
            'cotizaciones',
            'calendario',
            'inventario'
        ];

        if (!adminRole) {
            await Role.create({
                name: 'administrador',
                modules: adminModules
            });
            console.log('Default admin role created.');
        } else {
            // Always update modules for admin to ensure they have access to new features
            adminRole.modules = adminModules;
            await adminRole.save();
            console.log('Admin role updated with latest modules.');
        }

        // Create a default user for testing if not exists
        const bcrypt = require('bcryptjs');
        const hasAdmin = await User.findOne({ where: { username: 'admin' } });
        const hashedPassword = await bcrypt.hash('Est316728356m*', 10);

        if (!hasAdmin) {
            await User.create({ username: 'admin', password: hashedPassword, role: 'administrador' });
            console.log('Default admin user created.');
        } else {
            // Update existing admin to ensure password and role are correct
            hasAdmin.password = hashedPassword;
            hasAdmin.role = 'administrador';
            await hasAdmin.save();
            console.log('Admin user updated with new credentials.');
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
