const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

const fs = require('fs');
const uploadDirectory = '../uploads';

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: storage,
}).single('image');

router.post('/add', upload, (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    });

    newUser.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'User added successfully'
            };
            res.redirect("/");
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger' });
        });
});

router.get('/', (req, res) => {
    res.render('index', { title: 'Home page' });
});

router.get('/add-user', (req, res) => {
    res.render('add-user', { title: 'Add User' });
});

router.get('/users', (req, res) => {
    res.send('All users');
});

module.exports = router;
