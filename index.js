require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { redirect } = require('express/lib/response');
const app = express();
const validator = require('validator');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDataBase = {};
let counter = 1

app.post("/api/shorturl",(req,res) => {
  /* origUrl = req.body.url */
  if(!validator.isURL(req.body.url,{require_protocol: true })){
    res.json({error: 'invalid url'})
  }else {
    urlDataBase[counter] = req.body.url
    res.json({original_url : req.body.url, short_url : counter})
    counter++
  }
})

app.get("/api/shorturl/:short",(req,res) => {
  let shortUrl = urlDataBase[req.params.short]
  if(shortUrl) {
    res.redirect(shortUrl)
  }else{
    res.status(404).json({ error: "Short URL not found" });
  }
})




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
