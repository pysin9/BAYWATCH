const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');


/* GET index */
router.get('/', function (req, res) {
  const title = "NewOrganics";
  res.render('index', { title: title });
});


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


router.get('/Login', (req, res) => {
  const title = 'Login';
  res.render('user/login', { title: title })
});


/*User Register*/
router.get('/Register', (req, res) => {
  const title = 'Register';
  res.render('user/register', { title: title })
});

/* NewOrganics Shop */
router.get('/shop', function (req, res) {
  const title = "Shop";
  res.render('shop/shop', { title: title });
});

/* GET quiz */
router.get('/quiz', function (req, res) {
  const title = "Quiz";
  res.render('quiz/quiz', { title: title });
});

router.get('/faq', (req, res) => {
  const title = 'FAQ';
  res.render('faq/faq', { title: title })
})

router.get('/about', (req, res) => {
  const title = "About"
  res.render('about', { title: title });
});
module.exports = router;
