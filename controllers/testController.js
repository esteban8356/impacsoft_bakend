const Test = require('../models/Test');

exports.getTestsByCaso = async (req, res) => {
    try {
        const { id } = req.params; // case id
        const tests = await Test.findAll({
            where: { casoId: id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ data: tests });
    } catch (error) {
        console.error('Error al obtener tests:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};

exports.createTest = async (req, res) => {
    try {
        const { id } = req.params; // case id
        const { nombre, resultado, adjuntos } = req.body;

        const newTest = await Test.create({
            casoId: id,
            nombre,
            resultado,
            adjuntos
        });

        res.status(201).json({ message: 'Test agregado', data: newTest });
    } catch (error) {
        console.error('Error al crear test:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};
