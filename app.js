const express = require('express')
const app = express()
const port = 3000

// AWSS3
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');


aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    signatureVersion: "v4",
    secretAccessKey: "",
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: "",
    region: "us-east-2" // region of your bucket
});

const s3 = new aws.S3();
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: '',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      // This is the key for the bucket
      //cb(null, Date.now().toString())
      cb(null, "profile_pic")
    }
  })
})

module.exports = upload;

const singleUpload = upload.single('profileUploadImage');


//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');//index.html is inside node-cheat

});

// Necesarry routed HTML Pages
app.get('/html/profilePage.html', function (req, res) {
    res.sendFile(__dirname + '/html/profilePage.html');//index.html is inside node-cheat

});

app.get('/html/index.html', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');//index.html is inside node-cheat

});
// End of necessary routed html pages


// route necessary files
app.get('/css/index.css', function (req, res) {
    res.sendFile(__dirname + '/css/index.css');//index.html is inside node-cheat

});

app.get('/assets/RGBackground.png', function (req, res) {
    res.sendFile(__dirname + '/assets/RGBackground.png');//index.html is inside node-cheat

});

app.get('/assets/loading.gif', function (req, res) {
    res.sendFile(__dirname + '/assets/loading.gif');//index.html is inside node-cheat

});

app.post('/myaction', function(req, res) {
  res.send('You sent the name "' + req.body.name + '".');
});



app.post('/upload', function(req, res) {
  //singleUpload("req", res, function(err, some) {
  singleUpload(req, res, function(err, some) {
    if (err) {
      console.log("Error");
      return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
    }
    console.log("Image Uploaded");
    res.sendFile(__dirname + '/html/profilePage.html');
    //return res.json({'imageUrl': req.file.location});
  });
})

module.exports = app;


//app.get('/', (req, res) => res.send('Hello World'))

app.listen(port, () => console.log(`Example app listening on port ${port}`))
