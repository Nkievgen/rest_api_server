const { body } = require('express-validator');

module.exports = [
    body('title')
        .trim()
        .notEmpty(),
    body('content')
        .notEmpty()
]