
const introduction = (req, res) => {
    res.render('index', { user: req.user})
}

const market = (req, res) => {
    console.log( req.user)
    res.render('market', { user: req.user})
}

module.exports = {
    introduction,
    market
}