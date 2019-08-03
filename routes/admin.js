const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const Quiz = require('../models/Quiz');
const FAQ = require('../models/QnA');
const Shop = require('../models/Shop');
const feedback = require('../models/Feedback');
const Sequelize = require('sequelize');
const fs = require('fs');
const Category = require("../models/Category")
const upload = require('../helpers/imageUpload');
const ensureAuthenticated = require('../helpers/auth');
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

router.get('/*', (req, res, next) => {
  let user = req.user;
  if (user == undefined || user.isAdmin != true) {
    alertMessage(res, 'danger', 'Access Denied! You are not an admin!', 'fas fa-exclamation-circle', true);
    res.redirect('/');
  }
  else {
    next();
  }
});

router.get('/admin-quiz', (req, res) => {
  let title = 'Add Quiz'
  res.render('admin/admin-quiz1', { title: title });
  // }
});

router.get("/create", (req, res) => {
  const title = "Create Category";
  res.render('admin/create', { title: title })
});

router.get('/faqform', (req, res) => {
  let title = 'faqform  '
  res.render('admin/faqform1', { title: title });
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
        let success_msg = qna.qns + "Deleted successfully";
        alertMessage(res, 'success_msg', success_msg, true);
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
router.get('/editproducts/:id', (req, res) => {
  let id = req.params.id
  let userId = req.user.id

  Shop.findOne({
    where: {
      id,
      userId
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
    res.render('admin/editproduct', { shop: shop })
    console.log(shop[0])
  }).catch(err => console.log(err)); // To catch no video ID
});

// Save edited video
router.post('/saveEditedVideo/:id', (req, res) => {
  // Retrieves edited values from req.body
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description.slice(0, 1999);
  let images = req.body.images;
  let userId = req.user.id;
  Shop.update({
    // Set variables here to save to the videos table
    name,
    price,
    description,
    images,
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
//quiz//
router.post('/addquiz', (req, res) => {
  let question = req.body.question;
  let option1 = req.body.option1;
  let option2 = req.body.option2;
  let option3 = req.body.option3;
  let option4 = req.body.option4;
  let correct = req.body.correct;

  sequelize.query("INSERT INTO quizzes(question, option1, option2, option3, option4, correct) VALUES (:questions,:option1s, :option2s, :option3s, :option4s, :corrects)"
    , { replacements: { questions: question, option1s: option1, option2s: option2, option3s: option3, option4s: option4, corrects: correct } })
    .then((quizzes) => {
      res.redirect('/admin/listquiz');
    });
})
router.get('/listquiz', (req, res) => {
  let title = 'List Quiz'
  sequelize.query("SELECT * FROM quizzes", raw = true).then(function (quiz) {
    res.render('admin/listquiz',
      {
        title: title,
        quiz: quiz[0],
      });
  })
});

router.get('/quizedit/:id', (req, res) => {
  let title = 'Edit Quiz'
  let id = req.params.id;
  sequelize.query('SELECT * FROM quizzes WHERE id= :ID ', { replacements: { ID: id } }, raw = true)
    .then(function (quiz) {
      console.log(quiz[0][0])
      if (quiz[0][0] == undefined) {
        alertMessage(res, 'danger', 'Quiz not found!', 'fas fa-exclamation-circle', true);
        res.redirect('/admin/listquiz');
      }
      else {
        res.render('admin/editquiz', { title: title, quiz: quiz[0][0] })
      }
    });
});

router.post('/saveEditedQuiz/:id', (req, res) => {
  let id = req.params.id;
  let question = req.body.question;
  let option1 = req.body.option1;
  let option2 = req.body.option2;
  let option3 = req.body.option3;
  let option4 = req.body.option4;
  let correct = req.body.correct;
  sequelize.query('UPDATE quizzes SET question= :Question, option1= :Option1, option2= :Option2, option3= :Option3, option4= :Option4, correct= :Correct WHERE id= :ID',
    { replacements: { Question: question, Option1: option1, Option2: option2, Option3: option3, Option4: option4, Correct: correct, ID: id } })
    .then((quiz) => {
      res.redirect('/admin/listquiz')
    }).catch(function (err) {
      alertMessage(res, 'danger', 'No such quiz to edit!', 'fas fa-check', true);
      res.redirect('/admin/listQuiz');
    });
});

router.get('/deleteQuiz/:id', (req, res) => {
  let id = req.params.id;
  Quiz.destroy({
    where: {
      id
    }
  }).then((quiz) => {
    console.log(quiz)
    if (quiz == 0) {
      alertMessage(res, 'danger', 'No such quiz to delete!', 'fas fa-check', true);
      res.redirect('/admin/listquiz')
    }
    else {
      alertMessage(res, 'success', 'Quiz deleted successfully!', 'fas fa-check', true);
      res.redirect('/admin/listQuiz');
    }
  });
});
//end quiz//
router.post('/addproducts', (req, res) => {
  let errors = []
  let name = req.body.name;
  let images = req.body.images;
  let price = req.body.price;
  let description = req.body.description;
  let userId = req.user.id;
  let category = req.body.category;

  if (!name) {
    errors.push({
      text: 'Please add a name'
    })
  }

  if (!images) {
    errors.push({
      text: 'Please add an image'
    })
  }

  if (!price) {
    errors.push({
      text: 'Please add a price'
    })
  }
  if (!description) {
    errors.push({
      text: 'Please add a name'
    })
  }

  if (errors.length > 0) {
    res.render('admin/addproduct', {
      errors,
      name,
      images,
      price,
      description
    })
  } else {
    sequelize.query("SELECT * from categories WHERE catName = :catName", { replacements: { catName: category } })
    .then((cat) => {
      if (cat == undefined) {
        alertMessage(res, 'danger', 'You need to create a category', true);
        res.redirect('/create')
      }
      if(cat){

        sequelize.query("INSERT INTO shops(images, name, price, description, userId, category, categoryId) VALUES (:images,:name, :price, :description, :userId, :category, :categoryId)"
          , { replacements: { images: images, name: name, price: price, description: description, userId: userId, category: category, categoryId: cat[0][0].id } })
          .then((products) => {
            res.redirect('/category');
          }).catch(err => console.log(err))

      }
    }).catch(err => console.log(err))
}
})


router.post("/create", (req, res) => {
  let catName = req.body.category
  let userId = req.user.id
  sequelize.query("INSERT INTO categories(catName, userId) VALUES (:catName, :userId)"
    , { replacements: { catName: catName, userId: userId } })
    .then((category) => {
      res.redirect("/create");
    })
})

router.get('/editCategory/:id', (req, res) => {
  let id = req.params.id
  let userId = req.user.id

  Category.findOne({
    where: {
      id,
      userId
    },
  }).then((c) => {
    if (!c) {
      alertMessage(res, 'info', 'No such category', 'fas fa-exclamation-circle', true);
      res.redirect('/');
    }
    res.render('admin/editcategory', { c: c })
  }).catch(err => console.log(err)); // To catch no video ID
});

router.post('/saveEditedCategory/:id', (req, res) => {
  let id = req.params.id;
  let category = req.body.category;
  sequelize.query('UPDATE categories SET catName= :category WHERE id= :ID',
    { replacements: { category: category, ID: id } })
    .then((category) => {
      res.redirect('/listcategory')
    }).catch(function (err) {
      alertMessage(res, 'danger', 'No such quiz to edit!', 'fas fa-check', true);
      res.redirect('/listcategory');
    });
});

router.get('/Catdelete/:id', (req, res) => {
  let id = req.params.id
  let userId = req.user.id

  Category.findOne({
    where: {
      id,
      userId
    }
  }).then((cat) => {
    if (!cat) {
      let error_msg = 'Product not found';
      alertMessage(res, 'danger', error_msg, 'fas fa-timers', false);
      res.redirect('/');
      return;
    }
    if (cat.userId != userId) {
      let error_msg = "Access denied";
      alertMessage(res, 'danger', error_msg, 'fas fa-timers', false);
      res.redirect('/');
      return;
    }b 
    cat.destroy({
      where: {
        id
      }
    }).then(() => {
      let success_msg = cat.name + " deleted successfully";
      alertMessage(res, 'success_msg', success_msg, true);
      res.redirect('/category');
    })
  }).catch(err => console.log(err)); // To catch no video ID
});

router.get('/listcategory', (req, res) => {
  const title = "List Category"
  Category.findAll({
    attributes: ['id', 'catName']
  }).then((category) => {

    res.render('admin/listCategory',
      {
        title: title,
        category: category
      });
  })
})

router.get('/delete/:id', (req, res) => {
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
//view feedback
router.get('/feedback', function (req, res) {
  const title = 'View Feedback';
  feedback.findAll({
    attributes: ['message', 'name', 'email', 'id']
  },
    raw = true
  ).then((feedback) => {
    res.render('admin/viewfeedback', {
      title: title,
      feedback: feedback,
    })
  })
    .catch(function (err) {
      res.render('admin/viewfeedback',
        { title: title })
    })

});
//delete feedback
router.get('/removefeed/:id', (req, res) => {
  feedbackId = req.params.id
  feedback.findOne({
    where: {
      id: feedbackId,
    }
  }).then((viewfeedback) => {
    console.log(viewfeedback)

    if (viewfeedback) {

      feedback.destroy({
        where: {
          id: feedbackId
        }
      }).then(() => {
        alertMessage(res, 'success', 'Deleted successfully!', 'fas fa-exclamation-circle', true);
        res.redirect('/admin/feedback')
      })
    }
    else {
      alertMessage(res, 'danger', 'Failed', 'fas fa-exclamation-circle', true);
      res.redirect('/admin/feedback');
    }
  })
});
module.exports = router;