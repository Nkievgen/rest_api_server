const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const pagination = require('../util/pagination');

const clearImage = imagePath => {
    imagePath = path.join(__dirname, '..', imagePath);
    fs.unlink(imagePath, err => console.log(err));
}

const validationResultCheck = (controllerName, req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(controllerName + ' VALIDATION_FAILED');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file && controllerName == 'CREATE_POST') {
        const error = new Error(controllerName + ' NO_IMAGE_IN_REQUEST');
        error.statusCode = 422;
        throw error;
    }
}

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    let totalItems;
    Post
        .find()
        .countDocuments()
        .then(quantity => {
            totalItems = quantity;
            return Post
                .find()
                .skip((currentPage - 1) * pagination.perPage)
                .limit(pagination.perPage);
        })
        .then(posts => {
            res.status(200).json({
                message: 'Posts have been fetched succesfully',
                posts: posts,
                totalItems: totalItems
            });
        })
        .catch(err => {
            next(err);
        });
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
    validationResultCheck('CREATE_POST', req);
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

exports.editPost = (req, res, next) => {
    const postId = req.params.postId;
    validationResultCheck('EDIT_POST', req);
    const newTitle = req.body.title;
    let newImageUrl = req.body.image;
    const newContent = req.body.content;
    if (req.file) {
        newImageUrl = req.file.path.replace('\\', '/');
    }
    if (!newImageUrl) {
        const error = new Error('EDIT_POST_NO_IMAGE_URL');
        error.statusCode = 422;
        throw error;
    }
    Post
        .findById(postId)
        .then(post => {
            if (!post) {
                const error = new ERROR('EDIT_POST_PRODUCT_NOT_FOUND');
                error.statusCode = 404;
                throw error;
            }
            if (newImageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = newTitle;
            post.imageUrl = newImageUrl;
            post.content = newContent;
            return post.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Post edited succesfully',
                post: result
            });
        })
        .catch(err => next(err));
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post
        .findById(postId)
        .then(post => {
            //auth
            clearImage(post.imageUrl)
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            if (result.deletedCount == 0) {
                const error = new Error('DELETE_POST_FAILED');
                error.statusCode = 500;
                throw error;
            }
            res.status(200).json({
                message: 'Post have been deleted sucessfully'
            });
        })
        .catch(err => next(err));
}