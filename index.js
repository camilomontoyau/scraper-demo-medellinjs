'use strict';
const express = require('express');
const app = express();
const viewDir = `${__dirname}/views`;
const bodyParser = require('body-parser');
const scraper = require('./scraper');

app.set( 'views', viewDir );
app.set( 'view engine', 'pug');

app.get('/', (req, res) => {
  return scraper().then((resultados)=>res.render('home', {resultados}));
});

let port = 3000;
app.listen(port, () => {
  console.log(`APP REST corriendo en http://localhost:${port}`);
});