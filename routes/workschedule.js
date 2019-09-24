var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const users = require("../models/User");
const workSchedule = require("../models/workschedule");
const moment = require("moment");

router.get('/index/:cDate?', ensureAuthenticated, (req, res) => {
    var cdate = req.params.cDate;
    if (cdate == null) {
        cdate = moment(new Date()).format('YYYY-MM-DD');
    }
    workSchedule.find({ '$where': 'this.sentdate.toJSON().slice(0, 10) == "' + cdate + '"' }).populate('userdetails').then(workschedule => {
        workSchedule.find().distinct('sentdate', (err, sentdatelist) => {
            res.render('access/workschedule/home', {
                user: req.user,
                workschedulelist: workschedule,
                activedate: cdate,
                datelist: sentdatelist
            });
        })
    });
});
router.get('/new', ensureAuthenticated, (req, res) => {
    users.find({}, (err, userlist) => {
        res.render('access/workschedule/new', {
            user: req.user,
            userlist: userlist
        });
    });
});
router.post('/new', ensureAuthenticated, (req, res) => {
    var newschedule = new workSchedule(req.body);
    newschedule.status = "Assigned";
    newschedule.sentdate = new Date();
    newschedule
        .save()
        .then((schedule) => {
            req.flash(
                'success_msg',
                'Work Schedule has been added!!!'
            );
            res.redirect('/workschedule/index');
        })
        .catch(err => console.log(err));
});
router.get('/deleteschedule/:workId', ensureAuthenticated, (req, res) => {
    workSchedule.findByIdAndDelete(req.params.workId, (err, workschedule) => {
        req.flash(
            'success_msg',
            'Work Schedule has been deleted!!!'
        );
        res.redirect('/workschedule/index');
    });
});
router.get('/changestatus/:workId/:cDate/:Status', ensureAuthenticated, (req, res) => {
    var updateobject;
    if (req.params.Status == "progressing") {
        updateobject = {
            status: "Progressing",
            progressdate: new Date()
        };
    }
    if (req.params.Status == "completed") {
        updateobject = {
            status: "Completed",
            completeddate: new Date()
        };
    }
    if (req.params.Status == "verified") {
        updateobject = {
            status: "Verified",
            verifieddate: new Date()
        };
    }
    workSchedule.findByIdAndUpdate(req.params.workId, updateobject, (err, schedule) => {
        req.flash(
            'success_msg',
            'Work Schedule status has been updated!!!'
        );
        res.redirect('/workschedule/index/' + req.params.cDate);
    });
});

module.exports = router;