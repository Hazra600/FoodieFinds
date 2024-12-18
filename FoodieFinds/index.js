const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
// const { resolve } = require('path');

const app = express();
const port = 3000;

// app.use(express.static('static'));
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './FoodieFinds/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function getAllResturants() {
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query, []);

  return {resturants : response};
}

app.get('/restaurants', async(req, res) => {
  try {
    let resturantList = await getAllResturants();

    if (resturantList.resturants.length === 0) {
      res.status(404).json({message: "No restaurant found."});
    }

    res.status(200).json(resturantList);
  } catch(error) {
    res.status(500).json({error: error.message});
  }
});

async function getAllResturantsById(id) {
  let query = "SELECT * FROM restaurants where id = ?";
  let response = await db.all(query, [id]);

  return {resturants : response};
}

app.get('/restaurants/details/:id', async(req, res) => {
  try {
    let id = req.params.id;
    let resturantList = await getAllResturantsById(id);

    if (resturantList.resturants.length === 0) {
      res.status(404).json({message: "No restaurant found."});
    }

    res.status(200).json(resturantList);
  } catch(error) {
    res.status(500).json({error: error.message});
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
