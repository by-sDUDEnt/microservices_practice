'use strict'

const express = require('express')
const bodyParser = require('body-parser');
const { Pool } = require('pg');
var cors = require('cors')
const PORT = 8080
const HOST = '0.0.0.0'

let orders = [
  {id: 1, veggie: 'Carrots', count: 2, address: 'Kyiv'},
  {id: 2, veggie: 'Broccoli', count: 4, address: 'Lviv'},
  {id: 3, veggie: 'Eggplant', count: 1, address: 'Dnipro' }
];

const app = express()
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: "demo",
  host: "local-postgresql",
  database: "demo",
  password: "demo",
  port: 5432
})


pool.connect()
  .then(() => {
    return pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';`);
    })
    .then((res) => {
      console.log(res)
      console.log('Successfully connected to database and ensured table exists');
    })
    .catch((err) => {
      console.error('Error connecting to database:', err);
    });

// READ operation
app.get('/orders/:id', async (req, res) => {
  try {
    const query = {
      text: 'SELECT * FROM orders WHERE id = $1',
      values: [req.params.id],
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error retrieving order:', err);
    return res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

//ALL fruits
app.get('/orders', async (req, res) => {
  try {
    const query = {
      text: 'SELECT * FROM orders',
    };

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

//CREATE operation
app.post('/orders', async (req, res) => {
  try {
    const { veggie, count, address } = req.body;
    const query = {
      text: 'INSERT INTO orders(veggie, count, address) VALUES($1, $2, $3) RETURNING *',
      values: [veggie, count, address],
    };

    const result = await pool.query(query);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding order:', err);
    res.status(500).json({ error: 'Failed to add order' });
  }
});

// UPDATE operation
app.put('/orders/:id', async (req, res) => {
  try {
    const { veggie, count, address } = req.body;
    const query = {
      text: 'UPDATE orders SET veggie = $1, count = $2, address = $3 WHERE id = $4 RETURNING *',
      values: [veggie, count, address, req.params.id],
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE operation
app.delete('/orders/:id', async (req, res) => {
  try {
    const query = {
      text: 'DELETE FROM orders WHERE id = $1 RETURNING *',
      values: [req.params.id],
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error deleting order:', err);
    return res.status(500).json({ error: 'Failed to delete order' });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})