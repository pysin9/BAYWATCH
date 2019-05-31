var express = require('express');
var router = express.Router();


/* GET index */
router.get('/', function(req, res) {
  const title = "NewOrganics";
  res.render('index', { title: title });
});

/* GET quiz */
router.get('/quiz', function(req, res) {
  const title = "Quiz";
  res.render('quiz/quiz', { title: title });
});


module.exports = router;
