const multer = require('multer');
var mkdirp = require('mkdirp');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let path =   `Public/uploadstore/`;
      // uploads/${req.params.type}
      mkdirp(path, err =>{
        if(err){
          console.log('err',err);
          cb(err, path)
        }
      })
  
      cb(null,path)
    },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
  });
  
 const uploadstore = multer({ storage: storage });
module.exports = uploadstore;
