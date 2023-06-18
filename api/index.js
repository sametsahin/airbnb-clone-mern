const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const User = require('./models/User.js')
const app = express()

const bcryptSalt = bcrypt.genSaltSync(10);


//CONFIGRATIONS
dotenv.config();
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));


//DATABASE
try {
    mongoose.connect(process.env.MONGO_URI)
} catch (e) {
    console.log(e.message)
}

//ROUTES
app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(userDoc)
    } catch (e) {
        res.status(422).json(e)
    }
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const userDoc = await User.findOne({email})

    if (userDoc) {
        const passwordOk = bcrypt.compareSync(password, userDoc.password)
        if (passwordOk) {
            jwt.sign({
                name: userDoc.name,
                email: userDoc.email,
                id: userDoc._id
            }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });

        } else {
            res.status(422).json('pass is not ok!')
        }
    } else {
        res.json('not found!')
    }
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(userData.id);
            res.json({name, email, _id});
        });
    } else {
        res.json(null);
    }
});

app.get('/test', (req, res) => {
    res.json('test is ok!')
})

app.listen(process.env.PORT)