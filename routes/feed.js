const express = require('express');

const feedController = require('../controllers/feed');
const postValidation = require('../validation/post');


const router = express.Router();

router.get('/posts', feedController.getPosts);

router.get('/post/:postId', feedController.getPost);

router.post('/post', postValidation, feedController.createPost);

router.put('/post/:postId', postValidation, feedController.editPost);

router.delete('/post/:postId', feedController.deletePost);

module.exports = router;