const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodbKey = require('./keys/mongodb-uri');
const path = require('path');

const errorHandler = require('./middleware/error-handler');
const file = require('./util/file');
const cors = require('./middleware/cors');
const feedRoutes = require('./routes/feed');

const app = express();



app.use(bodyParser.json());
app.use(file);
app.use('/images', express.static(
    path.join(__dirname, 'images')
));
app.use(cors);
app.use('/feed', feedRoutes); 
app.use(errorHandler);

mongoose
    .connect(mongodbKey)
    .then(() => {
        app.listen(8080);
        console.log('Listening...');
    })
    .catch(err => console.log(err));
