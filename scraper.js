'use strict';
const request = require('request');
const Promise = require('bluebird');
const cheerio = require('cheerio');

const getSearchResults = Promise.promisify((done)=>{
  let options = {
    url: 'http://dataifx.com/monedas'
  }
  request(options, (error, response, HTML)=>{
    if(error) {
      return done(error);
    }
    //console.log('HTML', HTML);
    if(response.statusCode === 200) {
      return done(null, HTML);
    }
    return done(JSON.stringify({error: 'not handled error'}));
  });
});

const getResults = Promise.promisify((HTML, done)=>{
  let $ = cheerio.load(HTML);
  let table = $('#block-widgetsdataifx-principalcurrencies > div > section > div.dataifx-currencies-description-container > table').html();
  //console.log('table', table);
  
  let tr = $(table).find('tr');
  //console.log('tr', tr);
  
  let resultados = [];
  tr.each((idx, el)=>{
    resultados[idx]=[];
    console.log('idx', idx);
    let singleTr = $(el);
    console.log('singleTr.html()', singleTr.html());
    
    if(idx === 0) {
      let th = $(singleTr).find('th');
      
      th.each((idx2, el2)=>{
        let singleTh = $(el2).text();
        console.log('singleTh', singleTh);
        resultados[idx][idx2] = singleTh;
      });
    }
    
    if(idx === 1) {
      let td = $(singleTr).find('td');
      td.each((idx2, el2)=>{
        let singleTd = $(el2).text().trim();
        console.log('singleTd', singleTd);
        resultados[idx][idx2] = singleTd;
      });
    }
  });
  
  return done(null, resultados);
});

const scrapper = Promise.promisify((done)=>{
  return getSearchResults()
    .then((HTML)=>getResults(HTML))
    .then(result=>done(null, result));
});

//scrapper().then(finalResult=>console.log('finalResult', finalResult));

exports = module.exports = scrapper;