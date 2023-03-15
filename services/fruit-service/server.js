'use strict'

const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors')
const PORT = 8080
const HOST = '0.0.0.0'

let fruits = [
  {id: 1, name: 'Banana', count: 10},
  {id: 2, name: 'Apple', count: 7},
  {id: 3, name: 'Kiwi', count: 25 }
];

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.get('/service1', (req, res) => {
  res.send('boje pomoji')
})

// READ operation
app.get('/fruits/:id', (req, res) => {
  const fruit = fruits.find(f => f.id === parseInt(req.params.id));
  if (!fruit) {
    res.status(404).send('Fruit not found');
  } else {
    res.send(fruit);
  }
});

//ALL fruits
app.get('/fruits', (req, res) => {
  res.send(fruits);
});

//CREATE operation
app.post('/fruits', (req, res) => {
  const fruit = req.body;
  fruit.id = fruits.length + 1;
  fruits.push(fruit);
  res.send(fruit);
});

// UPDATE operation
app.put('/fruits/:id', (req, res) => {
  const fruit = fruits.find(f => f.id === parseInt(req.params.id));
  if (!fruit) {
    res.status(404).send('Fruit not found');
  } else {
    fruit.name = req.body.name || fruit.name;
    fruit.count = req.body.count || fruit.count;

    res.send('Fruit updated successfully');
  }
});

// DELETE operation
app.delete('/fruits/:id', (req, res) => {
  const index = fruits.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).send('Fruit not found');
  } else {
    fruits.splice(index, 1);

    res.send('Fruit deleted successfully');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})