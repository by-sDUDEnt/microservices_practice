const express = require('express');
const { Pool } = require('pg');
var cors = require('cors')
const app = express();
const axios = require('axios');
require('dotenv').config()

const amqp = require('amqplib');
let channel;

async function connect() {
  const amqpServer = "amqp://default_user_Jua4hvFeplF7YWhIAqt:L799I-qGbN8nAWjQFxvxkBl1x6asvZ1h@hello-world:5672"
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
}
connect()



const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
})

pool.connect()
  .then(() => {
    return pool.query(
    `
    SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';
    `
    );
  })
  .then((res) => {
    console.log(res)
    console.log('Successfully connected to database and ensured table exists');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });

app.use(express.json());

app.use(cors());


async function addToQueue(msg, data){
  await channel.assertQueue('PRODUCTS_HISTORY');
  channel.sendToQueue(
    'PRODUCTS_HISTORY',
    Buffer.from(
      JSON.stringify({
        msg: msg,
        data: data
      })
    )
  );
}






app.get('/vegetables', (req, res) => {
  const query = {
    text: 'SELECT * FROM vegetables',
  };
  pool.query(query)
    .then((result) => res.json(result.rows))
    .catch((err) => {
      console.error('Error retrieving vegetables:', err);
      res.status(500).json({ error: 'Failed to retrieve vegetables' });
    });
});

app.get('/vegetables/:id', (req, res) => {
  const query = {
    text: 'SELECT * FROM vegetables WHERE id = $1',
    values: [req.params.id],
  };
  pool.query(query)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Vegetable not found' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch((err) => {
      console.error('Error retrieving vegetable:', err);
      res.status(500).json({ error: 'Failed to retrieve vegetable' });
    });
});

app.post('/vegetables', (req, res) => {
  const { name, color, quantity } = req.body;
  const query = {
    text: 'INSERT INTO vegetables(name, color, quantity) VALUES($1, $2, $3) RETURNING *',
    values: [name, color, quantity],
  };
  pool.query(query)
    .then((result) => {
      res.status(201).json(result.rows[0])
      addToQueue("Add",result.rows[0] )
    })
    .catch((err) => {
      console.error('Error adding vegetable:', err);
      res.status(500).json({ error: 'Failed to add vegetable' });
    });
});

app.put('/vegetables/:id', (req, res) => {
  const { name, color, quantity } = req.body;
  const query = {
    text: 'UPDATE vegetables SET name = $1, color = $2, quantity = $3 WHERE id = $4 RETURNING *',
    values: [name, color, quantity, req.params.id],
  };
  pool.query(query)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Vegetable not found' });
      } else {
        res.json(result.rows[0]);
        addToQueue("Changed",result.rows[0] )
      }
    })
    .catch((err) => {
      console.error('Error updating vegetable:', err);
      res.status(500).json({ error: 'Failed to update vegetable' });
    });
});

app.delete('/vegetables/:id', (req, res) => {
  const query = {
    text: 'DELETE FROM vegetables WHERE id = $1 RETURNING *',
    values: [req.params.id],
  };
  pool.query(query)
  .then((result) => {
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Vegetable not found' });
    } else {
      res.json(result.rows[0]);
      addToQueue("Delete",result.rows[0] )
    }
  })
  .catch((err) => {
    console.error('Error deleting vegetable:', err);
    res.status(500).json({ error: 'Failed to delete vegetable' });
  });
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
  });