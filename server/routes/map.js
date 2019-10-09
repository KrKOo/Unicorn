import express from 'express'
const router = express.Router()

import dba from '../modules/database.js';

const database = new dba();

router.get('/', function(req, res, next) {

    const mapName = req.body.mapName;

    console.log(req.body);

    // database.query("SELECT * FROM ?", [mapName])
    //     .then(result => {
    //         console.log(result);
    //         res.send(result);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
});
    

export default router;
