var express = require('express')
  , router = express.Router()

router.use('/pictures', require('./pictures'))

router.get('/', function(req, res) {
  res.render('image', {imgName: '/upload/default'});
})

module.exports = router