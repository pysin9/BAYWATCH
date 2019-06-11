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

/* Shop Categories */
router.get('/category', function (req, res) {
  const title = "Category";
  res.render('shop/shopcategory', { title: title });
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
      
    },
    raw: true
  })
    .then((quizzes) => {
    })
    .catch(err => console.log(err));

  Quiz.findAll({
    where: {
      id: 2
    },
    raw: true
  })
    .then((quizzes) => {
      res.render('quiz/quiz', {
        quizzes: quizzes,
        title: title,
        question: quizzes[0].question,
        option1: quizzes[0].option1,
        option2: quizzes[0].option2,
        option3: quizzes[0].option3,
        option4: quizzes[0].option4,
        correct: quizzes[0].correct,
      });
    })
    .catch(err => console.log(err));
});

router.get('/checkquiz', (req, res) => {
  const title = 'Check';
  res.render('quiz/quiz', { title: title })
})

router.get('/faq', (req, res) => {
  const title = 'FAQ';
  res.render('faq/faq', { title: title })
})

router.get('/about', (req, res) => {
  const title = "About"
  res.render('about', { title: title });
});
module.exports = router;
