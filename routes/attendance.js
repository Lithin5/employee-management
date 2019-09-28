var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const AttendanceData = require("../models/attendance");

router.get('/', ensureAuthenticated, (req, res) => {
    AttendanceData.find()
        .populate('userdata')
        .then(attendata => {
            res.render('access/attendance/home', {
                user: req.user,
                attendata: attendata
            });
        });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    AttendanceData.find({ userdata: req.user._id }, (err, attdata) => {
        res.render('access/attendance/add', {
            user: req.user,
            attdata: attdata
        });
    });
});

router.post('/add', ensureAuthenticated, (req, res) => {
    var attendance = new AttendanceData(req.body);
    attendance.userdata = req.user._id;
    attendance
        .save()
        .then(attendance => {
            req.flash(
                'success_msg',
                'Attendance has been updated!!!'
            );
            res.redirect('/attendance');
        });
});

router.get('/delete/:attendanceId', ensureAuthenticated, (req, res) => {
    AttendanceData.findByIdAndDelete(req.params.attendanceId, (err, attendanceddata) => {
        req.flash(
            'success_msg',
            'Record has been deleted!!!'
        );
        res.redirect('/attendance');
    });
});
module.exports = router;