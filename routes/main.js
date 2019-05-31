var express = require('express');
var router = express.Router();


/* GET index */
router.get('/', function (req, res) {
  const title = "NewOrganics";
  res.render('index', { title: title });
});
router.get('/Login', (req, res) => {
  const title = 'Login';
  res.render('user/login', { title: title })
});
/*User Register*/
router.get('/Register', (req, res) => {
  const title = 'Register';
  res.render('user/register', { title: title })
})
/* GET quiz */
router.get('/quiz', function (req, res) {
  const title = "Quiz";
  res.render('quiz/quiz', { title: title });
});


module.exports = router;
