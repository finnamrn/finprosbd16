const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'Akses ditolak. Token tidak ditemukan.' });
    }

    try {
        const cleanToken = token.replace('Bearer ', '');
        
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token tidak valid' });
    }
};