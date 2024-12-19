let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './FoodieFinds/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function getAllRestaurants() {
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query, []);

  return {restaurants : response};
}

app.get('/restaurants', async(req, res) => {
  try {
    let resturantList = await getAllRestaurants();

    if (resturantList.restaurants.length === 0) {
      return res.status(404).json({message: "No restaurant found."});
    }

    res.status(200).json(resturantList);
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
});

async function getAllRestaurantsById(id) {
  let query = "SELECT * FROM restaurants where id = ?";
  let response = await db.all(query, [id]);

  return {restaurants : response};
}

app.get('/restaurants/details/:id', async(req, res) => {
  try {
    let id = req.params.id;
    let resturantList = await getAllRestaurantsById(id);

    if (resturantList.restaurants.length === 0) {
      return res.status(404).json({message: "No restaurant found for id : " + id});
    }

    res.status(200).json(resturantList);
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
});

async function getAllRestaurantsByCuisine(cuisine) {
  let query = "Select * from restaurants where cuisine = ?";
  let response = await db.all(query, [cuisine]);
  return {restaurants : response};
}

app.get('/restaurants/cuisine/:cuisine', async(req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let resturantList = await getAllRestaurantsByCuisine(cuisine);

    if (resturantList.restaurants.length === 0) {
      return res.status(404).json({message: "No restaurant found for cuisine : " + cuisine});
    }

    res.status(200).json(resturantList);
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
});

async function getAllRestaurantsByFilters(isVeg, hasOutdoorSeating, isLuxury) {
  let query = "Select * from restaurants where isVeg = ? and hasOutdoorSeating = ? and isLuxury = ?";
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return {restaurants : response};
}

app.get('/restaurants/filter', async(req, res) => {
try{
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
  
    let resturantList = await getAllRestaurantsByFilters(isVeg, hasOutdoorSeating, isLuxury);
  
    if (resturantList.restaurants.length === 0) {
      return res.status(404).json({message: "No restaurant found to apply filter."});
    }
  
    res.status(200).json(resturantList);
} catch(error) {
  return res.status(500).json({error: error.message});
}
});

async function getAllRestaurantBySortedRating() {
  let query = "Select * from restaurants Order By rating desc";
  let response = await db.all(query, []);

  return {restaurants : response};
}


app.get('/restaurants/sort-by-rating', async(req, res) => {
  try {
    let restaurantList = await getAllRestaurantBySortedRating();

    if (restaurantList.restaurants.length === 0) {
      return res.status(404).json({message : "No restaurant found for sorting by rating."});
    }
    res.status(200).json(restaurantList);
  } catch(error) {
    return res.status(500).json({error : error.message});
  }
});

async function getAllDishes() {
  let query = "Select * from dishes";
  let response = await db.all(query, []);

  return {dishes : response};
}

app.get('/dishes', async(req, res) => {
  try {
    let dishesList = await getAllDishes();

    if (dishesList.dishes.length === 0) {
      return res.status(404).json({message : "No dishes found."});
    }

    res.status(200).json(dishesList);
  } catch(error) {
    return res.status(500).json({error : error.message});
  }
});

async function getAllDishesById(id) {
  let query = "Select * from dishes where id = ?";
  let response = await db.all(query, [id]);

  return {dishes : response};
}

app.get('/dishes/details/:id', async(req, res) => {
  try {
    let id = req.params.id;
    let dishesList = await getAllDishesById(id);

    if (dishesList.dishes.length === 0) {
      return res.status(404).json({message : "No dishes found for id : " + id});
    }

    res.status(200).json(dishesList);
  } catch(error) {
    return res.status(500).json({error : error.message});
  }
});

async function getAllDishesByFilter(isVeg) {
  let query = "Select * from dishes where isVeg = ?";
  let response = await db.all(query, [isVeg]);

  return {dishes : response};
}

app.get('/dishes/filter', async(req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let dishesList = await getAllDishesByFilter(isVeg);

    if (dishesList.dishes.length === 0) {
      return res.status(404).json({message : "No dishes found for filter isVeg : " +isVeg});
    }

    res.status(200).json(dishesList);
  } catch(error) {
    return res.status(500).json({error : error.message});
  }
});


async function getAllDishesSortedByPrice() {
  let query = "Select * from dishes Order By price";
  let response = await db.all(query, []);

  return {dishes : response};
}

app.get('/dishes/sort-by-price', async(req, res) => {
  try {
    let dishesList = await getAllDishesSortedByPrice();

    if (dishesList.dishes.length === 0) {
      return res.status(404).json({message : "No dishes found to sort by price"});
    }

    res.status(200).json(dishesList);
  } catch(error) {
    return res.status(500).json({error : error.message});
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

