const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');

router.get('/admin-quiz', (req, res) => {
    let title = 'adminquiz'
    res.render('admin/admin-quiz', {title:title});
  });


  module.exports = router;