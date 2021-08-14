const bryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../Utils/errorHandler')
module.exports.login = async (req, res) => {
    const candidate = await User.findOne({email: req.body.email})
    if (candidate) {
        // провіряєм пароль
        const passwordResult = bryptjs.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // генерація токена, паролі співпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            // паролі не співпали
            res.status(401).json({
                message: "wrong password"
            })
        }

    } else {
        // користувача немає. Помилка
        res.status(404).json({
            message: 'unknown email'
        })
    }
}

module.exports.register = async (req, res) => {
    const candidate = await User.findOne({email: req.body.email}) // перевіряєм чи існує користувач з введеним email
    if (candidate) {
        // користувач існує, потрібно відправити помилку
        res.status(409).json({
            message: 'Email is use, try to login'
        })
    } else {
        // потрібно створити користувача
        const salt = bryptjs.genSaltSync(10) // шифруем
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bryptjs.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch (e) {
            errorHandler(res, e)
        }

    }
}
