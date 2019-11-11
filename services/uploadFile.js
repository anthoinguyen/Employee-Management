var multer = require('multer');
var mongoose = require('mongoose');
var randomString = require('randomstring');
var compress_images = require('compress-images');
var fs = require('fs');
var config = require('../config');

module.exports = {

  uploadImage: () => {
    var placeStore = `img/uploads/`;
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/' + placeStore)
      },
      filename: (req, file, cb) => {
        var fileName = file.originalname.split('.');
        let insert = {
          originalName: fileName[0],
          type: 'IMG',
        }
        mongoose.model('imagesUpload').create(insert, (err, hanler) => {
          if (err) throw err;
          let name = `${hanler._id}.${fileName[1]}`;
          let link = config.domain + '/' + placeStore + name;
          let update = {
            link,
            fileName: name,
          }
          let option = { new: false }
          mongoose.model('imagesUpload').findByIdAndUpdate(hanler._id, update, option, (err, hanlerLatest) => {
            if (err) throw err;
            cb(null, name);
          })
        })
      }
  });
    return multer({storage: storage});
  },

  uploadTempFile: () => {
    var placeStore = `temp/uploads/`;
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/' + placeStore)
      },
      filename: (req, file, cb) => {
        let fileName = file.originalname.split('.');
        let newFileName = `${randomString.generate(10)}-${new Date().getTime()}`
        cb(null, `${newFileName}.${fileName[1]}`);
      }
  });
    return multer({storage: storage});
  },

  uploadDocsFile: () => {
    var placeStore = `documents/`;
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/' + placeStore)
      },
      filename: (req, file, cb) => {
        let fileName = file.originalname.split('.');
        let newFileName = `${fileName[0]}-${new Date().getTime()}`
        cb(null, `${newFileName}.${fileName[fileName.length - 1]}`);
      }
    });
    return multer({storage: storage});
  },
  // Upload avatar User
  uploadImgUser: () => {
    var place = `uploads/user_images`;
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/' + place)
      },
      filename: (req, file, cb) => {
        let fileName = file.originalname.split('.');
        let newFileName = `${fileName[0]}-${new Date().getTime()}`;
        cb(null, `${newFileName}.${fileName[fileName.length - 1]}`);
      },
    });
    return multer({
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const type = file.mimetype;
        const typeArray = type.split("/");
        if (typeArray[0] === "image") {
          cb(null, true);
        }else {
          cb(null, false);
        }
      }
    });
  },

  updateUser: (user, fileId, cb) => {
    let update = {
      createdBy: user._id,
    };
    mongoose.model('imagesUpload').findByIdAndUpdate(fileId, update, {new: false}, (err, exculte) => {
      if (err) throw err;
      if (exculte) {
        return cb(true);
      }
      return cb(false);
    })
  },

  compressImage: (fileId, endFile) => {
    var placeStore = `img/uploads/`;
    
    let INPUT_path_to_your_images = `public/${placeStore}**/${fileId}.{jpg,JPG,jpeg,JPEG,png,svg,gif}`;
    let OUTPUT_path = `public/${placeStore}temp/`;

    let fileTemp = `public/${placeStore}temp/${fileId}.${endFile}`;
    let fileSource = `public/${placeStore}${fileId}.${endFile}`;

    compress_images(INPUT_path_to_your_images, OUTPUT_path, {compress_force: false, statistic: true, autoupdate: true}, false,
      {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
      {png: {engine: 'pngquant', command: ['--quality=20-50']}},
      {svg: {engine: 'svgo', command: '--multipass'}},
      {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function(){
    });
    setTimeout(function() {
      fs.exists(fileTemp, (existsFileTemp) => {
        fs.exists(fileSource, (existsFileSource) => {
          if (existsFileSource && existsFileTemp) {
            fs.unlink(fileSource, err => { if(err) throw err })
            fs.copyFile(fileTemp, fileSource, (err) => {
              if (err) throw err;
              fs.unlink(fileTemp, err => { if(err) throw err })
            })
          }
        })
      })
    }, 10000)
  },

  removeImageFile: (fileId, link) => {
    mongoose.model('imagesUpload').findByIdAndRemove(fileId, (err, exculte) => {
      if (err) throw err;
      if (exculte) {
        let linkImage = `public${link}`
        fs.exists(linkImage, (exists) => {
          if (exists) {
            fs.unlink(linkImage, err => { if(err) throw err });
            return true;
          } else return false;
        })
      }
    })
  },

  removeTempFile: (file) => {
    fs.exists(file, (exists) => {
      if (exists) {
        fs.unlink(file, err => { if(err) throw err });
          return true;
      } else return false;
    })
  }
}