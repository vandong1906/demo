const jwt = require('jsonwebtoken');

function authenticateBearerToken(req, res, next) {
    const token = req.header('Authorization')?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        if (decoded.name != 'vandong') {
            return res.status(400).json({ message: 'No permission' });
        }
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

function authenticateCookiesToken(req, res, next) {
    const token = req.cookies['jwt'];
    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log(decoded);
        if (decoded.role !== 'admin' || decoded.status !== 'active') {
            return res.status(400).json({ message: 'No permission' });
        }
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {authenticateBearerToken, authenticateCookiesToken};