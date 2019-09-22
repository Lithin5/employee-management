var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Complaints = require("../models/complaints");

router.get('/', ensureAuthenticated, (req, res) => {
    Complaints.find()
        .populate('userdetails')
        .then(complaintlist => {
            res.render('access/complaints/home', {
                user: req.user,
                complaintlist: complaintlist
            });
        });
});

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('access/complaints/newcomplaint', {
        user: req.user
    });
});
router.post('/new', ensureAuthenticated, (req, res) => {
    var newcomplaints = new Complaints(req.body);
    newcomplaints.userdetails = req.user.id;
    newcomplaints.status = "Submitted";
    newcomplaints.save()
        .then(compla => {
            req.flash(
                'success_msg',
                'Your Complaint has been submitted!!!'
            )
            res.redirect('/complaints');
        })
        .catch(err => console.log(err));
});
router.get('/view/:complaintId', ensureAuthenticated, (req, res) => {
    Complaints.findOne({ '_id': req.params.complaintId })
        .populate('userdetails')
        .then(complaint => {
            res.render('access/complaints/viewcomplaint', {
                user: req.user,
                complaint: complaint
            });
        });
});
router.post('/updatereview/:complaintId',ensureAuthenticated,(req,res)=>{
    var updatedata = {
        remarks:req.body.remarks,
        status:"Reviewed"
    };
    Complaints.findByIdAndUpdate(req.params.complaintId,updatedata,(err,complaint)=>{
        req.flash(
            'success_msg',
            'Your Review has been updated!!!'
        )
        res.redirect('/complaints');
    });
});
router.get('/deletecomplaint/:complaintId',ensureAuthenticated,(req,res)=>{
    Complaints.findByIdAndDelete(req.params.complaintId,(err,complaint)=>{
        req.flash(
            'success_msg',
            'Your Review has been Deleted!!!'
        )
        res.redirect('/complaints');
    });
});

module.exports = router;