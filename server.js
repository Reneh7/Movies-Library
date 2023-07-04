'use strict';


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const movieRoutes = require('./Routes/movie_routes');
const client = require('./client');
const handle404Error = require('./Error_Handler/404');
const handle500Error = require('./Error_Handler/500');

const app = express();
app.use(cors());
app.use(express.json());


app.use(movieRoutes);

app.use(handle404Error);
app.use(handle500Error);

client.connect().then(() => {
  app.listen(3000, () => {
    console.log('Listening at 3000');
  });
});
