import express from 'express'
import mysql from 'mysql'

const router = express.Router();

router.post('/', function(req, res, next) {
    const action = req.body.action
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    const connection = mysql.createConnection({
        host     : '10.0.0.13',
        user     : 'test',
        password : 'Fqw4ZLkN',
        database : 'test'
    });
    
    if(action === 'register')
    {
        const sql = 2
        connection.query('INSERT INTO users (uid, email, username, password, role) VALUES (?, ?, ?, ?, ?)', [18, email, username, password, 1], (err, result) => {
            if(err) throw err
            console.log("INSERTED")
        })
    }

    res.redirect('/');
});
    

export default router