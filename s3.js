//const secrets = require ('./secrets.json');
const aws = require ('aws-sdk');
const fs = require ('fs');

const s3 = new aws.S3({
    //accessKeyId: secrets.AWS_KEY,
    //secretAccessKey: secrets.AWS_SECRET
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET
});


exports.uploadFile = (fileFromRequest) => {
    const {filename, mimetype, size, path} = fileFromRequest;

    return s3.putObject({
        Bucket: secrets.AWS_BUCKET_NAME,
        ACL: 'public-read',
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise().then(response => {
        return { success: true };
        
    });
}; 

exports.generateBucketURL = filename => {
    return `https://${secrets.AWS_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
   
};