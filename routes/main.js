const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const Quiz = require('../models/Quiz')

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

/* Shop Fruits */
router.get('/fruits', function (req, res) {
  const title = "Fruits";
  res.render('shop/shopfruits', { title: title });
});

/* Shop Herbs and Spices */
router.get('/herbsandspices', function (req, res) {
  const title = "Fruits";
  res.render('shop/shopherbsandspices', { title: title });
});

/* Cart */
router.get('/cart', function (req, res) {
  const title = "Cart";
  res.render('shop/cart', { title: title });
});

/* GET quiz */
router.get('/quiz', function (req, res) {
  const title = "Quiz";
  Quiz.findAll({
    where: {
      id:1 
    },
    raw: true
  })
    .then((quiz) => {
      res.render('quiz/quiz', {
        quiz:quiz,
        title: title,
        question: quiz[0].question,
        option1: quiz[0].option1,
        option2: quiz[0].option2,
        option3: quiz[0].option3,
        option4: quiz[0].option4,
      });
      
    })
    .catch(err => console.log(err));
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
