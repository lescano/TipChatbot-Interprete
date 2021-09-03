require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const app = express();
const port = process.env.PORT || 5000;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', route);

app.listen(port,()=>{
  console.log("Servidor corriendo en el puerto: "+port);
})
