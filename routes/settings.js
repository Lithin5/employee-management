var express = require('express');
var router = express.Router();
const CtcCategory = require("../models/ctccategory");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) =>
  res.render('access/settings/common', {
    user: req.user
  })
);

router.get('/ctccategory', ensureAuthenticated, (req, res) => {
  CtcCategory.find({}, function (err, ctccate) {
    res.render('access/settings/ctccategory', {
      user: req.user,
      ctccategorylist: ctccate
    });
  });
}
);

router.post('/savectccategory', ensureAuthenticated, (req, res) => {
  var newctccate = new CtcCategory(req.body);
  newctccate
    .save()
    .then(user => {
      req.flash(
        'success_msg',
        'New CTC Category has been saved!!!'
      );
      res.redirect('/settings/ctccategory');
    })
    .catch(err => console.log(err));
});

router.get('/updatectccategory/:ctccateid', ensureAuthenticated, (req, res) => {
  CtcCategory.findOne({ "_id": req.params.ctccateid }, function (err, ctccate) {
    res.render('access/settings/ctccategory', {
      user: req.user,
      editctc: ctccate
    });
  });
});
router.post('/updatectccategory/:ctccateid', ensureAuthenticated, (req, res) => {
  CtcCategory.findByIdAndUpdate(req.params.ctccateid, req.body, function (err, cuser) {
    req.flash(
      'success_msg',
      'Category has been updated!!!'
    );
    res.redirect('/settings/ctccategory');
  });
});

router.get('/deletectccategory/:ctccateid', ensureAuthenticated, (req, res) => {
  CtcCategory.deleteOne({ "_id": req.params.ctccateid }, function (err, response) {
    req.flash(
      'success_msg',
      'Category has been deleted!!!'
    );
    res.redirect('/settings/ctccategory');
  });
});

module.exports = router;