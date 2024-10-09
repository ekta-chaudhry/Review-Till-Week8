const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const {UserModel, TodoModel} = require('./db');
const {auth, JWT_SECRET} = require('./auth');

const app = express();

//parsing incoming requests' body.
app.use(express.json());

app.post('/signup', (req, res, next) => {
    const {name, email, password} = req.body;
    UserModel.findOne({
        name, email, password
    })
    .then((user) => {
        if(user) {
            res.status(400).json({
                message: "Account already exists!"
            })
        }else{
            UserModel.create({
                name, email, password
            })
            .then(() => {
                res.status(201).json({
                    message: "Account Created!"
                })
            });
        }
    })
})

app.post('/login', (req, res, next) => {
    const {email, password} = req.body;
    UserModel.findOne({
        email, password
    })
    .then((user) => {
        if(user) {
            const token = jwt.sign({
                userId: user._id.toString()
            }, JWT_SECRET);
            return res.status(200).json({
                token
            });
        }
        return res.status(401).json({
            message: "Invalid Credentials!"
        });
    });
})

app.post('/insert-todo', auth, (req, res, next) => {
    const {userId, title} = req.body;
    TodoModel.create({
        userId,
        title,
        done: false
    })
    .then(() => {
        return res.json({
            message: `Todo added for user: ${userId}`
        });
    })
})

app.get('/get-todos', auth, (req, res, next) => {
    
})

mongoose.connect("mongodb+srv://ekta00sea:passworderror404@cluster0.7vsduk6.mongodb.net/todos?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("Connected!");
    app.listen(3000);
});


