var express = require('express')
  , router = express.Router()
  , multer = require('multer')
  , fs = require('fs')
  , junk = require('junk')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + 'jpg')
  }
})

var uploading = multer({
  storage: storage,
  limits: {fileSize: 5000000, files:1},
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/jpeg') {
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true);
  }
}).single('image');


router.get('/', function(req, res) {
  fs.readdir('./public/upload/', (err, files) => {
    res.render('pictures', {images: files.filter(junk.not)})
  });
});

router.post('/upload', function(req, res) {
  uploading(req,res,function(err) {
    if(req.fileValidationError) {
      return res.end(req.fileValidationError);
    }
    else if (req.file) {
      return res.redirect('./' + req.file.filename); 
    }
    res.redirect('/');
  });
});

router.get('/:id', function(req, res) {
	var imgName = '/upload/' + req.params.id;
  res.render('image', {imgName: imgName})
})

module.exports = router