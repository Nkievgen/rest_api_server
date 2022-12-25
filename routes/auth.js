const express = require('express');

const router = express.Router();

router.put('/signup', authController.putSignup);