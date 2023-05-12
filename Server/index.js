const express = require('express');
const mysql = require('mysql');
require('dotenv').config();
const bodyPraser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(bodyPraser.json());
app.use(cors());

app.use(cors({
    origin: '*',
    allowedHeaders: 'Authorization',
    methods: ['GET', 'POST','PUT']
}));


// console.log(process.env.HOST_NAME,process.env.PORT,process.env.USER_NAME,process.env.PASSWORD,process.env.DATABASE_NAME);

const conncetion = mysql.createConnection({
    host: process.env.HOST_NAME,
    port: process.env.PORT,
    user: process.env.USER_NAME || 'root',
    password: process.env.PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'portfolio'
});

conncetion.connect();

app.get('/getall', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    conncetion.query('select id, name, email, summary ,message from PortfolioMessage where isDeleted = ?',[0], (error, result) => {
        if (error) {
            result = { message: 'error' }
            console.log('error ' + error);
        } else {
            // console.log('result is ' + JSON.stringify(result));
        }
        res.end(JSON.stringify(result));
    });
});

app.get('/getUser/:id', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    let sql = `select id, name, email, summary ,message from PortfolioMessage where id = ?`;
    const {id} = req.params;
    conncetion.query(sql, [id], (error, result) => {
        if (error) {
            result = { message: 'error' }
            console.log('error ' + error);
        } else {
            // console.log('result is ' + JSON.stringify(result));
        }
        res.end(JSON.stringify(result));
    });
});


app.post('/insert', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

    let sql = `INSERT INTO PortfolioMessage (name,email,summary,message,updated_by,created_by) VALUES(?,?,?,?,?,?)`;
    const {name, email, summary, message} = req.body;
    conncetion.query(sql, [name, email, summary, message, name, name], (error, result) => {
        if (error) {
            console.log("error " + error);
            res.end(JSON.stringify({ Message: "error" }));
        } else {
            // console.log("Result " + JSON.stringify(result));
            res.end(JSON.stringify(result));
        }
    })
});

app.put('/update', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

    let sql = `update PortfolioMessage set name = ?, email = ? ,summary = ?, message = ? where id = ?`;
    const {name,email,summary,message,id} = req.body;
    conncetion.query(sql, [name,email, summary, message ,id], (error, result) => {
        if (error) {
            console.log("error " + error);
            res.end(JSON.stringify({ Message: "error" }));
        } else {
            // console.log("Result " + JSON.stringify(result));
            res.end(JSON.stringify(result));
        }

    })
});

app.put('/delete', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

    let sql = `update PortfolioMessage set isDeleted = ? where id = ?`;
    let {id} = req.body;
    conncetion.query(sql, [1, id], (error, result) => {
        if (error) {
            console.log("error " + error);
            res.end(JSON.stringify({ Message: "error" }));
        } else {
            // console.log("Result " + JSON.stringify(result));
            res.end(JSON.stringify(result));
        }
    });

});


app.listen(3000, () => {
    console.log(`Server started on http://localhost:3000`);
});