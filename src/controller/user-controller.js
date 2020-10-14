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

const createTokenResetEmail = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: "2h"
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
            templateId: 'd-5a503c1818504fbbbbb6d965d3327b23',
            dynamicTemplateData: {
              subject: 'Bem-vindo(a)',
              name: result.name,
              city: 'Somewhere',
            },
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


const get_forgot_password = (req, res) => {
    res.render('account/forgot_password', {
        user: req.user
    })
}


const post_forgot_password = async  (req, res) => {
    const { email } = req.body;
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

        const token = await createTokenResetEmail({
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

        user.forgotPasswordToken = token;
        const result = await user.save();

        
        /* Enviar Email de boas vindas */
        const msg = {
            to: email,
            from: 'ivarilson909@gmail.com', // Use the email address or domain you verified above
            templateId: 'd-5956c1077fd74b4889715ca56e705e38',
            dynamicTemplateData: {
              subject: 'Redefinir senha',
              name: result.name,
              city: 'Somewhere',
            },
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
        console.error('Error validating credentials: ', err)
        res.status(404).send({
            error: 'User not found'
        })

    }

}

const get_forgot_password_reset = (req, res) => {
    console.log('Estou aqui')
}

const post_forgot_password_reset = (req, res) => {
    res.render('account/forgot_password', {
        user: req.user
    })
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
    res.redirect('/users/login');
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
    get_forgot_password,
    post_forgot_password,
    post_forgot_password_reset,
    get_forgot_password_reset,
    logout,
    get_user,
    delete_user,
    profile
}