var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('access/workschedule/home', {
        user: req.user
    });
});

module.exports = router;