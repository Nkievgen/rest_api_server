const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodbKey = require('./keys/mongodb-uri');
const path = require('path');

const errorHandler = require('./middleware/error-handler');
const file = require('./util/file');
const cors = require('./middleware/cors');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();



app.use(bodyParser.json());
app.use(cors);
app.use(file);
app.use('/images', express.static(
    path.join(__dirname, 'images')
));
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

const PORT = 8080;

mongoose
    .connect(mongodbKey)
    .then(() => {
        app.listen(PORT);
        console.log('Listening...');
    })
    .catch(err => console.log(err));
