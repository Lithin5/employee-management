var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const users = require("../models/User");
const Payroll = require("../models/payroll");
const Ctcdata = require("../models/ctcdata");

router.get('/index/:year?/:month?', ensureAuthenticated, async (req, res) => {
    var year = req.params.year;
    var month = req.params.month;
    if (year == undefined || isNaN(year)) {
        year = 2019;
    }
    if (month == undefined || isNaN(month)) {
        month = 9;
    }
    var userlist = await users.find({}, (err, userlist) => { });
    var generateddata = {};
    for (var i = 0; i < userlist.length; i++) {
        generateddata[i] = {
            user: userlist[i],
            payroll: await Payroll.findOne({ "userdetails": userlist[i]._id, "year": year, "month": month }),
            ctcdata: await Ctcdata.find({ "userid": userlist[i]._id }).populate('ctccategoryid')
        }
    }
    res.render('access/payroll/home', {
        user: req.user,
        year: year,
        month: month,
        userlist: generateddata
    });
});
router.get('/markassent/:userId/:year/:month', ensureAuthenticated, async (req, res) => {
    var totalamount = 0;
    var ctcdata = await Ctcdata.find({ "userid": req.params.userId }, (err, user) => { });
    for (var i = 0; i < ctcdata.length; i++) {
        totalamount += ctcdata[i].amount;
    }
    var payroll = new Payroll({
        userdetails: req.params.userId,
        year: req.params.year,
        month: req.params.month,
        amount: totalamount
    });
    payroll.save()
        .then(paydata => {
            req.flash(
                'success_msg',
                'Payroll Data has been updated'
            );
            res.redirect('/payroll/index');
        })
        .catch(err => console.log(err));
});

router.get('/remove/:payrollId', ensureAuthenticated, async (req, res) => {
    Payroll.findByIdAndDelete(req.params.payrollId, (err, payroll) => {
        req.flash(
            'success_msg',
            'Payroll Data has been Deleted!!!'
        );
        res.redirect('/payroll/index');
    });
});

module.exports = router;