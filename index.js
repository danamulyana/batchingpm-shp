const { getDatas } = require('./data.js');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

console.log(getDatas());

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'))
app.get('/notification', (req, res) => res.render('pages/notify'))
app.get('/list-pengerjaan', (req,res) => {
  res.render('pages/listPengerjaan');
});
app.get('/kerjakan/bo/36365', (req,res) => {
  res.render('pages/kerjakan');
});

app.get('/list-pengambilan', (req,res) => {
  res.render('pages/listPengambilan');
});

app.get('/master/stagging', (req,res) => {
  res.render('pages/masterStagging');
});
  
app.listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
