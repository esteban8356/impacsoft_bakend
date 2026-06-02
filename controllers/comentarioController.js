const Comentario = require('../models/Comentario');

exports.getComentariosByCaso = async (req, res) => {
    try {
        const { id } = req.params; // case id
        const comentarios = await Comentario.findAll({
            where: { casoId: id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ data: comentarios });
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};

exports.createComentario = async (req, res) => {
    try {
        const { id } = req.params; // case id
        const { contenido, autor, adjuntos } = req.body;

        const newComentario = await Comentario.create({
            casoId: id,
            contenido,
            autor,
            adjuntos
        });

        res.status(201).json({ message: 'Comentario agregado', data: newComentario });
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};
