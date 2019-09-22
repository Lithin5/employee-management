var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const holiDays = require("../models/holidays");

router.get('/', ensureAuthenticated, (req, res) => {
    holiDays.find({}, (err, holidaylist) => {
        res.render('access/holidays/home', {
            user: req.user,
            holidayslist: JSON.stringify(holidaylist)
        });
    });
});
router.get('/new', ensureAuthenticated, (req, res) => {
    holiDays.find({}, (err, holidaylist) => {
        res.render('access/holidays/newholiday', {
            user: req.user,
            holidayslist: holidaylist
        });
    });
});
router.post('/new', ensureAuthenticated, (req, res) => {
    var newholiday = new holiDays(req.body);
    newholiday
        .save()
        .then(holiday => {
            req.flash(
                'success_msg',
                'New Holiday has been created!!!'
            )
            res.redirect('/holidays/new');
        })
        .catch(err => console.log(err));
});
router.get('/remove/:holidayId', ensureAuthenticated, (req, res) => {
    holiDays.findByIdAndDelete(req.params.holidayId, (err, holiday) => {
        req.flash(
            'success_msg',
            'Holiday has been Deleted!!!'
        );
        res.redirect('/holidays/new');
    });
});
module.exports = router;