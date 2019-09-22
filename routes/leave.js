var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Leave = require("../models/leaves");

router.get('/', ensureAuthenticated, (req, res) => {
    Leave.find()
        .populate('userdetails')
        .then(leavelist => {
            console.log("LeaveList", leavelist);
            res.render('access/leave/home', {
                user: req.user,
                leavelist: leavelist
            });
        });
});

router.get('/newleaverequest', ensureAuthenticated, (req, res) => {
    res.render('access/leave/newleave', {
        user: req.user
    });
});
router.post('/newleaverequest', ensureAuthenticated, (req, res) => {
    var nLeave = new Leave(req.body);
    nLeave.userdetails = req.user._id;
    nLeave.status = "Requested";
    nLeave.save()
        .then((err, nleaves) => {
            req.flash(
                'success_msg',
                'Your Leave request has been submitted'
            );
            res.redirect('/leave');
        })
        .catch(err => console.log(err));
});
router.get('/updatestatus/:leaveId/:leaveStatus', ensureAuthenticated, (req, res) => {
    var updateleavestatus = { status: req.params.leaveStatus };
    Leave.findByIdAndUpdate(req.params.leaveId, updateleavestatus, (err, leave) => {
        req.flash(
            'success_msg',
            'Leave Status has been updated!!!'
        );
        res.redirect('/leave');
    });
});
router.get('/deleteleavereq/:leaveId', ensureAuthenticated, (req, res) => {
    Leave.findOneAndDelete(req.params.leaveId, (err, leav) => {
        req.flash(
            'success_msg',
            'Leave Requested has been deleted!!!'
        );
        res.redirect('/leave');
    });
});
module.exports = router;