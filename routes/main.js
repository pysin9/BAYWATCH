const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const Quiz = require('../models/Quiz')
const Sequelize = require('sequelize');
const Math = require("math");
const Shop = require('../models/Shop');
const qna = require("../models/QnA")
const Cart = require('../models/Cart');
const feedback = require('../models/Feedback');
const moment = require('moment');
const user = require('../models/User');
const Category = require("../models/Category");
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

/* GET index */
router.get('/', function (req, res) {
  const title = "NewOrganics";
  let date = new Date();
  let nowdate = date.toString().substring(4, 15);
  if (req.user == undefined) {
    console.log('it works!');
  }
  else {
    let id = req.user.id;
    sequelize.query("SELECT * FROM users where id= :ID", { replacements: { ID: id } }, raw = true)
      .then((users) => {
        let currday = users[0][0].signin;
        if (currday != nowdate && users[0][0].isNotAdmin == true) {
          alertMessage(res, 'info', 'Welcome back! Check your profile for a login bonus!', 'fas fa-exclamation-circle', true);
        }
      })
  }
  sequelize.query("SELECT * from ratings")
  .then((rate)=>{
    let shopId = rate[0][0].shopId
    if (shopId == undefined){
      console.log('There is no rating')
    }
    else{
      Shop.findAll({
        where:{
          id: shopId
        }
      }).then((shop) =>{
        console.log(shop)
      })
    }
  })
  res.render('index', { title: title });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


router.get('/forgot', (req, res) => {
  const title = 'Reset Password';
  res.render('user/forgot', { title: title })
});

router.get('/Login', (req, res) => {
  const title = 'Login';
  sequelize.query("UPDATE users SET isAdmin = '1' WHERE email = 'admin@gmail.com'")
  sequelize.query("UPDATE users SET isNotAdmin = '0' WHERE email = 'admin@gmail.com'")
  sequelize.query("UPDATE users SET verified = '1' WHERE email = 'admin@gmail.com'")
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

router.get("/create", (req, res) => {
  const title = "Create Category";
  res.render('admin/create', { title: title })
});

router.post('/addTotal', function (req, res) {
  console.log('IT WORKS----------------------------------------------')
  let subTotal = req.body.subTotal;
  let id = 1;
  sequelize.query("UPDATE carts SET subtotal= :subTOTAL WHERE id= :id", { replacements: { subTOTAL: subTotal, id: id } })
    .then((result) => {
      console.log('it works')
      res.redirect('/cart');
    });

  // Cart.findAll({
  //   where: {
  //     id:id
  //   }
  // }).then((c)=>{

  //   Cart.create({
  //     subTotal
  //   });
  // })

})

/* Shop Categories */
router.get('/category', function (req, res) {
  const title = "Category";
  Category.findAll({
    attributes: ['id', 'catName'],
    // sequelize.query("SELECT * from categories")
  }).then((category) => {
    Shop.findAll({
      attributes: ['id', 'name', 'price', 'images', 'description', 'category'],
      order: [
        ['name', 'ASC']
      ]
    },
      raw = true
    ).then((shop) => {
      // sequelize.query("SELECT * from categories")

      res.render('shop/shopcategory', {
        title: title,
        shop: shop,
        category: category,


      })

    })
  })
    .catch(err => console.log(err));
});

router.get('/category2', function (req, res) {
  const title = "Shop"
  Category.findAll({
    attributes: ['id', 'catName'],
    // sequelize.query("SELECT * from categories")
  }).then((category) => {
    console.log(category[0].id)
    let id = category[0].id
    Shop.findAll({
      attributes: ['id', 'name', 'price', 'images', 'description', 'category'],
      where: {
        categoryId: id
      },
      order: [
        ['name', 'ASC']
      ]
    },
      raw = true
    ).then((shop) => {
      console.log(shop)
      res.render('shop/shopcategory', {
        title: title,
        category: category,
        shop: shop,
        ID: category[0].id
      })
    })
  })
});

router.get("/category2/:id", (req, res) => {
  let categoryId = req.params.id
  console.log(categoryId)
  Category.findAll({
    attributes: ['id', 'catName'],
    // sequelize.query("SELECT * from categories")
  }).then((category) => {
    Shop.findAll({
      attributes: ['id', 'name', 'price', 'images', 'description', 'category'],
      where: {
        categoryId: categoryId
      },
      order: [
        ['name', 'ASC']
      ]
    },
      raw = true
    ).then((shop) => {
      console.log(shop)
      res.render('shop/shopcategory', {

        category: category,
        shop: shop,

      })
    })
  })
})

router.get('/removeAdd/:id', (req, res) => {
  let Id = req.params.id
  Cart.findOne({
    where: {
      id: Id
    }
  }).then((cart) => {
    console.log(qna)
    if (cart != null) {

      Cart.destroy({
        where: {
          id: Id
        }
      }).then(() => {
        let success_msg = cart.name + " removed successfully";
        alertMessage(res, 'success_msg', success_msg, true);
        res.redirect('/cart')
      })
    }
    else {
      alertMessage(res, 'danger', 'Access Denied', 'fas fa-exclamation-circle', true);
      res.redirect('/logout');


    }
  })
});


/* Add To Cart */
router.post('/addToCart/:id', (req, res) => {
  let itemId = req.params.id;
  let userId = req.user.id;
  let images = req.body.images;
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description;

  console.log('dbjxv');
  console.log(itemId);

  // Cart.create({
  //   itemId,
  //   userId,
  //   images,
  //   name,
  //   price,
  //   description
  // }).then((cart) => {
  //   res.redirect('/category'); // redirect to call router.get(/listVideos...) to retrieve all updated
  //   // videos
  // }).catch(err => console.log(err))

  Cart.findOne({ where: { itemId: itemId } })
    .then(product => {
      if (product) {
        let quantity = product.quantity + 1;
        Cart.update({
          // Set variables here to save to the videos table
          quantity
        }, {
            where: {
              itemId: itemId
            }
          });
      } else {
        let quantity = 1;
        Cart.create({
          itemId,
          userId,
          images,
          name,
          price,
          description,
          quantity
        });
      }
    });
  return res.redirect('/category');

});

/* Cart */
router.get('/cart', function (req, res) {
  const title = "Cart";
  let userId = req.user.id;

  let items = [];

  Cart.findAll({
    where: {
      userId: userId
    }
  }).then(product => {
    res.render('shop/cart', {
      product
    });
    console.log(product);
    /*for (let i = 0; i < products.length; i++) {
      Shop.findOne({
        attributes: ['name', 'price'],
        where: {
          id: products[i].id
        }
      }).then(item => {
        console.log(item);
        items.push(item.dataValues);*/
  }).then(console.log(items));
})






/* GET quiz */
router.get('/quiz', function (req, res) {
  const title = "Quiz";
  let user = req.user;
  let id = req.user.id;
  let date = new Date();
  let nowdate = date.toString().substring(4, 15);
  //test date retrieve
  sequelize.query('SELECT quizcompleted FROM users WHERE id= :ID', { replacements: { ID: id } }, raw = true)
    .then(function (compdate) {
      let currday = compdate[0][0].quizcompleted
      if (nowdate != currday) {
        sequelize.query("SELECT * FROM quizzes", raw = true).then(result => {
          let length = result[0].length;
          let getIndex = getRndInteger(0, length - 1);
          let selectedID = result[0][getIndex].id
          sequelize.query("SELECT * FROM quizzes WHERE id = :id ", { replacements: { id: selectedID }, type: sequelize.QueryTypes.SELECT }
          ).then(function (quiz) {
            console.log(quiz)
            res.render('quiz/quiz',
              {
                title: title,
                quiz: quiz,
                option1: quiz[0].option1,
                option2: quiz[0].option2,
                option3: quiz[0].option3,
                option4: quiz[0].option4,
                question: quiz[0].question,
                correct: quiz[0].correct,
                user: user
              });
          });
        })
          .catch(function (err) {
            res.render('quiz/quiz',
              { title: title })
          });
      }
      else {
        res.render('quiz/quiz',
          { title: title })
      }
    })
});

router.post('/submitedquiz', function (req, res) {
  const title = 'Quiz';
  let ID = req.user.id;
  let user = req.user;
  let points = parseInt(req.body.points);
  let date = new Date();
  let dateday = date.toString().substring(4, 15);
  sequelize.query("UPDATE users SET points= :Points, quizcompleted= :Date WHERE id= :Id", { replacements: { Id: ID, Points: points, Date: dateday } })
    .then((users) => {
      res.redirect('/quiz');
    });
});

router.get('/faq', (req, res) => {
  const title = 'FAQ';
  let isadmin = req.user.isAdmin;
  console.log(isadmin)
  qna.findAll({
    attributes: ['qns', 'ans', 'id']
  },
    raw = true
  ).then((qna) => {
    res.render('faq/faq1', {
      title: title,
      qna: qna,
      isadmin: isadmin
    })
  })
    .catch(function (err) {
      res.render('faq/faq1',
        { title: title })
    })

});
router.get('/about', (req, res) => {
  const title = "About"
  res.render('about', { title: title });
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.get('/admin', (req, res) => {
  const title = 'Admin';
  res.render('admin', { title: title })
})

router.get('/profile', function (req, res) {
  const title = "Profile";
  let user = req.user;
  let id = user.id;
  let date = new Date();
  let nowdate = date.toString().substring(4, 15);

  sequelize.query("SELECT * FROM users WHERE id = :ID", { replacements: { ID: id } }, raw = true)
    .then((user) => {
      let currday = user[0][0].signin
      if (nowdate == currday) {
        res.render('user/profile1', { title: title, user: user[0][0] });
      }
      else {
        nosignin = true;
        res.render('user/profile1', { title: title, user: user[0][0], nosignin: nosignin });
      }
    })
});
router.get('/password', function (req, res) {
  const title = "Password";
  let user = req.user;
  if (user == undefined) {
    alertMessage(res, 'danger', 'User not found! Log in to access password', 'fas fa-check', true);
    res.redirect('/');
  }
  else {
    res.render('user/password1', { title: title });
  }
});
// post rating
router.get('/listrating/:id', function (req, res) {
  const title = "Ratings"
  let id = req.params.id;
  sequelize.query("SELECT * FROM shops WHERE id= :ID", { replacements: { ID: id } }, raw = true).then((shop) => {
    sequelize.query("SELECT * FROM ratings WHERE shopId= :ID", { replacements: { ID: id } }, raw = true).then((ratings) => {
      sequelize.query("SELECT avg(rating) avgrat FROM ratings WHERE shopId= :ID", { replacements: { ID: id } }, raw = true).then((avgrat) => {
        console.log(shop)
        res.render('shop/listrating', {
          title: title,
          shop: shop[0][0],
          ratings: ratings[0],
          username: ratings[0][0].username,
          date: ratings[0][0].date,
          rating: ratings[0][0].rating,
          avgrating: avgrat[0][0].avgrat,
        });
      }).catch(function (err) {
        res.render('shop/listrating', { title: title, shop: shop[0][0] });;
    })
      .catch(function (err) {
        res.render('shop/listrating', { title: title, shop: shop[0][0] });
      });
    });
  });

});

router.post('/postrating/:id', function (req, res) {
  let id = req.params.id;
  let Id = req.user.id;
  let username = req.user.name;
  let date = new Date();
  let currdate = date.toString().substring(4, 15);
  let rating = req.body.rating;
  sequelize.query("INSERT INTO ratings(username, rating, date, shopId, userId) VALUES(:Username, :Rating, :Date, :ID, :userID)", { replacements: { Username: username, Rating: rating, Date: currdate, ID: id, userID: Id } })
    .then(() => {
      let rated = true;
      sequelize.query("UPDATE users SET hasrated= :Rated WHERE id= :ID", { replacements: { Rated: rated, ID: Id } }).then(() => {
        res.redirect('/listrating/' + id);
      });
    });
});

router.post('/epostrating/:id', function (req, res) {
  let id = req.params.id;
  let ID = req.user.id;
  let date = new Date();
  let currdate = date.toString().substring(4, 15);
  let rating = req.body.rating;
  sequelize.query("UPDATE ratings SET rating= :Rating, date= :Date WHERE userId= :userID", { replacements: { Rating: rating, Date: currdate, userID: ID } })
    .then(() => {
      res.redirect('/listrating/' + id);
    });
});
//end rating

//feedback
router.get('/feedback', function(req, res){
    title = 'Feedback'
    res.render('faq/feedback', {title:title})
});

router.post('/feedback', (req, res) => {
  
  let message = req.body.message;
  let name = req.body.name;
  let email = req.body.email;

  feedback.create({
    message,
    name,
    email,
  }).then((cart) => {
    alertMessage(res, 'success', 'Feedback sent!', 'fas fa-exclamation-circle', true);
    res.redirect('/feedback'); // redirect to call router.get(/listVideos...) to retrieve all updated
    // videos
  }).catch(err => console.log(err))
});
//end feedback

router.get('/checkout1', function (req, res) {
  const title = "Checkout";
  res.render('Checkout/checkout1', { title: title });
});

router.get('/checkout2', function (req, res) {
  const title = "Checkout";
  res.render('Checkout/checkout2', { title: title });
});

router.get('/checkout3', function (req, res) {
  const title = "Checkout";
  res.render('Checkout/checkout3', { title: title });
});

router.get('/checkout4', function (req, res) {
  const title = "Checkout";
  res.render('Checkout/checkout4', { title: title });
});
router.get('/Reciept', function (req, res){
  const title = "reciept";
  res.render('Checkout/Reciept', {title: title});
});
module.exports = router;
