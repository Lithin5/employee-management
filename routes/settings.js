var express = require('express');
var router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) =>
  res.render('access/settings/common', {
    user: req.user
  })
);

router.get('/ctccategory', ensureAuthenticated, (req, res) =>
  res.render('access/settings/ctccategory', {
    user: req.user
  })
);

module.exports = router;