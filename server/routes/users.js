import express from 'express'
const router = express.Router()

import dba from '../modules/Database.js';


const database = new dba();
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Users ");
  console.log(req.cookies['token']);
  res.send(req.cookies['token']);
  
  for(let i = 0; i < 100; i++)
  {
    database.query("INSERT INTO map (id, username) VALUES (?, '---')", [i]);
  }
  

});

export default router
