var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Climate Control System' });
});

router.post('/', function (req, res, next) {
    res.return('index', { title: 'Climate Control System' });
});

module.exports = router;
