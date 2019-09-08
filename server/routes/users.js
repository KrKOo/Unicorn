import express from 'express'
const router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Users ")
  res.send("Krookoooooooaasasdaaaaaaas")
});

export default router
