const express = require('express');
const { Pool } = require('pg');
var cors = require('cors')
const app = express();
const axios = require('axios');
require('dotenv').config()
const client = require('prom-client');

const amqp = require('amqplib');
const results = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
})

pool.connect()
  .then(() => {
    console.log('Successfully connected to database and ensured table exists');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });

let channel;

async function connect() {
  const amqpServer = "amqp://default_user_Jua4hvFeplF7YWhIAqt:L799I-qGbN8nAWjQFxvxkBl1x6asvZ1h@hello-world:5672"
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue('ORDERS_HISTORY');
  await channel.assertQueue('PRODUCTS_HISTORY');
  await channel.consume('ORDERS_HISTORY', data1 => {
    order = JSON.parse(data1.content);
    console.log(order)
    addToDb(order)
    channel.ack(data1)
  });

  await channel.consume('PRODUCTS_HISTORY', data2 => {
    product = JSON.parse(data2.content);
    console.log(product)
    addToDb(product)
    channel.ack(data2)
  });
}
connect();


function addToDb(data){
  const query = {
    text: 'INSERT INTO history(json, date) VALUES($1, $2) RETURNING *',
    values: [data, new Date().toLocaleString("en-US", {timeZone: "Europe/Kyiv"})],
  };
  pool.query(query)
    .then((result) => console.log("kinda donw"))
    .catch((err) => {
      console.error('Error adding hsitoru:', err);
      
    });
}

const port = process.env.PORT ?? 8080;
app.use(cors());
app.listen(port, () => {
  console.log(`Products Service at ${port}`);
});

app.get('/history', async (req, res) => {
  const query = {
    text: 'SELECT * FROM history'
  };
  pool.query(query)
    .then((result) => res.json(result.rows))
    .catch((err) => {
      console.error('Error retrieving hsitory:', err);
      res.status(500).json({ error: 'Failed to retrieve history' });
    });
});


app.get('/products/buy/:id', async (req, res) => {
  // const { ids } = req.body;
  console.log(req.params.id)
  await channel.assertQueue('PRODUCTS_HISTORY');
  channel.sendToQueue(
    'PRODUCTS_HISTORY',
    Buffer.from(
      JSON.stringify({
        msg: Math.random(),
        userEmail: "2"
      })
    )
  );
  
  res.json("done");
});
