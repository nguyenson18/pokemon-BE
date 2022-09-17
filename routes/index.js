var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome to CoderSchool!")
});
const pokemonRouter = require("./pokemon.api")
router.use('/api', pokemonRouter)

module.exports = router;
