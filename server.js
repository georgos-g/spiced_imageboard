const express = require('express');



const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3.js');
const db = require('./db.js');
const app = express();
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));



//multer
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});






app.get('/api/v1/images', (request, response)=>{
    
    db.getImages().then(images => {
        response.json(images); 

      
      
    });
    
    
});


//upload files
app.post('/upload', uploader.single('file'), (request, response) => {
    const s3ImageURL = s3.generateBucketURL(request.file.filename);
    s3.uploadFile(request.file).then(result =>{

        
        
        response.json({
            success: true,
            fileURL: s3ImageURL,
            //...imageInfoFromDB,
        });
    });

});    
//Listen to localhost --
app.listen(8080);