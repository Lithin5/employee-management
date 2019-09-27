var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('access/attendance/home', {
        user: req.user
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('access/attendance/add', {
        user: req.user
    });
});
module.exports = router;