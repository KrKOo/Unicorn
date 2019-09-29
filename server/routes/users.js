import express from 'express'
const router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Users ");
  console.log(req.cookies['token']);
  res.send(req.cookies['token']);
});

export default router
