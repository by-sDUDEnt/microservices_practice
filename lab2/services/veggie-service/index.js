const express = require('express');
const { Pool } = require('pg');
var cors = require('cors')
const app = express();



// Hardcoded JSON database of vegetables
let vegetables = [
  { id: 1, name: 'Carrots', color: 'Orange', quantity: 10 },
  { id: 2, name: 'Broccoli', color: 'Green', quantity: 5 },
  { id: 3, name: 'Eggplant', color: 'Purple', quantity: 3 }
];

// const pool = new Pool({
//   user: "your_username",
//   host: "localhost",
//   database: "your_database_name",
//   password: "your_password",
//   port: 5432
// })

// const pool = new Pool({
//   user: "demo",
//   host: "postgres",
//   database: "demo",
//   password: "demo",
//   port: 5432
// })

const pool = new Pool({
  user: "demo",
  host: "localhost",
  database: "demo",
  password: "demo",
  port: 5432
})

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
// SELECT * FROM vegetables
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

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  });