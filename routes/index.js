var express = require('express');
var router = express.Router();
const User = require('../models/User');
const CTCCategoryList = require("../models/ctccategory");
const CtcData = require("../models/ctcdata");
const BankAccount = require("../models/bankdetails");

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
    });
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
  if (typeof req.file !== "undefined") {
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
router.get('/users/viewuser/:userId', ensureAuthenticated, (req, res) => {
  User.findOne({ "_id": req.params.userId }, function (err, cuser) {
    CTCCategoryList.find({}, function (err, ctccategorylist) {
      BankAccount.findOne({ "userid": req.params.userId }, (err, BnkAcc) => {
        res.render('access/viewuser', {
          user: req.user,
          cuser: cuser,
          ctccategorylist: ctccategorylist,
          bankacc: BnkAcc
        });
      });
    });
  });
});
router.post('/users/updateuser/:userId', upload.single('file'), ensureAuthenticated, (req, res) => {
  var updateuserobj = req.body;
  if (typeof req.file != "undefined") {
    updateuserobj.profilepicture = req.file.filename;
    User.findOne({ "_id": req.params.userId }, function (err, cuser) {
      if (cuser.profilepicture != "") {
        var dellink = 'public/profilepictures/' + cuser.profilepicture;
        if (fs.existsSync(dellink)) {
          fs.unlink(dellink, (err) => {
            if (err) throw err;
            //console.log('path/file.txt was deleted');
          });
        }
      }
    });
  }
  User.findByIdAndUpdate(req.params.userId, updateuserobj, function (err, cuser) {
    req.flash(
      'success_msg',
      'User Account has been updated'
    );
    res.redirect('/users/viewuser/' + req.params.userId);
  });
});
router.get('/users/removeaccount/:userId', ensureAuthenticated, (req, res) => {
  User.deleteOne({ "_id": req.params.userId }, function (err, response) {
    req.flash(
      'success_msg',
      'User Account has been Deleted!!!'
    );
    res.redirect('/users/');
  });
});
router.get('/users/resetpassword/:userId', ensureAuthenticated, (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash("Password@1", salt, (err, hash) => {
      if (err) throw err;
      var updateuserobj = { password: hash };
      User.findByIdAndUpdate(req.params.userId, updateuserobj, function (err, cuser) {
        req.flash(
          'success_msg',
          'Password has been reseted to Password@1'
        );
        res.redirect('/users/viewuser/' + req.params.userId);
      });
    });
  });
});
router.post('/users/updateuserbank/:userId', ensureAuthenticated, (req, res) => {
  BankAccount.findOneAndUpdate({ "userid": req.params.userId }, req.body, function (err, bankdata) {
    if (bankdata == null) {
      var bankaccount = new BankAccount(req.body);
      bankaccount.userid = req.params.userId;
      bankaccount
        .save()
        .then(user => {
          req.flash(
            'success_msg',
            'Account Details has been updated'
          );
          res.redirect('/users/viewuser/' + req.params.userId);
        })
        .catch(err => console.log(err));
    } else {
      req.flash(
        'success_msg',
        'Account Details has been updated'
      );
      res.redirect('/users/viewuser/' + req.params.userId);
    }
    console.log(bankdata);
  });
});
module.exports = router;
