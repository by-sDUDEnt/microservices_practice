const express = require('express')
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const axios = require('axios');
var cors = require('cors')
require('dotenv').config()

const PORT = 8080/// CHANGED
const HOST = '0.0.0.0'
const amqp = require('amqplib');
let channel;

async function connect() {
  const amqpServer = "amqp://default_user_Jua4hvFeplF7YWhIAqt:L799I-qGbN8nAWjQFxvxkBl1x6asvZ1h@hello-world:5672"
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
}
connect()

async function addToQueue(msg, data){
  await channel.assertQueue('ORDERS_HISTORY');
  channel.sendToQueue(
    'ORDERS_HISTORY',
    Buffer.from(
      JSON.stringify({
        msg: msg,
        data: data
      })
    )
  );
}


const app = express()
app.use(bodyParser.json());
app.use(cors());


const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
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
// app.post('/orders', async (req, res) => {
//   try {
//     const { veggie, count, address } = req.body;
//     const query = {
//       text: 'INSERT INTO orders(veggie, count, address) VALUES($1, $2, $3) RETURNING *',
//       values: [veggie, count, address],
//     };

//     const result = await pool.query(query);
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error adding order:', err);
//     res.status(500).json({ error: 'Failed to add order' });
//   }
// });

app.post('/orders', async (req, res) => {
  try {
    const {id, veggie, count, address } = req.body;

    // Retrieve the available vegetable
    const veggieUrl = `http://veggie-service:80/vegetables/${id}`;
    console.log(veggieUrl)
    const veggieResponse = await axios.get(veggieUrl);
    if (!veggieResponse.data) {
      return res.status(404).json({ error: 'Vegetable not found' });
    }

    const availableVeggie = veggieResponse.data;
    let availableCount = availableVeggie.quantity;

    if (availableCount < count) {
      return res.status(400).json({ error: 'Not enough vegetables available' });
    }

    // Update the vegetable quantity
    availableCount -= count;
    if (availableCount === 0) {
      // If count is zero, delete the vegetable
      await axios.delete(veggieUrl);
    } else {
      // Otherwise, update the vegetable quantity
      await axios.put(veggieUrl, {name: availableVeggie.name, color: availableVeggie.color, quantity: availableCount });
    }

    // Create the order
    const createQuery = {
      text: 'INSERT INTO orders(veggie, count, address) VALUES($1, $2, $3) RETURNING *',
      values: [veggie, count, address],
    };

    const createResult = await pool.query(createQuery);
    res.status(201).json(createResult.rows[0]);
    addToQueue("Add",result.rows[0] )
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
    addToQueue("Changed",result.rows[0] )

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
    addToQueue("Delete",result.rows[0] )

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error deleting order:', err);
    return res.status(500).json({ error: 'Failed to delete order' });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})