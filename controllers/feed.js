const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post
        .find()
        .then(posts => {
            res.status(200).json({
                posts: posts
            });
        })
        .catch();
}

exports.getPost = (req, res, next) => {
    if(!req.params.postId){
        const error = new Error('GET_POST_NO_POST_ID_REQUESTED');
        error.statusCode = 400;
        throw error;
    }
    const postId = req.params.postId;
    Post
        .findById(postId)
        .then(post => {
            if(!post) {
                const error = new Error('POST_NOT_FOUND');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Post fetched succesfully',
                post: post
            });
        })
        .catch(err => next(err));
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('CREATE_POST_VALIDATION_FAILED');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('NO_IMAGE_IN_REQUEST');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const imagePath = req.file.path.replace('\\', '/');
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imagePath,
        creator: { name: 'Placeholder' } 
    }); 
    post
        .save()
        .then(() => {
            res.status(201).json({
                message: 'Post created successfully',
                post: post 
            });
        })
        .catch(err => {
            next(err);
        });
}