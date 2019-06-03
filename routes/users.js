var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET user profile */
router.get('/profile', function(req, res) {
  const title = "Profile";
  res.render('user/profile', { title: title });
});

module.exports = router;
