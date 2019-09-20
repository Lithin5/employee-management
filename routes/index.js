var express = require('express');
var router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index', { message: req.flash('error') }));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('access/dashboard', {
    user: req.user
  })
);
router.get('/users', ensureAuthenticated, (req, res) => {
  User.find({ "email": { $ne: req.user.name } }, function (err, users) {
    res.render('access/users', {
      user: req.user,
      user_list: users
    })
  });
}
);

router.get('/users/addusers', ensureAuthenticated, (req, res) => {
  res.render('access/adduser', {
    user: req.user
  });
});
router.post('/users/saveuser', ensureAuthenticated, (req, res) => {
  var newuser = new User(req.body);
  newuser.password = "Password@1";
  newuser.power = "2";
  newuser.status = "active";
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newuser.password, salt, (err, hash) => {
      if (err) throw err;
      newuser.password = hash;
      newuser
        .save()
        .then(user => {
          req.flash(
            'success_msg',
            'You are now registered and can log in'
          );
          res.redirect('/users');
        })
        .catch(err => console.log(err));
    });
  });
}
);
module.exports = router;
