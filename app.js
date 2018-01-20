const crypto = require('crypto')
const express = require('express');

const config = require('./config.js')
const Diary = require('./mongodb/model.js').Diary

let app = express();
app.set('port', process.env.PORT || 3000);

let TOKEN = {
    str: '',
    expired: '',
};

let bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// 路由
app.post('/token', function(req, res) {
    password = req.body.password;
    currentTime = new Date();
    if (password == config.password) {
        const hash = crypto.createHash('sha256');
        let time = new Date().getTime();
        hash.update(String(time));
        hashSum = hash.digest('hex');
        TOKEN.str = hashSum;
        TOKEN.expired = time + 30 * 60 * 1000;
        console.log(currentTime.toLocaleDateString() + ' ' + currentTime.toLocaleTimeString() + ' ' + req.ip + '登陆成功');
        res.header('Access-Control-Allow-Origin', '*');
        res.send(hashSum);
    } else {
        console.log(currentTime.toLocaleDateString() + ' ' + currentTime.toLocaleTimeString() + ' ' + req.ip + '登陆失败');
        res.header('Access-Control-Allow-Origin', '*');
        res.statusCode = 401;
        res.send('401');
    }
});
app.use((req, res, next) => {
    currentTime = new Date();
    if (req.body.token == TOKEN.str && TOKEN.expired > currentTime.getTime()) {
        next();
    } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.statusCode = 401;
        res.send('401');
    }
});
app.post('/diaries/page/:page', (req, res) => {
    let allDiaries = [];
    Diary.find({}, (err, doc) => {
        if (err) {
            res.header('Access-Control-Allow-Origin', '*');
            res.send('');
        } else {
            doc.forEach((ele) => {
                let aDiary = {};
                aDiary.id = ele.id;
                aDiary.date = ele.date;
                aDiary.update = ele.update;
                aDiary.text = ele.text;
                allDiaries.push(aDiary);
            });
            allDiaries = allDiaries.reverse();
            let perPage = 20;
            let x = 0;
            let y = x + perPage;
            let diaryPage = [];
            for (var i = 0; i < Math.ceil(allDiaries.length / perPage); i++) {
                diaryPage.push(allDiaries.slice(x, y));
                x += perPage;
                y += perPage;
            }
            res.header('Access-Control-Allow-Origin', '*');
            res.json(diaryPage[Number(req.params.page) - 1]);
        }
    })
});
app.post('/diary/id/:id', (req, res) => {
    Diary.findOne({ id: Number(req.params.id) }, (err, doc) => {
        if (!err) {
            let aDiary = {};
            aDiary.id = doc.id;
            aDiary.date = doc.date;
            aDiary.update = doc.update;
            aDiary.text = doc.text;
            res.header('Access-Control-Allow-Origin', '*');
            res.json(aDiary);
        }
    });
});
app.post('/diary/add', (req, res) => {
    Diary.create({ id: new Date().getTime(), date: getTime(), update: '', text: req.body.text }, () => {
        res.header('Access-Control-Allow-Origin', '*');
        res.statusCode = 200;
        res.send('200 OK!');
    });
});
app.post('/diary/update', (req, res) => {
    Diary.findOne({ id: req.body.id }, (err, doc) => {
        doc.update = getTime();
        doc.text = req.body.text;
        doc.save((err) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.send('200 OK!');
        });
    });
});
app.post('/diary/delete', (req, res) => {
    Diary.findOne({ id: req.body.id }, (err, doc) => {
        doc.remove(() => {
            res.header('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.send('200 OK!');
        });
    });
});

// 404 页面
app.use(function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(404);
    res.send('404 - Not Found');
});
// 500 页面
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'text/plain');
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});


app.listen(app.get('port'), function() {
    console.log('Server started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});

function getTime() {
    let date = new Date();
    let time = {};
    time.year = date.getFullYear();
    time.mon = date.getMonth() + 1;
    time.day = date.getDate();
    time.hour = date.getHours();
    time.min = date.getMinutes();
    time.sec = date.getSeconds();
    return time;
}