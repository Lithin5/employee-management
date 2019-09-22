var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const users = require("../models/User");

router.get('/:year?/:month?', ensureAuthenticated, (req, res) => {
    var year = req.params.year;
    var month = req.params.month;
    if (year == undefined) {
        year = 2019;
    }
    if (month == undefined) {
        month = 9;
    }
    users.find({}, (err, userlist) => {
        res.render('access/payroll/home', {
            user: req.user,
            year: year,
            month: month,
            userlist:userlist
        });
    });
});

module.exports = router;