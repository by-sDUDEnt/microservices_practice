const express = require('express');
const { Pool } = require('pg');
var cors = require('cors')
const app = express();
const axios = require('axios');
require('dotenv').config()
const Prometheus = require('prom-client')




// const pool = new Pool({
//   user: "your_username",
//   host: "localhost",
//   database: "your_database_name",
//   password: "your_password",
//   port: 5432
// })

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
})

// const pool = new Pool({
//   user: "demo",
//   host: "localhost",
//   database: "demo",
//   password: "demo",
//   port: 5432
// })

pool.connect()
  .then(() => {
    return pool.query(
    //   `
    //   CREATE TABLE IF NOT EXISTS vegetables (
    //     id SERIAL PRIMARY KEY,
    //     name TEXT NOT NULL,
    //     color TEXT NOT NULL,
    //     quantity INTEGER NOT NULL
    //   )
    // `
    `
    SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';
    `
    // `
    // INSERT INTO vegetables(name, color, quantity) VALUES('potato', 'red', 4) RETURNING * 
    // `
    // `
    // CREATE ROLE exc1 LOGIN PASSWORD 'password' SUPERUSER;
    // GRANT ALL PRIVILEGES ON DATABASE demo TO exc1;
// `
// SELECT * FROM orders
// `

    // `
    // `
    // DROP TABLE IF EXISTS vegatables; 
    // DROP TABLE IF EXISTS vegetables;
    // DROP TABLE IF EXISTS roles;
    // `
    );
  })
  .then((res) => {
    console.log(res)
    console.log('Successfully connected to database and ensured table exists');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });
// const connectDb = async () => {
//   try {
//     await client.connect()
//     const res = await client.query("DROP TABLE IF EXISTS vegatables; CREATE TABLE vegatables\(veggie_id serial PRIMARY KEY, name VARCHAR (255) NOT NULL,color VARCHAR (255) NOT NULL, quantity VARCHAR (255) NOT NULL);")
//     console.log(res)
//     await client.end()
//   }  catch (error) {
//     console.log(error)
//   }
//   }

// Initialize express app and middleware
// const app = express();
app.use(express.json());

app.use(cors());

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
})


app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const responseTimeInMs = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.route.path)
      .observe(responseTimeInMs / 1000); // Convert to seconds
  });
  next();
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
})


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
    .then((result) => res.status(201).json(result.rows[0]))
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