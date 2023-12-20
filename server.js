import express from 'express';
import DataBase from './models/Database.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
let errorMessage = ""

app.get("/", async function (req, res) {
  const colonnes = await DataBase.loadMany();
  const listofid = [];
  for(let elem of colonnes){
    listofid.push(elem.id )
  }
  const getanelement = getRandomItem(listofid)
  let wordtotranslate = 0;
  let idtotranslate = 0;
  for(let elem of colonnes){
    if(elem.id == getanelement){
      wordtotranslate = elem.word
      idtotranslate = elem.id
    }
  } 
  res.render('website.ejs', {wordtotranslate,idtotranslate,errorMessage});
});

function getRandomItem(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const item = arr[randomIndex];
  return item;
}

app.post("/add", async function (req, res) {
  const newcolonne = new DataBase();
  newcolonne.word = req.body.input1;
  newcolonne.translation = req.body.input2;
  await newcolonne.save();
  res.redirect('/');
});

app.post("/verify/:id", async function(req,res){
  const verifyword = await DataBase.load({id : req.params.id})
  verifyword.nbtest += 1;
  if (verifyword.translation == req.body.verify){
    verifyword.nbaccuracy += 1;
    errorMessage = ""
  } 
  else {
    errorMessage = `Unfortunately, "${verifyword.word}" is "${verifyword.translation}" in French.`;
  }
  await verifyword.save();
  res.redirect('/');
})

app.get("/delete/:id", async function (req, res) {
  await DataBase.delete({ id: req.params.id });
  res.redirect('/');
});

app.get("/addanelementonotherpage", async function(req,res){
  const colonnes = await DataBase.loadMany();
  res.render('secondpage.ejs',{colonnes});
})

app.use(express.static('public'));
app.listen(4000);