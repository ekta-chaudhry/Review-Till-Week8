const express = require('express');

const app = express();

app.use(express.urlencoded({extended:true}));

app.get('/cross', (req, res, next) => {
    console.log('I got reached!')
    res.json({
        message: 'This came from server after GET request'
    });
})

let flag = 0;
app.post('/cross', (req, res, next) => {
    flag = 5;
    console.log(flag);
    res.json({
        message: 'This came from server after POST request'
    });
})
app.listen(8080);