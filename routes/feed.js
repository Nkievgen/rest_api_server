const express = require('express');

const feedController = require('../controllers/feed');
const postValidation = require('../validation/post');


const router = express.Router();

router.get('/posts', feedController.getPosts);

router.get('/post/:postId', feedController.getPost);

router.post('/post', postValidation, feedController.createPost);

module.exports = router;