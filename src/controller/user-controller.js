const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user-model')
const middleware = require('../services/middleware')
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_KEY);

/* JWT functions */

const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: maxAge
    })
}
const get_users = async (req, res) => {
    const users = await User.find({});

    console.log(req.cookies)
    res.send({
        users
    });
}

const get_signup = (req, res) => {
    res.render('account/signup', {
        user: req.user
    })
}

const post_signup = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    try {
        const newUser = new User();
        newUser.name = name;
        newUser.email = email;
        const salt = await bcrypt.genSalt();
        newUser.password = await bcrypt.hash(password, salt)

        const result = await newUser.save();

        const token = await createToken({
            id: result._id,
            user: result.name,
            email: result.email
        });

        if (!token) {
            console.error('Error generating token')
            res.status(400).send({
                error: 'Bad request'
            })
        }

        res.cookie('jwToken', token) /* Saving token as cookie */

        
        /* Enviar Email de boas vindas */
        const msg = {
            to: email,
            from: 'ivarilson909@gmail.com', // Use the email address or domain you verified above
            subject: 'Bem-vindo à Sequele Business',
            text: 'Seja bem-vindo',
            html: '<p style="text-align: center">Olá, <strong>' + name + '</strong>, seu email foi criado com sucesso.</p><p style="text-align: center">Faça seu login e descubra o que nossos chefs prepararam para si.</p><h2 style="text-align: center">"Comer bem é uma arte."</h2>',
        };
        //ES8
        (async () => {
            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body)
                }
            }
        })();

        res.status(200).send({
            message: 'OK',
            data: result,
            token: token
        });
    } catch (err) {
        console.error('Error saving data: ', err),
            res.status(400).send({
                error: 'Bad request'
            })
    }
}

const get_login = (req, res) => {
    res.render('account/login', {
        user: req.user
    })
}

const post_login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            console.log('Email not found')
            res.status(404).send({
                error: 'User not found'
            })
            return
        }

        const authUser = await bcrypt.compare(password, user.password)
        if (!authUser) {
            console.log('User not found')
            res.status(404).send({
                error: 'User not found'
            })
            return
        }

        const token = await createToken({
            id: user._id,
            user: user.name,
            email: user.email
        });

        if (!token) {
            console.error('Error generating token')
            res.status(500).send({
                error: 'Server error'
            })
            return
        }
        res.cookie('jwToken', token) /* Saving token as cookie */
        res.status(200).send({
            message: 'OK',
            data: user,
            token: token
        });
    } catch (err) {
        console.error('Error validating credentials: ', err)
        res.status(404).send({
            error: 'User not found'
        })

    }

}

const get_user = async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        res.send(user);
    }
}

const delete_user = async (req, res) => {
    const user = await User.findOneAndDelete(req.params.id)

    if (user) {
        res.send(user);
    }
}

const logout = async (req, res) => {
    res.clearCookie('jwToken')
    res.redirect('/sequelebusinessapp/users/login');
}


const profile = async (req, res) => {
    res.render('account/profile', {
        user: req.user
    })
}

module.exports = {
    get_users,
    get_signup,
    post_signup,
    get_login,
    post_login,
    logout,
    get_user,
    delete_user,
    profile
}