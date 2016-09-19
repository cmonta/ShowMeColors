var express = require('express')
  , router = express.Router();

var myColorList = require('../helpers/colorLists.js')

router.use('/pictures', require('./pictures'))

router.get('/', function(req, res) {
  res.render('image', {imgName: '/upload/default', colors: myColorList.fullColorList});
})

router.get('/colorlist', function(req, res) {
	res.render('colorTable', {colors: myColorList.fullColorList});
})

module.exports = router