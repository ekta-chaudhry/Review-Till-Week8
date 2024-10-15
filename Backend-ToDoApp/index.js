const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {z} = require('zod');

const {UserModel, TodoModel} = require('./db');
const {auth, JWT_SECRET} = require('./auth');

const app = express();

//parsing incoming requests' body.
app.use(express.json());

app.post('/signup', (req, res, next) => {
    const bodySchema = z.object({
        name: z.string().min(3).max(80),
        email: z.string().min(11).max(70).email(),
        password: z.string().min(5).max(30)
    })

    const parsedData = bodySchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Incorrect format!",
            error: parsedData.error
        })
    }
    const {name, email, password} = req.body;
    
    UserModel.findOne({
        email
    })
    .then((user) => {
        if(user) {
            res.status(400).json({
                message: "Account already exists!"
            })
        }else{
            bcrypt.hash(password, 5, (err, hashedPassword) => {
                UserModel.create({
                    name, email,
                    password: hashedPassword
                })
                .then(() => {
                    res.status(201).json({
                        message: "Account Created!"
                    })
                });
            });
        }
    })
})

app.post('/login', (req, res, next) => {
    const {email, password} = req.body;
    UserModel.findOne({
        email
    })
    .then((user) => {
        if(user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if(!result) {
                    return res.status(401).json({
                        message: "Incorrect password!"
                    })
                }else{
                    const token = jwt.sign({
                        userId: user._id.toString()
                    }, JWT_SECRET);
                    return res.status(200).json({
                        token
                    });    
                }
            })
        }else{
            return res.status(401).json({
                message: "Invalid Credentials!"
            });
        }
    });
})

app.post('/insert-todo', auth, (req, res, next) => {
    const userId = req.userId;
    const {title} = req.body;
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
    const userId = req.userId;
    TodoModel.find({userId})
    .populate('userId')
    .then(todos => {
        return res.status(200).json({
            todos
        })
    })
    .catch(err => {
        return res.status(400).json({
            err
        })
    })
})

mongoose.connect("mongodb+srv://ekta00sea:passworderror404@cluster0.7vsduk6.mongodb.net/todos?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("Connected!");
    app.listen(3000);
});


