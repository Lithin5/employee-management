var express = require('express');
var router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index',{message: req.flash('error') }));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('access/dashboard', {
    user: req.user
  })
);
router.get('/users', ensureAuthenticated, (req, res) =>
  res.render('access/users', {
    user: req.user
  })
);

router.get('/users/addusers', ensureAuthenticated, (req, res) =>
  res.render('access/adduser', {
    user: req.user
  })
);
module.exports = router;
