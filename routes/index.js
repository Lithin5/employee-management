var express = require('express');
var router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
var fs = require("fs");
var multer = require('multer');
var cpath = require('path')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/profilepictures')
  },
  filename: function (req, file, cb) {    
    cb(null, file.fieldname + '-' + Date.now() + cpath.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index', { message: req.flash('error') }));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('access/dashboard', {
    user: req.user
  })
);
router.get('/users', ensureAuthenticated, (req, res) => {
  User.find({ "email": { $ne: req.user.email } }, function (err, users) {
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
router.post('/users/saveuser', upload.single('file'), ensureAuthenticated, (req, res) => {
  var newuser = new User(req.body);
  newuser.password = "Password@1";
  newuser.power = "2";
  newuser.status = "active";
  if(req.file.filename){
    newuser.profilepicture = req.file.filename;
  }  
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newuser.password, salt, (err, hash) => {
      if (err) throw err;
      newuser.password = hash;
      newuser
        .save()
        .then(user => {
          req.flash(
            'success_msg',
            'New User has been created, Default password is Password@1'
          );
          res.redirect('/users');
        })
        .catch(err => console.log(err));
    });
  });
}
);
module.exports = router;
