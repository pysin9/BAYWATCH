const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const Quiz = require('../models/Quiz');
const FAQ = require('../models/QnA')
const Shop = require('../models/Shop')
const Sequelize = require('sequelize')

const sequelize = new Sequelize('organic', 'organic', 'green', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

router.get('/admin-quiz', (req, res) => {
  let title = 'adminquiz'
  res.render('admin/admin-quiz', { title: title });
});

router.get('/faqform', (req, res) => {
  let title = 'faqform  '
  res.render('admin/faqform', { title: title });
});

router.get('/remove/:id', (req, res) => {
  qnaId = req.params.id
  FAQ.findOne({
      where: {
          id: qnaId,
      }
  }).then((qna) => {
    console.log(qna)
      if (qna != null) {

          FAQ.destroy({
              where: {
                  id: qnaId
              }
          }).then(() => {
              res.redirect('/faq')
          })
      } 
      else {
          alertMessage(res, 'danger', 'Access Denied', 'fas fa-exclamation-circle', true);
          res.redirect('/logout');


      }
  })
});

router.get('/addproducts', (req, res) => {
  let title = 'Add Products'
  res.render('admin/addproduct', { title: title });
});

// Shows edit video page
router.get('/editproducts', (req, res) => {
  Shop.findOne({
    where: {
      id: 1
    },
  }).then((shop) => {
    if (!shop) {
      alertMessage(res, 'info', 'No such video', 'fas fa-exclamation-circle', true);
      res.redirect('/');
    // } else {
    //   if (req.user.id === shop.userId) {
    //     checkOptions(shop);
    //     res.render('admin/editproduct', { shop:shop });
    //   } else {
    //     alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
    //     res.redirect('/logout');
    //   }
    }
    res.render('admin/editproduct', {shop:shop})
    console.log(shop[0])
  }).catch(err => console.log(err)); // To catch no video ID
});

// Save edited video
router.post('/saveEditedVideo/:id', (req, res) => {
  // Retrieves edited values from req.body
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description.slice(0, 1999);
  let userId = req.user.id;
  Shop.update({
      // Set variables here to save to the videos table
      name,
      price,
      description,
      userId
  }, {
          where: {
              id: req.params.id
          }
      }).then(() => {
          // After saving, redirect to router.get(/listVideos...) to retrieve all updated
          // videos
          res.redirect('/category');
      }).catch(err => console.log(err));
});

router.post('/addqns', (req, res) => {
  let qns = req.body.qns;
  let ans = req.body.ans;

  FAQ.create({
    qns,
    ans
  }).then((form) => {
    res.redirect('/faq');
  })
    .catch(err => console.log(err))
});

router.post('/addquiz', (req, res) => {
  let question = req.body.question;
  let option1 = req.body.option1;
  let option2 = req.body.option2;
  let option3 = req.body.option3;
  let option4 = req.body.option4;
  let correct = req.body.correct;

sequelize.query("INSERT INTO quizzes(question, option1, option2, option3, option4, correct) VALUES (:questions,:option1s, :option2s, :option3s, :option4s, :corrects)"
,{replacements: {questions: question, option1s: option1, option2s: option2, option3s:option3, option4s:option4,corrects:correct}})
.then((quizzes)=>{
  res.redirect('/quiz');
});

  // Quiz.create({
  //   question,
  //   option1,
  //   option2,
  //   option3,
  //   option4,
  //   correct,

  // }).then((quizzes) => {
  //   res.redirect('/quiz');
  // })
  //   .catch(err => console.log(err))
})

router.post('/addproducts', (req, res) => {
  let name = req.body.name;
  let images = req.body.images;
  let price = req.body.price;
  let description = req.body.description;
  let userId = req.user.id;

  Shop.create({
    images,
    name,
    price,
    description,
    userId
  }).then((products) => {
    res.redirect('/shop');
  })
    .catch(err => console.log(err))
})

router.get('/delete/:id',  (req, res) => {
  let id = req.params.id
  let userId = req.user.id

  Shop.findOne({
    where: {
      id,
      userId
    }
  }).then((products) => {
    if (!products) {
      let error_msg = 'Product not found';
      alertMessage(res, 'danger', error_msg, 'fas fa-timers', false);
      res.redirect('/');
      return;
    }
    if (products.userId != userId) {
      let error_msg = "Access denied";
      alertMessage(res, 'danger', error_msg, 'fas fa-timers', false);
      res.redirect('/');
      return;
    }
    products.destroy({
      where: {
        id
      }
    }).then(() => {
      let success_msg = products.name + " deleted successfully";
      alertMessage(res, 'success_msg', success_msg, true);
      res.redirect('/category');
    })
  }).catch(err => console.log(err)); // To catch no video ID
});

router.post('/upload', (req, res) => {
  // Creates user id directory for upload if not exist
  if (!fs.existsSync('./public/uploads/' + req.user.id)) {
    fs.mkdirSync('./public/uploads/' + req.user.id);
  }

  upload(req, res, (err) => {
    if (err) {
      res.json({ file: '/img/no-image.jpg', err: err });
    } else {
      if (req.file === undefined) {
        res.json({ file: '/img/no-image.jpg', err: err });
      } else {
        res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
      }
    }
  });
})
module.exports = router;