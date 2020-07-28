const express = require('express');



const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3.js');
const db = require('./db.js');
const app = express();
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));//uploads is the static folder




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
        fileSize: 5242880//5MB
    }
});
//-------





app.get('/api/v1/images', (request, response)=>{
    
    db.getImages().then(images => {
        response.json(images); 
    });
});




//upload files to AWS S3 
app.post('/upload', uploader.single('file'), (request, response) => {
    const s3ImageURL = s3.generateBucketURL(request.file.filename);
    s3.uploadFile(request.file)
        .then(() => {
            const { username, title, description } = request.body;
            return db.addImage(s3ImageURL, username, title, description);

            //
        
        })
        .then((resultFromDb) => {
            const imageInfoFromDB = resultFromDb.rows[0];
           
            
            response.json({
                success: true,
                fileURL: s3ImageURL,
                
            });
        
            
        })
        .catch((error) => {
            response.status(500).json({
                success: false,
                error: error,


            });
        
        });
});    

//get image overlay ------IMAGEinfo
app.get('/api/v1/image/:id', (request, response) => {
    
    db.getOverlayImage(request.params.id).then(imageInfo => {
        response.json(imageInfo); 
    })
        .catch((error) => {
            response.status(500).json({
                success: false,
                error: error,


            });
    
        });

});




//Listen to localhost --
app.listen(8080);