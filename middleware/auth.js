const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let tokenValue;
    if (req.cookies && req.cookies.token) {
        tokenValue = req.cookies.token;
    } else if (req.headers['authorization']) {
        const parts = req.headers['authorization'].split(' ');
        if (parts.length === 2) tokenValue = parts[1];
    }

    if (!tokenValue) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

module.exports = verifyToken;
