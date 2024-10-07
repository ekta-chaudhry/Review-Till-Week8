const express = require('express');
const app = express();

app.use(express.json());

function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}
let users = []
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
        });
        res.status(201).json({
            message: "User account created!"
        })
    }
});

app.post('/signin', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find(user => user.username == username && user.password == password);
    if(!user) {
        res.status(400).json({
            message: 'Invalid credentials!'
        })
    }else{
        const token = generateToken();
        user.token = token
        res.status(200).json({
            token: token,
            message: 'Sign in successfull!'
        })
    }
});

app.get('/me', (req, res, next) => {
    const token = req.headers.authorization;
    const user = users.find(user => user.token == token);
    if(user) {
        res.status(200).json({
            username: user.username,
            password: user.password
        })
    }else{
        res.status(404).json({
            message: 'Invalid token!'
        })
    }
})
app.listen(3000);