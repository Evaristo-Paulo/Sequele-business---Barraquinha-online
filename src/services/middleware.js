const jwt = require('jsonwebtoken')

const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwToken;
    if (token) {
        try {
            const user = await jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
            req.user = user;
            return next()

        } catch (err) {
            console.log('Token inválido!');
        }
    }

    res.redirect('/sequelebusinessapp/users/login');
}

const currentUser = async (req, res, next) => {
    const token = req.cookies.jwToken;
    if (token) {
        try {
            const user = await jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
            req.user = user;
            return next()

        } catch (err) {
            console.log('Token inválido!');
            req.user = null;
            return next()
        }
    } else {
        console.log('There is not token');
        req.user = null;
        return next()
    }
}


module.exports = {
    requireAuth,
    currentUser
}