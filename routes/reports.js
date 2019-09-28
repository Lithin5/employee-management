var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const attendancedata = require("../models/attendance");
const workScheData = require("../models/workschedule");
const payrollData = require("../models/payroll");

router.get("/", ensureAuthenticated, (req, res) => {
    res.redirect('/reports/attendance');
});

router.get('/attendance', ensureAuthenticated, (req, res) => {
    attendancedata.find()
        .populate('userdata')
        .then(attendancedata => {
            res.render('access/reports/attendance', {
                user: req.user,
                attendancedata: attendancedata
            })
        });
});

router.get('/performance', ensureAuthenticated, (req, res) => {
    workScheData.find()
        .populate('userdetails')
        .then(workschedule => {
            res.render('access/reports/performance', {
                user: req.user,
                workschedule: workschedule
            })
        })
});

router.get('/payroll', ensureAuthenticated, (req, res) => {
    payrollData.find()
        .populate('userdetails')
        .then(payrolldata => {            
            res.render('access/reports/payroll', {
                user: req.user,
                payrolldata:payrolldata
            })
        });
});

module.exports = router;