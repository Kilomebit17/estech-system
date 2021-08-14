const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport') // для можливості  захищати роути
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const keys = require('./config/keys')
const app = express()

mongoose.connect(keys.mongoURI,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('mongoose is connected'))
    .catch(error => console.log('error with mongoose', error))

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use(require('morgan')('dev'))
app.use(require('cors')())
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:true})) //fix a problem with data sending
app.use(bodyParser.json()) // for format json


// URN localhost:5000/api/ + \/ routers
app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist/client'))

    app.get('*', (res,req) => {
        res.sendFile(
            path.resolve(
                __dirname,'client','dist','client','index.html'
            )
        )
    })
}
module.exports = app
