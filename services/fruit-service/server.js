'use strict'

const express = require('express')

const PORT = 8080
const HOST = '0.0.0.0'

let fruits = [
  {id: 1, name: 'Banana', count: 10},
  {id: 2, name: 'Apple', count: 7},
  {id: 3, name: 'Kiwi', count: 25 }
];

const app = express()
app.get('/service1', (req, res) => {
  res.send('boje pomoji')
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
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

//CREATE operation
app.post('/fruits', (req, res) => {
  const id = fruits.length + 1;
  const fruit = {
    id,
    name: req.body.name,
    color: req.body.color,
    weight: req.body.weight
  };

  fruits.push(fruit);

  res.send('Fruit created successfully');
});

// UPDATE operation
app.put('/fruits/:id', (req, res) => {
  const fruit = fruits.find(f => f.id === parseInt(req.params.id));
  if (!fruit) {
    res.status(404).send('Fruit not found');
  } else {
    fruit.name = req.body.name || fruit.name;
    fruit.color = req.body.color || fruit.color;
    fruit.weight = req.body.weight || fruit.weight;

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
