const express = require('express');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'UNSIGNED';

const app = express();
let users = [];

app.use(express.json());
app.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username == username && user.password == password);
    if(user) {
        res.status(400).json({
            message: 'User already exists!'
        })
    }else{
        users.push({
            username,
            password
        })
        res.status(201).json({
            message: 'User account created!'
        })
    }
});

app.post('/signin', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username == username && user.password == password);
    if(!user) {
        res.status(401).json({
            message: 'Invalid Credentials!'
        })
    }else{
        const payload = {
            username: username
        }

        const token = jwt.sign(payload, SECRET_KEY);
        res.status(200).json({
            token: token
        })
    }
});

app.get('/authenticated', (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                message: 'Token is invalid!'
            })
        }
        res.status(200).json({
            username: decoded.username
        })
    })
})
app.listen(3000);