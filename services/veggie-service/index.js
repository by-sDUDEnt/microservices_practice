const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
// Hardcoded JSON database of vegetables
let vegetables = [
  { id: 1, name: 'Carrots', color: 'Orange', quantity: 10 },
  { id: 2, name: 'Broccoli', color: 'Green', quantity: 5 },
  { id: 3, name: 'Eggplant', color: 'Purple', quantity: 3 }
];

// Initialize express app and middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());


// CRUD operations
// Get all vegetables
app.get('/vegetables', (req, res) => {
  res.send(vegetables);
});

// Get a specific vegetable by id
app.get('/vegetables/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const vegetable = vegetables.find(v => v.id === id);
  if (vegetable) {
    res.send(vegetable);
  } else {
    res.status(404).send('Vegetable not found');
  }
});

// Create a new vegetable
app.post('/vegetables', (req, res) => {
  const vegetable = req.body;
  vegetable.id = vegetables.length + 1;
  vegetables.push(vegetable);
  res.send(vegetable);
});

// Update an existing vegetable by id
app.put('/vegetables/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const vegetableIndex = vegetables.findIndex(v => v.id === id);
  if (vegetableIndex !== -1) {
    const updatedVegetable = Object.assign({}, vegetables[vegetableIndex], req.body);
    vegetables[vegetableIndex] = updatedVegetable;
    res.send(updatedVegetable);
  } else {
    res.status(404).send('Vegetable not found');
  }
});

// Delete a vegetable by id
app.delete('/vegetables/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const vegetableIndex = vegetables.findIndex(v => v.id === id);
  if (vegetableIndex !== -1) {
    vegetables.splice(vegetableIndex, 1);
    res.send('Vegetable deleted');
  } else {
    res.status(404).send('Vegetable not found');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});