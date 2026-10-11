var express = require('express')
  , router = express.Router()
  , multer = require('multer')
  , fs = require('fs')
  , path = require('path')
  , junk = require('junk')

// Formats acceptés et extension à donner au fichier enregistré
var EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
}
var MAX_SIZE_MB = 5

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, req.app.get('uploadDir'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + EXTENSIONS[file.mimetype])
  }
})

var uploading = multer({
  storage: storage,
  limits: {fileSize: MAX_SIZE_MB * 1000 * 1000, files: 1},
  fileFilter: function (req, file, cb) {
    if (!EXTENSIONS[file.mimetype]) {
      req.fileValidationError = 'Format non accepté : envoie une image JPEG, PNG ou WebP.';
      return cb(null, false);
    }
    cb(null, true);
  }
}).single('image');

function showError(res, message) {
  res.status(400).render('image', {imgName: '/images/default.jpg', error: message});
}

router.get('/', function(req, res) {
  var dir = req.app.get('uploadDir');
  fs.readdir(dir, function (err, files) {
    if (err) {
      return res.render('pictures', {images: []});
    }
    // Les plus récentes en premier
    var images = files.filter(junk.not).sort().reverse();
    res.render('pictures', {images: images});
  });
});

router.post('/upload', function(req, res) {
  uploading(req, res, function(err) {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return showError(res, 'Image trop lourde : ' + MAX_SIZE_MB + ' Mo maximum.');
      }
      return showError(res, "L'envoi a échoué : " + err.message);
    }
    if (req.fileValidationError) {
      return showError(res, req.fileValidationError);
    }
    if (req.file) {
      return res.redirect('/pictures/' + req.file.filename);
    }
    showError(res, 'Choisis une image avant de cliquer sur « Envoyer ».');
  });
});

router.get('/:id', function(req, res, next) {
  // path.basename empêche de sortir du dossier d'upload
  var name = path.basename(req.params.id);
  fs.access(path.join(req.app.get('uploadDir'), name), function (err) {
    if (err) {
      return res.status(404).render('image', {
        imgName: '/images/default.jpg',
        error: "Cette image n'existe pas (ou plus)."
      });
    }
    res.render('image', {imgName: '/upload/' + name});
  });
})

module.exports = router
